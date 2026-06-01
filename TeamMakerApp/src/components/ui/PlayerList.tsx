import { memo, useEffect, useState } from "react"
import {
  FlatList,
  Image,
  ImageStyle,
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

import { Text } from "@/components/Text"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

type Id = string

const DETAILS_ROW_HEIGHT = 42
const DETAILS_FADE_DURATION = 120
const DETAILS_EXPAND_DURATION = 180

export type PlayerListItem = {
  id: Id
  name: string
  isFavorite?: boolean
}

type ThemeFn = <T>(styleFn: (theme: any) => T) => T

type PlayerRowProps = {
  item: PlayerListItem
  themed: ThemeFn
  isSelected?: boolean
  isExpanded?: boolean
  favoriteDisabled?: boolean
  hideEmptyFavoriteIcon?: boolean

  onPressRow: (item: PlayerListItem) => void
  onPressFavorite?: (item: PlayerListItem) => void
  onPressMore?: (item: PlayerListItem) => void

  // Optional: pass a custom avatar per player later
  avatarSource?: any
  placeholderAvatarSource: any

  // Optional layout tokens
  avatarSize?: number
  rightIconHitSize?: number
}

export const PlayerRow = memo(function PlayerRow({
  item,
  themed,
  isSelected = false,
  isExpanded = false,
  favoriteDisabled = false,
  hideEmptyFavoriteIcon = false,
  onPressRow,
  onPressFavorite,
  onPressMore,
  avatarSource,
  placeholderAvatarSource,
  avatarSize = 28,
  rightIconHitSize = 36,
}: PlayerRowProps) {
  const isFavorite = !!item.isFavorite

  const { theme } = useAppTheme()
  const detailsHeight = useSharedValue(isExpanded ? DETAILS_ROW_HEIGHT : 0)
  const detailsOpacity = useSharedValue(isExpanded ? 1 : 0)

  useEffect(() => {
    if (isExpanded) {
      detailsHeight.value = withTiming(DETAILS_ROW_HEIGHT, { duration: DETAILS_EXPAND_DURATION })
      detailsOpacity.value = withDelay(60, withTiming(1, { duration: DETAILS_FADE_DURATION }))
    } else {
      detailsOpacity.value = withTiming(0, { duration: DETAILS_FADE_DURATION })
      detailsHeight.value = withDelay(
        DETAILS_FADE_DURATION,
        withTiming(0, { duration: DETAILS_EXPAND_DURATION }),
      )
    }
  }, [detailsHeight, detailsOpacity, isExpanded])

  const chevronAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: withTiming(isExpanded ? "180deg" : "0deg", { duration: 180 }) }],
    }),
    [isExpanded],
  )
  const detailsAnimatedStyle = useAnimatedStyle(() => ({
    height: detailsHeight.value,
    opacity: detailsOpacity.value,
  }))

  return (
    <TouchableOpacity onPress={() => onPressRow(item)} activeOpacity={0.8}>
      <Animated.View
        layout={LinearTransition.duration(180)}
        style={[themed($itemCell), isSelected ? themed($clickedItem) : undefined]}
      >
        <View style={themed($itemRow)}>
          <Image
            source={avatarSource ?? placeholderAvatarSource}
            style={[
              themed((t) => $avatar(t, avatarSize)),
              avatarSource &&
                theme.isDark && { backgroundColor: theme.colors.palette.neutral200 ?? "#eee" },
            ]} //when darkmode and no avatar, make grey background
            accessibilityLabel={`${item.name} avatar`}
          />

          <Text style={themed($name)} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>

          <View style={themed($rightIcons)}>
            <Pressable
              disabled={favoriteDisabled}
              onPress={() => onPressFavorite?.(item)}
              hitSlop={10}
              style={[
                themed((t) => $iconButton(t, rightIconHitSize)),
                favoriteDisabled && themed($iconDisabled),
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: favoriteDisabled }}
            >
              {isFavorite || !hideEmptyFavoriteIcon ? (
                <IconSymbol
                  name={isFavorite ? "star" : "star-o"}
                  iconSet="fontawesome"
                  size={18} //TODO make this a token if you have one for icon sizes
                  color={theme.colors.text} //TODO maybe use a different color (like yellow)
                />
              ) : null}
            </Pressable>

            <Pressable
              onPress={() => onPressMore?.(item)}
              hitSlop={10}
              style={themed((t) => $iconButton(t, rightIconHitSize))}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? "Hide more player info" : "Show more player info"}
              accessibilityState={{ expanded: isExpanded }}
            >
              <Animated.View style={chevronAnimatedStyle}>
                <IconSymbol
                  name="chevron.down"
                  iconSet="fontawesome"
                  size={18} //TODO make this a token if you have one for icon sizes
                  color={theme.colors.text}
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>

        <Animated.View
          pointerEvents={isExpanded ? "auto" : "none"}
          style={[themed($detailsRow), detailsAnimatedStyle]}
        >
          <View style={themed($detailsContent)}>
            <Text style={themed($detailsText)}>Rating: 7</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
})

type PlayerListProps = {
  data: PlayerListItem[]
  themed: ThemeFn
  isSelected?: (item: PlayerListItem) => boolean
  favoriteDisabled?: boolean
  hideEmptyFavoriteIcon?: boolean

  onPressRow: (item: PlayerListItem) => void
  onPressFavorite?: (item: PlayerListItem) => void
  onPressMore?: (item: PlayerListItem) => void

  placeholderAvatarSource: any
  avatarSourceForItem?: (item: PlayerListItem) => any

  avatarSize?: number
  rightIconHitSize?: number

  contentContainerStyle?: ViewStyle
}

export function PlayerList({
  data,
  themed,
  isSelected,
  favoriteDisabled,
  hideEmptyFavoriteIcon,
  onPressRow,
  onPressFavorite,
  onPressMore,
  placeholderAvatarSource,
  avatarSourceForItem,
  avatarSize,
  rightIconHitSize,
  contentContainerStyle,
}: PlayerListProps) {
  const [expandedItemId, setExpandedItemId] = useState<Id | undefined>()

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={contentContainerStyle}
      extraData={expandedItemId}
      renderItem={({ item }) => (
        <PlayerRow
          item={item}
          themed={themed}
          isSelected={isSelected?.(item) ?? false}
          isExpanded={expandedItemId === item.id}
          favoriteDisabled={favoriteDisabled}
          hideEmptyFavoriteIcon={hideEmptyFavoriteIcon}
          onPressRow={onPressRow}
          onPressFavorite={onPressFavorite}
          onPressMore={(pressedItem) => {
            setExpandedItemId((currentItemId) =>
              currentItemId === pressedItem.id ? undefined : pressedItem.id,
            )
            onPressMore?.(pressedItem)
          }}
          avatarSource={avatarSourceForItem?.(item)}
          placeholderAvatarSource={placeholderAvatarSource}
          avatarSize={avatarSize}
          rightIconHitSize={rightIconHitSize}
        />
      )}
    />
  )
}

/** ---------- styles ---------- */

const $itemCell: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.itemBackground,
  borderRadius: 10, // Rounded corners
  margin: 5,
  overflow: "hidden",
})

const $itemRow: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  paddingHorizontal: 16, // spacing?.md ?? 16, //TODO add spacing to theme and use it here
  paddingVertical: 10, //spacing?.xs ?? 10, //TODO add spacing to theme and use it here
})

const $clickedItem: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral300,
  borderColor: theme.colors.palette.neutral500, // TODO change this and add this to the theme
  borderWidth: 3, // Border thickness
})

const $avatar = (_theme: any, size: number): ImageStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  marginRight: 12,
  //backgroundColor: colors?.neutral200 ?? "#eee", //not needed
})

const $name: ThemedStyle<TextStyle> = (theme) => ({
  flex: 1,
  minWidth: 0, // IMPORTANT for truncation in flex rows
  color: theme.colors.text,
  fontSize: 16, //TODO add font sizes to theme and use it here
})

const $rightIcons = (): ViewStyle => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
})

const $iconButton = (_t: any, hitSize: number): ViewStyle => ({
  width: hitSize,
  height: hitSize,
  alignItems: "center",
  justifyContent: "center",
})

const $iconDisabled = (): ViewStyle => ({
  opacity: 0.4,
})

const $detailsRow: ThemedStyle<ViewStyle> = () => ({
  overflow: "hidden",
})

const $detailsContent: ThemedStyle<ViewStyle> = (theme) => ({
  borderTopColor: theme.colors.separator,
  borderTopWidth: 1,
  height: DETAILS_ROW_HEIGHT,
  justifyContent: "center",
  paddingBottom: 12,
  paddingHorizontal: 56,
  paddingTop: 10,
})

const $detailsText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 14,
  fontWeight: "700",
})
