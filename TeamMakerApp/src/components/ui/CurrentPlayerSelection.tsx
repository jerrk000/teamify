import { FC, useEffect, useRef } from "react"
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { Text } from "@/components/Text"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

interface CurrentPlayerSelectionProps {
  selectedPlayers: Player[]
  onClickPlayer?: (player: Player) => void
  onRemovePlayer?: (player: Player) => void
  containerStyle?: ViewStyle
  selectedItemStyle?: ViewStyle
  textStyle?: TextStyle
  disableTouch?: boolean
  isCentered?: boolean
  placeholderAvatarSource?: ImageSourcePropType
  avatarSourceForPlayer?: (player: Player) => ImageSourcePropType | undefined
}

const AVATAR_SIZE = 72

const CurrentPlayerSelection: FC<CurrentPlayerSelectionProps> = ({
  selectedPlayers,
  onClickPlayer,
  onRemovePlayer,
  containerStyle,
  selectedItemStyle,
  textStyle,
  disableTouch = false,
  isCentered = false,
  placeholderAvatarSource,
  avatarSourceForPlayer,
}) => {
  const { themed, theme } = useAppTheme()
  const handleRemove = onRemovePlayer ?? onClickPlayer ?? (() => {})
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [selectedPlayers.length])

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      style={[themed($container), containerStyle]}
      contentContainerStyle={[themed($content), isCentered ? themed($centeredContent) : null]}
      showsHorizontalScrollIndicator={true}
      showsVerticalScrollIndicator={false}
    >
      {selectedPlayers.map((player) => {
        const avatarSource = avatarSourceForPlayer?.(player) ?? placeholderAvatarSource

        return (
          <View key={player.id} style={[themed($playerTile), selectedItemStyle]}>
            <View style={themed($avatarWrap)}>
              {avatarSource ? (
                <Image
                  source={avatarSource}
                  style={themed((t) => $avatar(t, AVATAR_SIZE))}
                  accessibilityLabel={`${player.name} avatar`}
                />
              ) : (
                <View style={themed((t) => $avatarFallback(t, AVATAR_SIZE))}>
                  <Text style={themed($avatarInitial)} numberOfLines={1}>
                    {player.name.trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {!disableTouch ? (
                <Pressable
                  onPress={() => handleRemove(player)}
                  hitSlop={8}
                  style={themed($removeButton)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${player.name}`}
                >
                  <IconSymbol
                    name="xmark"
                    iconSet="fontawesome6"
                    size={14}
                    color={theme.colors.text}
                  />
                </Pressable>
              ) : null}
            </View>

            <Text style={[themed($name), textStyle]} numberOfLines={1} ellipsizeMode="tail">
              {player.name}
            </Text>
          </View>
        )
      })}
    </ScrollView>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
})

const $content: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "flex-start",
  paddingTop: 2,
  paddingBottom: 6,
  gap: 14,
})

const $centeredContent: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
})

const $playerTile: ThemedStyle<ViewStyle> = () => ({
  width: 86,
  alignItems: "center",
})

const $avatarWrap: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  marginBottom: 6,
})

const $avatar = (theme: any, size: number): ImageStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  borderWidth: 2,
  borderColor: theme.colors.palette.primary500,
  backgroundColor: theme.colors.itemBackground,
})

const $avatarFallback = (theme: any, size: number): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  borderWidth: 2,
  borderColor: theme.colors.palette.primary500,
  backgroundColor: theme.colors.itemBackground,
  alignItems: "center",
  justifyContent: "center",
})

const $avatarInitial: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 28,
  fontWeight: "800",
})

const $removeButton: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  top: -4,
  right: -6,
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.itemBackground,
  borderWidth: 1,
  borderColor: theme.colors.border,
})

const $name: ThemedStyle<TextStyle> = (theme) => ({
  width: "100%",
  color: theme.colors.text,
  fontSize: 14,
  fontWeight: "800",
  textAlign: "center",
})

export default CurrentPlayerSelection
