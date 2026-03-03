import React, { useMemo, useRef, useState } from "react"
import {
  Animated,
  PanResponder,
  Text,
  View,
  type ImageSourcePropType,
  type LayoutRectangle,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import type { Theme, ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"
import { Button } from "@/components/Button"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { PlayerCard } from "@/components/ui/PlayerCard"
import { router } from "expo-router"

export type TeamGridPlayer = Player & { avatarUri?: string }
type ThemeFn = <T>(styleFn: (theme: any) => T) => T
type CardVisualPreset = {
  cardBackgroundSource: ImageSourcePropType
  textColor: string
}

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
  theme: Theme

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
  leftCenterNumber?: number | string
  rightCenterNumber?: number | string
}

const LIGHT_TEAM_CARD_PRESETS: Record<TeamId, CardVisualPreset> = {
  teamA: {
    cardBackgroundSource: require("../../../assets/images/playercard_gold_blue.png"),
    textColor: "#111111",
  },
  teamB: {
    cardBackgroundSource: require("../../../assets/images/playercard_gold_red.png"),
    textColor: "#111111",
  },
}

const DARK_TEAM_CARD_PRESETS: Record<TeamId, CardVisualPreset> = {
  teamA: {
    cardBackgroundSource: require("../../../assets/images/playercard_silver_blue.png"),
    textColor: "#111111",//"#F5F7FA",
  },
  teamB: {
    cardBackgroundSource: require("../../../assets/images/playercard_silver_red.png"),
    textColor: "#111111",//"#F5F7FA",
  },
}

const GRID_GAP = 12

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

type NormPoint = { x: number; y: number }

/** evenly-spaced centers across a row inside [left..right] */
function rowXs(n: number, left = 0.18, right = 0.82): number[] {
  if (n <= 1) return [(left + right) / 2]
  const step = (right - left) / (n - 1)
  return Array.from({ length: n }, (_, i) => left + i * step)
}

/**
 * Build rows (back -> front) with fixed y-levels.
 * Example rows: [4,4,2] means 4 defenders, 4 mids, 2 forwards.
 */
function rowsLayout(rows: number[], ys: number[]): NormPoint[] {
  const pts: NormPoint[] = []
  for (let r = 0; r < rows.length; r++) {
    const xs = rowXs(rows[r])
    for (const x of xs) pts.push({ x, y: ys[r] })
  }
  return pts
}

/**
 * 1–6: volleyball-ish
 * 7–11: soccer-ish (back line -> midfield -> forwards)
 *
 * Coordinates are normalized CENTERS in [0..1].
 */
export function layoutPreset(count: number): NormPoint[] {
  switch (count) {
    // ---- volleyball-ish ----
    case 1:
      return [{ x: 0.5, y: 0.5 }]
    case 2:
      return [
        { x: 0.33, y: 0.5 },
        { x: 0.66, y: 0.5 },
      ]
    case 3:
      return [
        { x: 0.5, y: 0.30 },
        { x: 0.33, y: 0.68 },
        { x: 0.67, y: 0.68 },
      ]
    case 4:
      return [
        { x: 0.5, y: 0.20 },
        { x: 0.20, y: 0.5 },
        { x: 0.80, y: 0.5 },
        { x: 0.5, y: 0.80 },
      ]
    case 5:
      return [
        { x: 0.20, y: 0.28 },
        { x: 0.5, y: 0.28 },
        { x: 0.80, y: 0.28 },
        { x: 0.35, y: 0.70 },
        { x: 0.65, y: 0.70 },
      ]
    case 6:
      // classic 3x2
      return [
        { x: 0.25, y: 0.32 },
        { x: 0.5, y: 0.32 },
        { x: 0.75, y: 0.32 },
        { x: 0.25, y: 0.70 },
        { x: 0.5, y: 0.70 },
        { x: 0.75, y: 0.70 },
      ]

    // ---- soccer-ish ----
    // y's are back -> front (defenders near top, forwards near bottom)
    // tweak these 3 values if you want tighter spacing
    case 7:
      // 3-3-1
      return rowsLayout([3, 3, 1], [0.22, 0.50, 0.78])
    case 8:
      // 3-3-2
      return rowsLayout([3, 3, 2], [0.22, 0.50, 0.78])
    case 9:
      // 4-3-2
      return rowsLayout([4, 3, 2], [0.22, 0.50, 0.78])
    case 10:
      // 4-4-2
      return rowsLayout([4, 4, 2], [0.22, 0.50, 0.78])
    case 11:
      // 4-3-3
      return rowsLayout([4, 3, 3], [0.20, 0.50, 0.80])

    default: {
      // generic: pick a sensible soccer-ish distribution
      // up to 14: keep 3 rows; beyond that: 4 rows
      if (count <= 14) {
        const back = Math.min(5, Math.max(3, Math.round(count * 0.36)))
        const front = Math.min(4, Math.max(2, Math.round(count * 0.27)))
        const mid = count - back - front
        return rowsLayout([back, mid, front], [0.20, 0.50, 0.80])
      }

      // 4-row fallback (rare)
      const cols = 4
      const rows = Math.ceil(count / cols)
      const pts: NormPoint[] = []
      for (let i = 0; i < count; i++) {
        const c = i % cols
        const r = Math.floor(i / cols)
        const x = (c + 1) / (cols + 1)
        const y = (r + 1) / (rows + 1)
        pts.push({ x, y })
      }
      return pts
    }
  }
}

function getSlotPositionNormalized(
  index: number,
  layout?: readonly { x: number; y: number }[],
  columnsFallback = 2,
  totalCount = 1,
) {
  if (layout && layout[index]) return layout[index]

  const cols = Math.max(1, columnsFallback)
  const rows = Math.max(1, Math.ceil(totalCount / cols))

  const col = index % cols
  const row = Math.floor(index / cols)

  // normalized CENTER positions
  return {
    x: (col + 1) / (cols + 1),
    y: (row + 1) / (rows + 1),
  }
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

  const p = getSlotPositionNormalized(index, layout, columnsFallback, params.count)

  const usableW = teamRect.width
  const usableH = teamRect.height

  // Interpret p.x/p.y as normalized CENTER positions in [0..1]
  // (0,0) = top-left corner of the TEAM AREA, (1,1) = bottom-right
  const cx = p.x * usableW
  const cy = p.y * usableH

  // Convert center to top-left
  const rawX = cx - cardWidth / 2
  const rawY = cy - cardHeight / 2

  // Snap to grid a bit (optional)
  const snappedX = Math.round(rawX / gap) * gap
  const snappedY = Math.round(rawY / gap) * gap

  return {
    x: teamRect.x + clamp(snappedX, 0, Math.max(0, usableW - cardWidth)),
    y: teamRect.y + clamp(snappedY, 0, Math.max(0, usableH - cardHeight)),
    width: cardWidth,
    height: cardHeight,
  }
}

type DraggablePlayerCellCombinedProps = {
  player: TeamGridPlayer
  team: TeamId
  index: number

  cardWidth: number
  borderColor: string
  placeholderAvatarSource: any
  cardVisualPreset: CardVisualPreset
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
  cardVisualPreset,
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
        name={player.name}
        number={index + 1}
        playerPng={player.avatarUri ? { uri: player.avatarUri } : undefined}
        placeholderAvatarSource={placeholderAvatarSource}
        cardBackgroundSource={cardVisualPreset.cardBackgroundSource}
        textColor={cardVisualPreset.textColor}
        cardWidth={cardWidth}
        themed={themed}
        //style={{ borderColor, borderWidth: 2 }} //TODO bordercolor is still a prop for many parts here, but it is no longer needed
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
  theme,
  layoutA,
  layoutB,
  teamAButtonLabel = "Team A",
  teamBButtonLabel = "Team B",
  onPressTeamAButton,
  onPressTeamBButton,
  leftCenterNumber = 0,
  rightCenterNumber = 0,
}: CombinedTeamsGridProps) => {
  const [containerW, setContainerW] = useState(0)
  const [containerH, setContainerH] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const teamCardPresets = theme.isDark ? DARK_TEAM_CARD_PRESETS : LIGHT_TEAM_CARD_PRESETS


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

const cardWidth = useMemo(() => {
  if (leftW <= 0) return 75
  // choose a “preferred cols” for current team size
  const maxCount = Math.max(teamA.length, teamB.length)
  const cols = maxCount <= 4 ? 2 : maxCount <= 6 ? 3 : 4
  const base = (leftW - GRID_GAP * (cols - 1)) / cols
  return Math.max(72, base - CARD_WIDTH_SHRINK)
}, [leftW, teamA.length, teamB.length])

const cardHeight = Math.round(cardWidth / 0.71)

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

  const centerNumbersTop = Math.max(10, containerH / 2 - 44)

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

const effectiveLayoutA = (layoutA && layoutA.length > 0) ? layoutA : layoutPreset(teamA.length)
const effectiveLayoutB = (layoutB && layoutB.length > 0) ? layoutB : layoutPreset(teamB.length)

const slotRectsA = useMemo(() => {
  return teamA.map((_p, i) =>
    slotRectFromNormalized({
      index: i,
      count: teamA.length,
      teamRect: teamARect,
      cardWidth,
      cardHeight: cardHeight,
      gap: GRID_GAP,
      layout: effectiveLayoutA,
      columnsFallback: columns,
    }),
  )
}, [cardWidth, columns, effectiveLayoutA, teamA, teamARect])

const slotRectsB = useMemo(() => {
  return teamB.map((_p, i) =>
    slotRectFromNormalized({
      index: i,
      count: teamB.length,
      teamRect: teamBRect,
      cardWidth,
      cardHeight: cardHeight,
      gap: GRID_GAP,
      layout: effectiveLayoutB,
      columnsFallback: columns,
    }),
  )
}, [cardWidth, columns, effectiveLayoutB, teamB, teamBRect])

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
          cardVisualPreset={teamCardPresets.teamA}
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
          cardVisualPreset={teamCardPresets.teamB}
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
        <View style={[themed($centerNumbersStack), { top: centerNumbersTop }]}>
          <View pointerEvents="none" style={themed($centerNumberBox)}>
            <Text style={themed($centerNumberText)}>{leftCenterNumber}</Text>
          </View>
          <View pointerEvents="none" style={themed($centerNumberBox)}>
            <Text style={themed($centerNumberText)}>{rightCenterNumber}</Text>
          </View>
        </View>

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
            <Button // TODO maybe paremetrize this button
              onPress={() => alert('Shuffle')}
              style={[themed($railButton),]} // { minHeight: 44, height:44, borderRadius: 10 }]}
              //textStyle={themed($railButtonText)} //not needed
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="shuffle" color={theme.colors.iconColor} iconSet="fontawesome6"
                  />
                </View>
              )}
            />

            <View style={{ height: 12 }} />

            <Button // TODO maybe paremetrize this button
              onPress={() => router.push('/PreviewScreen')} //TODO this is just temporary, change this later.
              style={[themed($railButton),]} // { minHeight: 44, height:44, borderRadius: 10 }]}
              //textStyle={themed($railButtonText)} //not needed
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="info-outline" color={theme.colors.iconColor} iconSet="material"
                  />
                </View>
              )}
            />

            <View style={{ height: 12 }} />

            <Button // TODO maybe paremetrize this button
              onPress={() => alert('Winner')}
              style={[themed($winnerButton),]} // { minHeight: 44, height:44, borderRadius: 10 }]}
              //textStyle={themed($railButtonText)} //not needed
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="check" color={theme.colors.iconColor} iconSet="fontawesome"
                  />
                </View>
              )}
            />

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
  justifyContent: "flex-end",
  alignItems: "flex-end",
  borderLeftWidth: 1,
  borderLeftColor: theme.colors.border,
  overflow: "visible",
  paddingBottom: 14,
  paddingLeft: 8,
  paddingRight: 4,
})

const $railButtons: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "flex-end",
  alignItems: "stretch",
  width: "100%",
  paddingHorizontal: 2,
})

const $railButton: ThemedStyle<ViewStyle> = (theme) => ({
  //height: 70,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.itemBackground,
})

const $winnerButton: ThemedStyle<ViewStyle> = (theme) => ({
  //height: 70,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.palette.green500,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.palette.green500,
})

const $railButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
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

const $centerNumberBox: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  height: 36,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.surface,
  alignItems: "center",
  justifyContent: "center",
})

const $centerNumberText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
  fontSize: 16,
})

const $centerNumbersStack: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  left: 6,
  right: 6,
  gap: 8,
})
