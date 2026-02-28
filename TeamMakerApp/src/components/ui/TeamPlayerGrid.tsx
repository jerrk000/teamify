import React, { useMemo, useRef, useState } from "react"
import {
  Animated,
  Image,
  PanResponder,
  Text,
  View,
  Pressable,
  type ImageStyle,
  type LayoutRectangle,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

export type TeamGridPlayer = Player & { avatarUri?: string }
type ThemeFn = <T>(styleFn: (theme: any) => T) => T

export type TeamId = "teamA" | "teamB"
export type PlayerPointer = { team: TeamId; index: number }

export type DropTarget =
  | { kind: "player"; team: TeamId; index: number }
  | { kind: "zone"; team: TeamId } // join zone (right rail)

export type CombinedTeamsGridProps = {
  teamA: TeamGridPlayer[]
  teamB: TeamGridPlayer[]

  /** Left grid columns (for 4 players per team you probably want 2). */
  columns?: number

  onSwapAcrossTeams: (from: PlayerPointer, to: PlayerPointer) => void
  onMoveIntoTeam: (from: PlayerPointer, toTeam: TeamId) => void

  placeholderAvatarSource: any
  teamABorderColor: string
  teamBBorderColor: string
  themed: ThemeFn

  /**
   * Optional: define slot positions per team as normalized coords [0..1]
   * relative to the TEAM AREA (not the whole screen).
   * If omitted, defaults to a 2x2 layout for the first 4 indices.
   */
  layoutA?: readonly { x: number; y: number }[]
  layoutB?: readonly { x: number; y: number }[]

  /** Optional right-rail button labels (idle state) */
  teamAButtonLabel?: string
  teamBButtonLabel?: string
  onPressTeamAButton?: () => void
  onPressTeamBButton?: () => void
}

const GRID_GAP = 12
const PLAYER_CARD_HEIGHT = 92

const RAIL_MIN_W = 110
const RAIL_MAX_W = 160
const RAIL_GAP = 12

const ZONE_HEIGHT = 72
const ZONE_GAP = 12

const CARD_WIDTH_SHRINK = 16

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const rectCenter = (r: LayoutRectangle) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 })

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

const rectToStyle = (r: LayoutRectangle) => ({
  left: r.x,
  top: r.y,
  width: r.width,
  height: r.height,
})

const intersectionArea = (a: LayoutRectangle, b: LayoutRectangle) => {
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.width, b.x + b.width)
  const y2 = Math.min(a.y + a.height, b.y + b.height)
  const w = x2 - x1
  const h = y2 - y1
  if (w <= 0 || h <= 0) return 0
  return w * h
}

/**
 * Default 2x2 normalized positions (4 slots).
 * (0,0) top-left; (1,1) bottom-right.
 */
const DEFAULT_2X2_LAYOUT: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
]

function getSlotPositionNormalized(
  index: number,
  layout?: readonly { x: number; y: number }[],
  columnsFallback = 2,
) {
  // If layout provided and has index, use it.
  if (layout && layout[index]) return layout[index]

  // Otherwise fallback to grid-like normalized coords.
  // For 4 players default feels best as 2x2.
  if (!layout && index < DEFAULT_2X2_LAYOUT.length) return DEFAULT_2X2_LAYOUT[index]

  // Generic fallback: columns-based normalized position
  const col = index % columnsFallback
  const row = Math.floor(index / columnsFallback)
  return { x: col, y: row }
}

function slotRectFromNormalized(params: {
  index: number
  count: number
  teamRect: LayoutRectangle
  cardWidth: number
  cardHeight: number
  gap: number
  layout?: readonly { x: number; y: number }[]
  columnsFallback: number
}) {
  const { index, teamRect, cardWidth, cardHeight, gap, layout, columnsFallback } = params

  const n = getSlotPositionNormalized(index, layout, columnsFallback)

  // If user layout is normalized [0..1], treat x/y as {0,1} for 2x2 etc.
  // If user provides more granular values, it still works (relative).
  // We interpret:
  // - if x/y <= 1 => normalized
  // - else => "grid units" (0..N) with implied normalization
  const isNormalized = n.x <= 1 && n.y <= 1

  const usableW = teamRect.width
  const usableH = teamRect.height

  // Place cards inside team rect with a simple scheme:
  // - For normalized: x/y in [0..1], map to 2 columns/rows extents (0 or 1)
  // - For grid units: spread similarly but without needing team rows count.
  const denomX = isNormalized ? 1 : Math.max(1, n.x)
  const denomY = isNormalized ? 1 : Math.max(1, n.y)

  const x = isNormalized
    ? n.x * (usableW - cardWidth) // 0 or 1 will align left/right edges
    : (n.x / denomX) * (usableW - cardWidth)

  const y = isNormalized
    ? n.y * (usableH - cardHeight) // 0 or 1 align top/bottom edges
    : (n.y / denomY) * (usableH - cardHeight)

  // Add a little internal padding-like spacing by snapping to gap grid.
  const snappedX = Math.round(x / gap) * gap
  const snappedY = Math.round(y / gap) * gap

  return {
    x: teamRect.x + clamp(snappedX, 0, Math.max(0, usableW - cardWidth)),
    y: teamRect.y + clamp(snappedY, 0, Math.max(0, usableH - cardHeight)),
    width: cardWidth,
    height: cardHeight,
  }
}

type PlayerCardProps = {
  player: TeamGridPlayer
  placeholderAvatarSource: any
  cardWidth: number
  cardHeight: number
  borderColor: string
  themed: ThemeFn
}

const PlayerCard = ({
  player,
  placeholderAvatarSource,
  cardWidth,
  cardHeight,
  borderColor,
  themed,
}: PlayerCardProps) => {
  const imageSource = player.avatarUri ? { uri: player.avatarUri } : placeholderAvatarSource
  return (
    <View style={[themed($playerCard), { width: cardWidth, height: cardHeight, borderColor }]}>
      <Image source={imageSource} style={themed($playerAvatar)} resizeMode="cover" />
      <Text style={themed($playerName)} numberOfLines={1} ellipsizeMode="tail">
        {player.name}
      </Text>
    </View>
  )
}

type DraggablePlayerCellCombinedProps = {
  player: TeamGridPlayer
  team: TeamId
  index: number

  cardWidth: number
  borderColor: string
  placeholderAvatarSource: any
  themed: ThemeFn

  getDropTarget: (from: PlayerPointer, dx: number, dy: number) => DropTarget | null
  onDropOnTarget: (from: PlayerPointer, target: DropTarget) => void

  // absolute rect (within the container) where this slot sits
  slotRect: LayoutRectangle

  onDragStateChange: (dragging: boolean) => void
}

const DraggablePlayerCellCombined = ({
  player,
  team,
  index,
  cardWidth,
  borderColor,
  placeholderAvatarSource,
  themed,
  getDropTarget,
  onDropOnTarget,
  slotRect,
  onDragStateChange,
}: DraggablePlayerCellCombinedProps) => {
  const [isActive, setIsActive] = useState(false)
  const pan = useMemo(() => new Animated.ValueXY({ x: 0, y: 0 }), [])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          const movement = Math.abs(gestureState.dx) + Math.abs(gestureState.dy)
          return movement > 4
        },
        onPanResponderGrant: () => {
          setIsActive(true)
          onDragStateChange(true)
          pan.setValue({ x: 0, y: 0 })
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_evt, gestureState) => {
          const from: PlayerPointer = { team, index }
          const target = getDropTarget(from, gestureState.dx, gestureState.dy)
          if (target) onDropOnTarget(from, target)

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 22,
            bounciness: 5,
          }).start(() => {
            setIsActive(false)
            onDragStateChange(false)
          })
        },
        onPanResponderTerminate: () => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 22,
            bounciness: 5,
          }).start(() => {
            setIsActive(false)
            onDragStateChange(false)
          })
        },
      }),
    [getDropTarget, index, onDragStateChange, onDropOnTarget, pan, team],
  )

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        themed($cardWrapper),
        {
          left: slotRect.x,
          top: slotRect.y,
          width: slotRect.width,
          height: slotRect.height,
          zIndex: isActive ? 100 : 1,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: isActive ? 1.03 : 1 }],
        },
      ]}
    >
      <PlayerCard
        player={player}
        placeholderAvatarSource={placeholderAvatarSource}
        cardWidth={cardWidth}
        cardHeight={PLAYER_CARD_HEIGHT}
        borderColor={borderColor}
        themed={themed}
      />
    </Animated.View>
  )
}

export const CombinedTeamsGrid = ({
  teamA,
  teamB,
  columns = 2,
  onSwapAcrossTeams,
  onMoveIntoTeam,
  placeholderAvatarSource,
  teamABorderColor,
  teamBBorderColor,
  themed,
  layoutA,
  layoutB,
  teamAButtonLabel = "Team A",
  teamBButtonLabel = "Team B",
  onPressTeamAButton,
  onPressTeamBButton,
}: CombinedTeamsGridProps) => {
  const [containerW, setContainerW] = useState(0)
  const [containerH, setContainerH] = useState(0)
  const [isDragging, setIsDragging] = useState(false)


  const LEFT_RATIO = 0.80
const RAIL_RATIO = 0.20

const railWidth = useMemo(() => {
  if (containerW <= 0) return 120
  return containerW * RAIL_RATIO
}, [containerW])

const leftW = useMemo(() => {
  if (containerW <= 0) return 0
  return containerW * LEFT_RATIO
}, [containerW])

  // Team area heights (left side).
  // For 4 players with 2 columns => 2 rows. We compute from count.
  const rowsA = Math.max(1, Math.ceil(teamA.length / columns))
  const rowsB = Math.max(1, Math.ceil(teamB.length / columns))

  // Card width is driven by leftW and columns.
  const cardWidth = useMemo(() => {
    if (leftW <= 0) return 120
    const base = (leftW - GRID_GAP * (columns - 1)) / columns
    return Math.max(72, base - CARD_WIDTH_SHRINK) // keep a sensible min
  }, [columns, leftW])

  const teamAHeight = containerH / 2 - GRID_GAP / 2
  const teamBHeight = containerH / 2 - GRID_GAP / 2

  // We stack team A and B on the left with a gap between.
  const dividerGap = GRID_GAP
  const leftHeight = teamAHeight + dividerGap + teamBHeight
  const totalHeight = Math.max(leftHeight, Math.max(0, containerH)) // allow container to drive too

  // Left-side rectangles for teams (in container coordinates)
  const teamARect: LayoutRectangle = { x: 0, y: 0, width: leftW, height: teamAHeight }
  const teamBRect: LayoutRectangle = {
    x: 0,
    y: teamAHeight + dividerGap,
    width: leftW,
    height: teamBHeight,
  }

 // Rail is in container coords
const railRect: LayoutRectangle = {
  x: leftW,
  y: 0,
  width: railWidth,
  height: containerH,
}

const ZONE_GAP = 10
const zoneHeight = (railRect.height - ZONE_GAP) / 2

// 1) RENDER rects (relative to rail)
const zoneAView: LayoutRectangle = {
  x: 0,
  y: 0,
  width: railRect.width,
  height: zoneHeight,
}

const zoneBView: LayoutRectangle = {
  x: 0,
  y: zoneHeight + ZONE_GAP,
  width: railRect.width,
  height: zoneHeight,
}

// 2) TARGET rects (absolute in container, used for drop detection)
const zoneATarget: LayoutRectangle = {
  x: railRect.x + zoneAView.x,
  y: railRect.y + zoneAView.y,
  width: zoneAView.width,
  height: zoneAView.height,
}

const zoneBTarget: LayoutRectangle = {
  x: railRect.x + zoneBView.x,
  y: railRect.y + zoneBView.y,
  width: zoneBView.width,
  height: zoneBView.height,
}

  type TargetRect = { target: DropTarget; rect: LayoutRectangle }
  const targetRectsRef = useRef<TargetRect[]>([])

  const slotRectsA = useMemo(() => {
    return teamA.map((_p, i) =>
      slotRectFromNormalized({
        index: i,
        count: teamA.length,
        teamRect: teamARect,
        cardWidth,
        cardHeight: PLAYER_CARD_HEIGHT,
        gap: GRID_GAP,
        layout: layoutA,
        columnsFallback: columns,
      }),
    )
  }, [cardWidth, columns, layoutA, teamA, teamARect])

  const slotRectsB = useMemo(() => {
    return teamB.map((_p, i) =>
      slotRectFromNormalized({
        index: i,
        count: teamB.length,
        teamRect: teamBRect,
        cardWidth,
        cardHeight: PLAYER_CARD_HEIGHT,
        gap: GRID_GAP,
        layout: layoutB,
        columnsFallback: columns,
      }),
    )
  }, [cardWidth, columns, layoutB, teamB, teamBRect])

  const targets = useMemo(() => {
    const t: TargetRect[] = []

    // Player targets Team A
    for (let i = 0; i < slotRectsA.length; i++) {
      t.push({ target: { kind: "player", team: "teamA", index: i }, rect: slotRectsA[i] })
    }

    // Player targets Team B
    for (let i = 0; i < slotRectsB.length; i++) {
      t.push({ target: { kind: "player", team: "teamB", index: i }, rect: slotRectsB[i] })
    }

    // Join zones on the right rail
    t.push({ target: { kind: "zone", team: "teamA" }, rect: zoneATarget })
    t.push({ target: { kind: "zone", team: "teamB" }, rect: zoneBTarget })

    return t
  }, [slotRectsA, slotRectsB, zoneATarget, zoneBTarget])

  targetRectsRef.current = targets

  const getDropTarget = (from: PlayerPointer, dx: number, dy: number): DropTarget | null => {
    const rects = targetRectsRef.current
    if (rects.length === 0) return null

    // Build dragged rect from the originating slot rect.
    const originRect =
      from.team === "teamA" ? slotRectsA[from.index] : slotRectsB[from.index]

    if (!originRect) return null

    const draggedRect: LayoutRectangle = {
      x: originRect.x + dx,
      y: originRect.y + dy,
      width: originRect.width,
      height: originRect.height,
    }

    // 1) Prefer overlap: largest intersection wins
    let bestOverlap: TargetRect | null = null
    let bestArea = 0
    for (const r of rects) {
      const area = intersectionArea(draggedRect, r.rect)
      if (area > bestArea) {
        bestArea = area
        bestOverlap = r
      }
    }
    if (bestOverlap && bestArea > 0) return bestOverlap.target

    // 2) Fallback to nearest center
    const draggedCenter = { x: draggedRect.x + draggedRect.width / 2, y: draggedRect.y + draggedRect.height / 2 }
    let best: TargetRect | null = null
    let bestD2 = Number.POSITIVE_INFINITY
    for (const r of rects) {
      const c = rectCenter(r.rect)
      const d2 = dist2(draggedCenter, c)
      if (d2 < bestD2) {
        bestD2 = d2
        best = r
      }
    }
    return best?.target ?? null
  }

  const onDropOnTarget = (from: PlayerPointer, target: DropTarget) => {
    if (target.kind === "player") {
      if (from.team === target.team && from.index === target.index) return
      onSwapAcrossTeams(from, { team: target.team, index: target.index })
      return
    }

    // join zone
    if (target.team === from.team) return
    onMoveIntoTeam(from, target.team)
  }

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        setContainerW(width)
        setContainerH(height)
      }}
      style={[themed($gridContainer), { flex: 1 }]}
    >
      {/* LEFT: TEAM A */}
      {teamA.map((player, index) => (
        <DraggablePlayerCellCombined
          key={`A-${player.id}`}
          player={player}
          team="teamA"
          index={index}
          cardWidth={cardWidth}
          borderColor={teamABorderColor}
          placeholderAvatarSource={placeholderAvatarSource}
          themed={themed}
          getDropTarget={getDropTarget}
          onDropOnTarget={onDropOnTarget}
          slotRect={slotRectsA[index]}
          onDragStateChange={setIsDragging}
        />
      ))}

      {/* LEFT: TEAM B */}
      {teamB.map((player, index) => (
        <DraggablePlayerCellCombined
          key={`B-${player.id}`}
          player={player}
          team="teamB"
          index={index}
          cardWidth={cardWidth}
          borderColor={teamBBorderColor}
          placeholderAvatarSource={placeholderAvatarSource}
          themed={themed}
          getDropTarget={getDropTarget}
          onDropOnTarget={onDropOnTarget}
          slotRect={slotRectsB[index]}
          onDragStateChange={setIsDragging}
        />
      ))}

      {/* RIGHT RAIL */}
      <View
        style={[themed($rightRail), rectToStyle(railRect)]}
      >
      {isDragging ? (
        <>
          <View
            pointerEvents="none"
            style={[themed($joinZone), { borderColor: teamABorderColor }, rectToStyle(zoneAView)]}
          >
            <Text style={themed($joinZoneText)}>Drop to join Team A</Text>
          </View>

          <View
            pointerEvents="none"
            style={[themed($joinZone), { borderColor: teamBBorderColor }, rectToStyle(zoneBView)]}
          >
            <Text style={themed($joinZoneText)}>Drop to join Team B</Text>
          </View>
        </>
        ) : (
          <View style={themed($railButtons)}>
            <Pressable style={themed($railButton)} onPress={onPressTeamAButton}>
              <Text style={themed($railButtonText)}>{teamAButtonLabel}</Text>
            </Pressable>

            <View style={{ height: 12 }} />

            <Pressable style={themed($railButton)} onPress={onPressTeamBButton}>
              <Text style={themed($railButtonText)}>{teamBButtonLabel}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  )
}

const $gridContainer: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  position: "relative",
})

const $cardWrapper: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
})

const $rightRail: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  justifyContent: "center",
  borderLeftWidth: 1,
  borderLeftColor: theme.colors.border,
  overflow: "visible", 
})

const $railButtons: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 10,
})

const $railButton: ThemedStyle<ViewStyle> = (theme) => ({
  height: 44,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.itemBackground,
})

const $railButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
})



const $playerAvatar: ThemedStyle<ImageStyle> = () => ({
  width: 44,           // was 58
  height: 44,          // was 58
  borderRadius: 22,    // half of width/height
  marginBottom: 8,     // was 10
})

const $playerCard: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 12,
  borderWidth: 2,
  backgroundColor: theme.colors.itemBackground,
  alignItems: "center",
  justifyContent: "center",
  padding: 8,   
})

const $playerName: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
  textAlign: "center",
  fontSize: 13, // TODO may need to adjust based on card width or name length
})

const $joinZone: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  borderWidth: 2,
  borderStyle: "dashed",
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.palette.neutral100,
})

const $joinZoneText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 12,
  textAlign: "center",
  paddingHorizontal: 10,
})