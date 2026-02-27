import React, { useMemo, useState } from "react"
import {
  Animated,
  Image,
  PanResponder,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

export type TeamGridPlayer = Player & {
  avatarUri?: string
}

type ThemeFn = <T>(styleFn: (theme: any) => T) => T

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

export const GRID_COLUMNS_DEFAULT = 2
const GRID_GAP = 12
const PLAYER_CARD_HEIGHT = 120

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
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
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
      {players.map((player, index) => {
        return (
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
        )
      })}
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
