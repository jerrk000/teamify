import React, { useMemo, useRef, useState } from "react"
import {
  Animated,
  Image,
  PanResponder,
  Text,
  View,
  type ImageStyle,
  type LayoutRectangle,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

export type TeamGridPlayer = Player & {
  avatarUri?: string
}

type ThemeFn = <T>(styleFn: (theme: any) => T) => T

export type TeamId = "teamA" | "teamB"

export type PlayerPointer = {
  team: TeamId
  index: number
}

export type DropTarget =
  | { kind: "player"; team: TeamId; index: number }
  | { kind: "zone"; team: TeamId } // empty "join" zone

type PlayerCardProps = {
  player: TeamGridPlayer
  placeholderAvatarSource: any
  cardWidth: number
  cardHeight: number
  borderColor: string
  themed: ThemeFn
}

type TeamPlayerGridProps = {
  players: TeamGridPlayer[]
  columns: number
  onSwapPlayers: (fromIndex: number, toIndex: number) => void
  placeholderAvatarSource: any
  borderColor: string
  themed: ThemeFn
}

export type CombinedTeamsGridProps = {
  teamA: TeamGridPlayer[]
  teamB: TeamGridPlayer[]
  columns: number
  onSwapAcrossTeams: (from: PlayerPointer, to: PlayerPointer) => void
  onMoveIntoTeam: (from: PlayerPointer, toTeam: TeamId) => void
  placeholderAvatarSource: any
  teamABorderColor: string
  teamBBorderColor: string
  themed: ThemeFn
}

export const GRID_COLUMNS_DEFAULT = 2
const GRID_GAP = 12
const PLAYER_CARD_HEIGHT = 120
const ZONE_HEIGHT = 72

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getGridPosition = (index: number, columns: number, cardWidth: number) => {
  const col = index % columns
  const row = Math.floor(index / columns)
  return {
    x: col * (cardWidth + GRID_GAP),
    y: row * (PLAYER_CARD_HEIGHT + GRID_GAP),
  }
}

const getDropIndex = (
  fromIndex: number,
  gestureDx: number,
  gestureDy: number,
  playersCount: number,
  columns: number,
  cardWidth: number,
) => {
  const rows = Math.max(1, Math.ceil(playersCount / columns))
  const fromPosition = getGridPosition(fromIndex, columns, cardWidth)

  const centerX = fromPosition.x + gestureDx + cardWidth / 2
  const centerY = fromPosition.y + gestureDy + PLAYER_CARD_HEIGHT / 2

  const col = clamp(Math.floor(centerX / (cardWidth + GRID_GAP)), 0, columns - 1)
  const row = clamp(Math.floor(centerY / (PLAYER_CARD_HEIGHT + GRID_GAP)), 0, rows - 1)

  const candidateIndex = row * columns + col
  if (candidateIndex >= playersCount) return fromIndex
  return candidateIndex
}

const rectCenter = (r: LayoutRectangle) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 })

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

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

/**
 * Old component (swap within its own grid only) – kept for compatibility.
 */
export const TeamPlayerGrid = ({
  players,
  columns,
  onSwapPlayers,
  placeholderAvatarSource,
  borderColor,
  themed,
}: TeamPlayerGridProps) => {
  const [gridWidth, setGridWidth] = useState(0)

  const cardWidth = useMemo(() => {
    if (gridWidth <= 0) return 120
    return (gridWidth - GRID_GAP * (columns - 1)) / columns
  }, [columns, gridWidth])

  const rows = Math.max(1, Math.ceil(players.length / columns))
  const gridHeight = rows * PLAYER_CARD_HEIGHT + Math.max(0, rows - 1) * GRID_GAP

  return (
    <View
      onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
      style={[themed($gridContainer), { height: gridHeight }]}
    >
      {players.map((player, index) => (
        <DraggablePlayerCell
          key={player.id}
          player={player}
          index={index}
          playersCount={players.length}
          columns={columns}
          cardWidth={cardWidth}
          onSwapPlayers={onSwapPlayers}
          placeholderAvatarSource={placeholderAvatarSource}
          borderColor={borderColor}
          themed={themed}
        />
      ))}
    </View>
  )
}

type DraggablePlayerCellProps = {
  player: TeamGridPlayer
  index: number
  playersCount: number
  columns: number
  cardWidth: number
  onSwapPlayers: (fromIndex: number, toIndex: number) => void
  placeholderAvatarSource: any
  borderColor: string
  themed: ThemeFn
}

const DraggablePlayerCell = ({
  player,
  index,
  playersCount,
  columns,
  cardWidth,
  onSwapPlayers,
  placeholderAvatarSource,
  borderColor,
  themed,
}: DraggablePlayerCellProps) => {
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
          pan.setValue({ x: 0, y: 0 })
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_evt, gestureState) => {
          const toIndex = getDropIndex(index, gestureState.dx, gestureState.dy, playersCount, columns, cardWidth)
          if (toIndex !== index) onSwapPlayers(index, toIndex)

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 22,
            bounciness: 5,
          }).start(() => setIsActive(false))
        },
        onPanResponderTerminate: () => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 22,
            bounciness: 5,
          }).start(() => setIsActive(false))
        },
      }),
    [cardWidth, columns, index, onSwapPlayers, pan, playersCount],
  )

  const position = getGridPosition(index, columns, cardWidth)

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        themed($cardWrapper),
        {
          left: position.x,
          top: position.y,
          width: cardWidth,
          height: PLAYER_CARD_HEIGHT,
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

// ===================== Combined Grid =====================

type DraggablePlayerCellCombinedProps = {
  player: TeamGridPlayer
  team: TeamId
  index: number
  columns: number
  cardWidth: number
  yOffset: number
  borderColor: string
  placeholderAvatarSource: any
  themed: ThemeFn
  getDropTarget: (from: PlayerPointer, dx: number, dy: number) => DropTarget | null
  onDropOnTarget: (from: PlayerPointer, target: DropTarget) => void
}

const DraggablePlayerCellCombined = ({
  player,
  team,
  index,
  columns,
  cardWidth,
  yOffset,
  borderColor,
  placeholderAvatarSource,
  themed,
  getDropTarget,
  onDropOnTarget,
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
          }).start(() => setIsActive(false))
        },
        onPanResponderTerminate: () => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 22,
            bounciness: 5,
          }).start(() => setIsActive(false))
        },
      }),
    [getDropTarget, index, onDropOnTarget, pan, team],
  )

  const position = getGridPosition(index, columns, cardWidth)

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        themed($cardWrapper),
        {
          left: position.x,
          top: position.y + yOffset,
          width: cardWidth,
          height: PLAYER_CARD_HEIGHT,
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
  columns,
  onSwapAcrossTeams,
  onMoveIntoTeam,
  placeholderAvatarSource,
  teamABorderColor,
  teamBBorderColor,
  themed,
}: CombinedTeamsGridProps) => {
  const [gridWidth, setGridWidth] = useState(0)

  const cardWidth = useMemo(() => {
    if (gridWidth <= 0) return 120
    return (gridWidth - GRID_GAP * (columns - 1)) / columns
  }, [columns, gridWidth])

  const zoneWidth = useMemo(() => {
    if (gridWidth <= 0) return 120
    return (gridWidth - GRID_GAP) / 2
  }, [gridWidth])

  const teamARows = Math.max(1, Math.ceil(teamA.length / columns))
  const teamAHeight = teamARows * PLAYER_CARD_HEIGHT + Math.max(0, teamARows - 1) * GRID_GAP

  const zonesYOffset = teamAHeight + GRID_GAP
  const teamBYOffset = zonesYOffset + ZONE_HEIGHT + GRID_GAP

  const teamBRows = Math.max(1, Math.ceil(teamB.length / columns))
  const teamBHeight = teamBRows * PLAYER_CARD_HEIGHT + Math.max(0, teamBRows - 1) * GRID_GAP

  const totalHeight = teamBYOffset + teamBHeight

  type TargetRect = { target: DropTarget; rect: LayoutRectangle }
  const targetRectsRef = useRef<TargetRect[]>([])

  const rebuildTargetRects = (): TargetRect[] => {
    const targets: TargetRect[] = []

    // Team A slots
    for (let i = 0; i < teamA.length; i++) {
      const p = getGridPosition(i, columns, cardWidth)
      targets.push({
        target: { kind: "player", team: "teamA", index: i },
        rect: { x: p.x, y: p.y, width: cardWidth, height: PLAYER_CARD_HEIGHT },
      })
    }

    // Join zones
    targets.push({
      target: { kind: "zone", team: "teamA" },
      rect: { x: 0, y: zonesYOffset, width: zoneWidth, height: ZONE_HEIGHT },
    })
    targets.push({
      target: { kind: "zone", team: "teamB" },
      rect: { x: zoneWidth + GRID_GAP, y: zonesYOffset, width: zoneWidth, height: ZONE_HEIGHT },
    })

    // Team B slots
    for (let i = 0; i < teamB.length; i++) {
      const p = getGridPosition(i, columns, cardWidth)
      targets.push({
        target: { kind: "player", team: "teamB", index: i },
        rect: { x: p.x, y: p.y + teamBYOffset, width: cardWidth, height: PLAYER_CARD_HEIGHT },
      })
    }

    return targets
  }

  const targets = useMemo(
    () => rebuildTargetRects(),
    [cardWidth, columns, teamA.length, teamB.length, teamBYOffset, zoneWidth, zonesYOffset],
  )
  targetRectsRef.current = targets

  const getDropTarget = (from: PlayerPointer, dx: number, dy: number): DropTarget | null => {
    const rects = targetRectsRef.current
    if (rects.length === 0) return null

    const fromYOffset = from.team === "teamA" ? 0 : teamBYOffset
    const fromPos = getGridPosition(from.index, columns, cardWidth)

    // Use the dragged CARD RECT (not only center-point) so the drop zones work reliably.
    const draggedRect: LayoutRectangle = {
      x: fromPos.x + dx,
      y: fromPos.y + fromYOffset + dy,
      width: cardWidth,
      height: PLAYER_CARD_HEIGHT,
    }

    // 1) Prefer actual overlap (largest intersection area wins)
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

    // 2) Fallback to nearest target center
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
      onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
      style={[themed($gridContainer), { height: totalHeight }]}
    >
      {/* TEAM A */}
      {teamA.map((player, index) => (
        <DraggablePlayerCellCombined
          key={`A-${player.id}`}
          player={player}
          team="teamA"
          index={index}
          columns={columns}
          cardWidth={cardWidth}
          yOffset={0}
          borderColor={teamABorderColor}
          placeholderAvatarSource={placeholderAvatarSource}
          themed={themed}
          getDropTarget={getDropTarget}
          onDropOnTarget={onDropOnTarget}
        />
      ))}

      {/* JOIN ZONES */}
      <View
        pointerEvents="none"
        style={[
          themed($joinZone),
          { left: 0, top: zonesYOffset, width: zoneWidth, height: ZONE_HEIGHT, borderColor: teamABorderColor },
        ]}
      >
        <Text style={themed($joinZoneText)}>Drop here to join Team A</Text>
      </View>
      <View
        pointerEvents="none"
        style={[
          themed($joinZone),
          {
            left: zoneWidth + GRID_GAP,
            top: zonesYOffset,
            width: zoneWidth,
            height: ZONE_HEIGHT,
            borderColor: teamBBorderColor,
          },
        ]}
      >
        <Text style={themed($joinZoneText)}>Drop here to join Team B</Text>
      </View>

      {/* TEAM B */}
      {teamB.map((player, index) => (
        <DraggablePlayerCellCombined
          key={`B-${player.id}`}
          player={player}
          team="teamB"
          index={index}
          columns={columns}
          cardWidth={cardWidth}
          yOffset={teamBYOffset}
          borderColor={teamBBorderColor}
          placeholderAvatarSource={placeholderAvatarSource}
          themed={themed}
          getDropTarget={getDropTarget}
          onDropOnTarget={onDropOnTarget}
        />
      ))}
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

const $playerCard: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 12,
  borderWidth: 2,
  backgroundColor: theme.colors.itemBackground,
  alignItems: "center",
  justifyContent: "center",
  padding: 10,
})

const $playerAvatar: ThemedStyle<ImageStyle> = () => ({
  width: 58,
  height: 58,
  borderRadius: 29,
  marginBottom: 10,
})

const $playerName: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
  textAlign: "center",
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
