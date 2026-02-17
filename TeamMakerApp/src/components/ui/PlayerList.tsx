import React, { memo } from "react"
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { IconSymbol } from "@/components/ui/IconSymbol"

type Id = string

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
  favoriteDisabled?: boolean
  
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
  favoriteDisabled = false,
  onPressRow,
  onPressFavorite,
  onPressMore,
  avatarSource,
  placeholderAvatarSource,
  avatarSize = 28,
  rightIconHitSize = 36,
}: PlayerRowProps) {
  const isFavorite = !!item.isFavorite

  const {
    theme, themeContext, // no themed or it would be used twice
  } = useAppTheme()

  return (
    <TouchableOpacity onPress={() => onPressRow(item)} activeOpacity={0.8}>
      <View style={[themed($itemRow), isSelected ? themed($clickedItem) : undefined]}>
        <Image
          source={avatarSource ?? placeholderAvatarSource}
          style={themed((t) => $avatar(t, avatarSize))}
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
            <IconSymbol
              name={isFavorite ? "star" : "star-o"}
              iconSet="fontawesome"
              size={18} //TODO make this a token if you have one for icon sizes
              color={theme.colors.text} //TODO maybe use a different color (like yellow)
            />
          </Pressable>

          <Pressable
            onPress={() => onPressMore?.(item)}
            hitSlop={10}
            style={themed((t) => $iconButton(t, rightIconHitSize))}
            accessibilityRole="button"
            accessibilityLabel="Show more player info"
          >
            <IconSymbol
              name="chevron.down"
              iconSet="fontawesome"
              size={18} //TODO make this a token if you have one for icon sizes
              color={theme.colors.text}
            />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  )
})            

type PlayerListProps = {
  data: PlayerListItem[]
  themed: ThemeFn
  isSelected?: (item: PlayerListItem) => boolean
  favoriteDisabled?: boolean,

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
  onPressRow,
  onPressFavorite,
  onPressMore,
  placeholderAvatarSource,
  avatarSourceForItem,
  avatarSize,
  rightIconHitSize,
  contentContainerStyle,
}: PlayerListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={contentContainerStyle}
      renderItem={({ item }) => (
        <PlayerRow
          item={item}
          themed={themed}
          isSelected={isSelected?.(item) ?? false}
          favoriteDisabled={favoriteDisabled}
          onPressRow={onPressRow}
          onPressFavorite={onPressFavorite}
          onPressMore={onPressMore}
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

const $itemRow: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,//spacing?.xs ?? 10, //TODO add spacing to theme and use it here
  paddingHorizontal: 16, // spacing?.md ?? 16, //TODO add spacing to theme and use it here
  backgroundColor: theme.colors.itemBackground,
  margin: 5,
  borderRadius: 10, // Rounded corners
})

const $clickedItem: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral300,
  borderWidth: 3, // Border thickness
  borderColor: theme.colors.palette.neutral500, // TODO change this and add this to the theme
});

const $avatar = ({ colors }: any, size: number): ImageStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  marginRight: 12,
  backgroundColor: colors?.neutral200 ?? "#eee",
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

const $icon = ({ colors }: any): TextStyle => ({
  fontSize: 18,
  color: colors?.text ?? "#111",
})

const $iconDisabled = ({ colors }: any): ViewStyle => ({
  opacity: 0.4,
})