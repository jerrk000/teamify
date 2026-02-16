import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Pressable,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
  TextStyle,
} from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

type OptionKey = string

type TopOptionTabsOption<K extends string> = Readonly<{
  key: K
  label: string
  disabled?: boolean
  testID?: string
}>

export type TopOptionTabsProps<K extends string> = { // had to extend string so that it accepts generic unions too
  options: readonly TopOptionTabsOption<K>[]
  value: K
  onChange: (key: K) => void

  rightHint?: "none" | "fade" | "chevron"
  autoScrollToSelected?: boolean
  style?: ViewStyle
  showBottomDivider?: boolean
  a11yLabelPrefix?: string
}

export function TopOptionTabs<K extends string>(props: TopOptionTabsProps<K>) {  const {
    options,
    value,
    onChange,
    rightHint = "fade",
    autoScrollToSelected = true,
    style,
    showBottomDivider = true,
    a11yLabelPrefix = "Option",
  } = props

  const { themed } = useAppTheme()
  const scrollRef = useRef<ScrollView>(null)

  const [contentWidth, setContentWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollX, setScrollX] = useState(0)

  const isScrollable = contentWidth > containerWidth + 2
  const showRightHint =
    rightHint !== "none" &&
    isScrollable &&
    scrollX < contentWidth - containerWidth - 2

  const itemLayouts = useRef<Record<string, { x: number; w: number }>>({})

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.key === value),
    [options, value],
  )

  const scrollToSelected = () => {
    if (!autoScrollToSelected) return
    const selected = options[selectedIndex]
    if (!selected) return

    const layout = itemLayouts.current[selected.key]
    if (!layout || containerWidth <= 0) return

    const target = Math.max(0, layout.x + layout.w / 2 - containerWidth / 2)
    scrollRef.current?.scrollTo({ x: target, animated: true })
  }

  useEffect(() => {
    scrollToSelected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, containerWidth, contentWidth])

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width)
  }

  const onContentSizeChange = (w: number) => setContentWidth(w)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(e.nativeEvent.contentOffset.x)
  }

  return (
    <View
      style={[
        themed($container),
        showBottomDivider && themed($bottomDivider),
        style,
      ]}
      onLayout={onContainerLayout}
    >
      <View style={themed($rowWrapper)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={themed($contentContainer)}
          onContentSizeChange={onContentSizeChange}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {options.map((opt) => {
            const isActive = opt.key === value
            const isDisabled = !!opt.disabled

            return (
              <View
                key={opt.key}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout
                  itemLayouts.current[opt.key] = { x, w: width }
                }}
                style={themed($itemOuter)}
              >
                <Pressable
                  testID={opt.testID}
                  disabled={isDisabled}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive, disabled: isDisabled }}
                  accessibilityLabel={`${a11yLabelPrefix}: ${opt.label}${isActive ? ", selected" : ""}`}
                  onPress={() => onChange(opt.key)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    themed($chip),
                    isActive && themed($chipActive),
                    isDisabled && themed($chipDisabled),
                    pressed && !isDisabled && themed($chipPressed),
                  ]}
                >
                  <Text
                    style={[
                      themed($label),
                      isActive && themed($labelActive),
                      isDisabled && themed($labelDisabled),
                    ]}
                    numberOfLines={1}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </ScrollView>

        {showRightHint && rightHint === "fade" && (
          <View pointerEvents="none" style={themed($rightFade)} />
        )}

        {showRightHint && rightHint === "chevron" && (
          <View pointerEvents="none" style={themed($rightChevronWrap)}>
            <Text style={themed($rightChevron)}>{"›"}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

/** THEMED STYLES (mapped to your colors) */
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs,
})

const $bottomDivider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $rowWrapper: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.sm,
  gap: spacing.xs, // if gap unsupported in your RN version, replace with marginRight on $itemOuter
  alignItems: "center",
})

const $itemOuter: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
})

const $chip: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderRadius: 999,
  backgroundColor: colors.itemBackground, 
  borderWidth: 1,
  borderColor: colors.border,
})

const $chipActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.primary, 
  borderColor: colors.primary,
})

const $chipPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.surfacePressed, //
})

const $chipDisabled: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.5,
})

const $label: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  //...typography.bodySmall, //TODO do something?
  color: colors.text,
})

const $labelActive: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  //...typography.bodySmall, //TODO do something?
  fontWeight: "600",
  color: colors.onPrimary
})

const $labelDisabled: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $rightFade: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: 28,
  backgroundColor: colors.background,
  opacity: 0.9,
})

const $rightChevronWrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  right: spacing.sm,
  top: 0,
  bottom: 0,
  justifyContent: "center",
})

const $rightChevron: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 18,
})