import React, { memo } from "react"
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, ViewStyle, TextStyle, ImageStyle } from "react-native"

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
            <Text style={themed($icon)}>
                {isFavorite ? "★" : "☆"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onPressMore?.(item)}
            hitSlop={10}
            style={themed((t) => $iconButton(t, rightIconHitSize))}
            accessibilityRole="button"
            accessibilityLabel="Show more player info"
          >
            <Text style={themed($icon)}>⌄</Text>
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

const $itemRow = ({ colors, spacing }: any): ViewStyle => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing?.xs ?? 10,
  paddingHorizontal: spacing?.md ?? 16,
})

/**
 * You already have this in your screen:
 * - keep it there, or move it here and export it
 */
const $clickedItem = ({ colors }: any): ViewStyle => ({
  backgroundColor: colors?.neutral200 ?? "rgba(0,0,0,0.06)",
  borderRadius: 10,
})

const $avatar = ({ colors }: any, size: number): ImageStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  marginRight: 12,
  backgroundColor: colors?.neutral200 ?? "#eee",
})

const $name = ({ colors }: any): TextStyle => ({
  flex: 1,
  minWidth: 0, // IMPORTANT for truncation in flex rows
  color: colors?.text ?? "#111",
  fontSize: 16,
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