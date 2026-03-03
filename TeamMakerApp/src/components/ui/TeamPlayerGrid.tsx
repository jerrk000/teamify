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

  onSwapAcrossTeams: (from: PlayerPointer, to: PlayerPointer) => void
  onMoveIntoTeam: (from: PlayerPointer, toTeam: TeamId) => void

  placeholderAvatarSource: any
  teamABorderColor: string
  teamBBorderColor: string
  themed: ThemeFn
  theme: Theme

  // Optional: define slot positions per team as normalized coords between 0 and 1
  layoutA?: readonly { x: number; y: number }[]
  layoutB?: readonly { x: number; y: number }[]

  leftCenterNumber?: number | string
  rightCenterNumber?: number | string
}

const LIGHT_TEAM_CARD_PRESETS: Record<TeamId, CardVisualPreset> = {
  teamA: { cardBackgroundSource: require("../../../assets/images/playercard_gold_blue.png"), textColor: "#111111" }, //TODO hardcoded color
  teamB: { cardBackgroundSource: require("../../../assets/images/playercard_gold_red.png"), textColor: "#111111" },
}

const DARK_TEAM_CARD_PRESETS: Record<TeamId, CardVisualPreset> = {
  teamA: { cardBackgroundSource: require("../../../assets/images/playercard_silver_blue.png"), textColor: "#111111" },
  teamB: { cardBackgroundSource: require("../../../assets/images/playercard_silver_red.png"), textColor: "#111111" },
}

const GRID_GAP = 12
const ZONE_GAP = 10

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

const rectCenter = (r: LayoutRectangle) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 })
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

const rectToStyle = (r: LayoutRectangle) => ({ left: r.x, top: r.y, width: r.width, height: r.height })

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
    for (const x of rowXs(rows[r])) pts.push({ x, y: ys[r] })
  }
  return pts
}

/** normalized CENTER positions in [0..1] */
export function layoutPreset(count: number): NormPoint[] {
  switch (count) {
    case 1:
      return [{ x: 0.5, y: 0.5 }]
    case 2:
      return [
        { x: 0.28, y: 0.5 },
        { x: 0.72, y: 0.5 },
      ]
    case 3:
      return [
        { x: 0.5, y: 0.30 },
        { x: 0.33, y: 0.68 },
        { x: 0.67, y: 0.68 },
      ]
    case 4:
      return [
        { x: 0.5, y: 0.2 },
        { x: 0.2, y: 0.5 },
        { x: 0.8, y: 0.5 },
        { x: 0.5, y: 0.8 },
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
      return [
        { x: 0.25, y: 0.32 },
        { x: 0.5, y: 0.32 },
        { x: 0.75, y: 0.32 },
        { x: 0.25, y: 0.7 },
        { x: 0.5, y: 0.7 },
        { x: 0.75, y: 0.7 },
      ]
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
      // generic: sensible soccer-ish distribution
      // up to 14: keep 3 rows; beyond that: 4 rows
      if (count <= 14) {
        const back = Math.min(5, Math.max(3, Math.round(count * 0.36)))
        const front = Math.min(4, Math.max(2, Math.round(count * 0.27)))
        const mid = count - back - front
        return rowsLayout([back, mid, front], [0.2, 0.5, 0.8])
      }
      const cols = 4
      const rows = Math.ceil(count / cols)
      return Array.from({ length: count }, (_, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        return { x: (c + 1) / (cols + 1), y: (r + 1) / (rows + 1) }
      })
    }
  }
}

function slotRectFromNormalized(params: {
  index: number
  teamRect: LayoutRectangle
  cardWidth: number
  cardHeight: number
  layout: readonly { x: number; y: number }[]
}): LayoutRectangle {
  const { index, teamRect, cardWidth, cardHeight, layout } = params

  const p = layout[index]
  if (!p) {
    throw new Error(`Missing layout position for index ${index}`)
  }

  const cx = p.x * teamRect.width
  const cy = p.y * teamRect.height

  const rawX = cx - cardWidth / 2
  const rawY = cy - cardHeight / 2

  return {
    x: teamRect.x + clamp(rawX, 0, Math.max(0, teamRect.width - cardWidth)),
    y: teamRect.y + clamp(rawY, 0, Math.max(0, teamRect.height - cardHeight)),
    width: cardWidth,
    height: cardHeight,
  }
}

type DraggablePlayerCellCombinedProps = {
  player: TeamGridPlayer
  team: TeamId
  index: number

  cardWidth: number
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
        onMoveShouldSetPanResponder: (_evt, g) => Math.abs(g.dx) + Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          setIsActive(true)
          onDragStateChange(true)
          pan.setValue({ x: 0, y: 0 })
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_evt, g) => {
          const from: PlayerPointer = { team, index }
          const target = getDropTarget(from, g.dx, g.dy)
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
      />
    </Animated.View>
  )
}

export const CombinedTeamsGrid = ({
  teamA,
  teamB,
  onSwapAcrossTeams,
  onMoveIntoTeam,
  placeholderAvatarSource,
  themed,
  theme,
  layoutA,
  layoutB,
  leftCenterNumber = 0,
  rightCenterNumber = 0,
}: CombinedTeamsGridProps) => {
  const [containerW, setContainerW] = useState(0)
  const [containerH, setContainerH] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const teamCardPresets = theme.isDark ? DARK_TEAM_CARD_PRESETS : LIGHT_TEAM_CARD_PRESETS

  const leftW = containerW * 0.8 //LEFT CONTAINER
  const railW = containerW * 0.2 //RIGHT CONTAINER

  const cardWidth = useMemo(() => {
    if (leftW <= 0) return 75
    const maxCount = Math.max(teamA.length, teamB.length)
    const scaling = maxCount <= 2 ? 1 : maxCount <= 4 ? 1.5 : maxCount <= 6 ? 2 : 3
    return Math.max(72, (leftW * 0.4) / scaling)
  }, [leftW, teamA.length, teamB.length])

  const cardHeight = Math.round(cardWidth / 0.71)

  const teamAHeight = containerH / 2 - GRID_GAP / 2
  const teamBHeight = containerH / 2 - GRID_GAP / 2

  const teamARect: LayoutRectangle = { x: 0, y: 0, width: leftW, height: teamAHeight }
  const teamBRect: LayoutRectangle = { x: 0, y: teamAHeight + GRID_GAP, width: leftW, height: teamBHeight }
  const railRect: LayoutRectangle = { x: leftW, y: 0, width: railW, height: containerH }

  const zoneHeight = (railRect.height - ZONE_GAP) / 2
  const zoneATarget: LayoutRectangle = { x: railRect.x, y: railRect.y, width: railRect.width, height: zoneHeight }
  const zoneBTarget: LayoutRectangle = {
    x: railRect.x,
    y: railRect.y + zoneHeight + ZONE_GAP,
    width: railRect.width,
    height: zoneHeight,
  }

  type TargetRect = { target: DropTarget; rect: LayoutRectangle }
  const targetRectsRef = useRef<TargetRect[]>([])

  const effectiveLayoutA = layoutA?.length ? layoutA : layoutPreset(teamA.length)
  const effectiveLayoutB = layoutB?.length ? layoutB : layoutPreset(teamB.length)

  const slotRectsA = useMemo(
    () =>
      teamA.map((_p, i) =>
        slotRectFromNormalized({
          index: i,
          teamRect: teamARect,
          cardWidth,
          cardHeight,
          layout: effectiveLayoutA,
        }),
      ),
    [cardWidth, cardHeight, effectiveLayoutA, teamA, teamARect],
  )

  const slotRectsB = useMemo(
    () =>
      teamB.map((_p, i) =>
        slotRectFromNormalized({
          index: i,
          teamRect: teamBRect,
          cardWidth,
          cardHeight,
          layout: effectiveLayoutB,
        }),
      ),
    [cardWidth, cardHeight, effectiveLayoutB, teamB, teamBRect],
  )

  const targets = useMemo(() => {
    const t: TargetRect[] = []
    for (let i = 0; i < slotRectsA.length; i++) t.push({ target: { kind: "player", team: "teamA", index: i }, rect: slotRectsA[i] })
    for (let i = 0; i < slotRectsB.length; i++) t.push({ target: { kind: "player", team: "teamB", index: i }, rect: slotRectsB[i] })
    t.push({ target: { kind: "zone", team: "teamA" }, rect: zoneATarget })
    t.push({ target: { kind: "zone", team: "teamB" }, rect: zoneBTarget })
    return t
  }, [slotRectsA, slotRectsB, zoneATarget, zoneBTarget])

  targetRectsRef.current = targets

  const getDropTarget = (from: PlayerPointer, dx: number, dy: number): DropTarget | null => {
    const rects = targetRectsRef.current
    if (!rects.length) return null

    const originRect = from.team === "teamA" ? slotRectsA[from.index] : slotRectsB[from.index]
    if (!originRect) return null

    const draggedRect: LayoutRectangle = { x: originRect.x + dx, y: originRect.y + dy, width: originRect.width, height: originRect.height }

    // overlap first
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

    // fallback nearest center
    const draggedCenter = rectCenter(draggedRect)
    let best: TargetRect | null = null
    let bestD2 = Number.POSITIVE_INFINITY
    for (const r of rects) {
      const d2v = dist2(draggedCenter, rectCenter(r.rect))
      if (d2v < bestD2) {
        bestD2 = d2v
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

  const centerNumbersTop = Math.max(10, containerH / 2 - 44)

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
            <View pointerEvents="none" style={[themed($joinZone), rectToStyle({ x: 0, y: 0, width: railRect.width, height: zoneHeight })]}>
              <Text style={themed($joinZoneText)}>Drop to join Team A</Text>
            </View>
            <View pointerEvents="none" style={[themed($joinZone), rectToStyle({ x: 0, y: zoneHeight + ZONE_GAP, width: railRect.width, height: zoneHeight })]}>
              <Text style={themed($joinZoneText)}>Drop to join Team B</Text>
            </View>
          </>
        ) : (
          <View style={themed($railButtons)}>
            <Button // TODO maybe paremetrize this button
              onPress={() => alert('Shuffle')}
              style={[themed($railButton),]} 
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="shuffle" color={theme.colors.iconColor} iconSet="fontawesome6" />
                </View>
              )}
            />
            <View style={{ height: 12 }} />

            <Button // TODO maybe paremetrize this button
              onPress={() => router.push('/PreviewScreen')} //TODO this is just temporary, change this later.
              style={[themed($railButton),]} 
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="info-outline" color={theme.colors.iconColor} iconSet="material" />
                </View>
              )}
            />
            <View style={{ height: 12 }} />

            <Button // TODO maybe paremetrize this button
              onPress={() => alert('Show past matches')} //TODO this is just temporary, change this later.
              style={[themed($railButton),]} 
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="book" color={theme.colors.iconColor} iconSet="fontawesome" />
                </View>
              )}
            />

            <View style={{ height: 12 }} />

            <Button // TODO maybe paremetrize this button
              onPress={() => alert('Winner')}
              style={[themed($winnerButton),]}
              RightAccessory={({ style }) => (
                <View style={style}>
                  <IconSymbol size={28} name="check" color={theme.colors.iconColor} iconSet="fontawesome" />
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
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.itemBackground,
})

const $winnerButton: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.palette.green500,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.palette.green500,
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