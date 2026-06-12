import { type ReactNode } from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

type SegmentedContentTab<K extends string> = Readonly<{
  key: K
  label: string
  content: ReactNode
  disabled?: boolean
  testID?: string
}>

export type SegmentedContentTabsProps<K extends string> = {
  tabs: readonly SegmentedContentTab<K>[]
  value: K
  onChange: (key: K) => void
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  a11yLabelPrefix?: string
}

export function SegmentedContentTabs<K extends string>({
  tabs,
  value,
  onChange,
  style,
  contentContainerStyle,
  a11yLabelPrefix = "Content tab",
}: SegmentedContentTabsProps<K>) {
  const { themed } = useAppTheme()
  const selectedTab = tabs.find((tab) => tab.key === value) ?? tabs[0]

  return (
    <View style={[themed($container), style]}>
      <View style={themed($tabBar)} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === value
          const isDisabled = !!tab.disabled

          return (
            <Pressable
              key={tab.key}
              testID={tab.testID}
              disabled={isDisabled}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive, disabled: isDisabled }}
              accessibilityLabel={`${a11yLabelPrefix}: ${tab.label}${isActive ? ", selected" : ""}`}
              onPress={() => onChange(tab.key)}
              style={({ pressed }) => [
                themed($tabButton),
                pressed && !isDisabled && themed($tabButtonPressed),
                isDisabled && themed($tabButtonDisabled),
              ]}
            >
              <Text
                style={[
                  themed($tabLabel),
                  isActive && themed($tabLabelActive),
                  isDisabled && themed($tabLabelDisabled),
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>

              {isActive ? <View style={themed($activeIndicator)} /> : null}
            </Pressable>
          )
        })}
      </View>

      <View style={[themed($contentContainer), contentContainerStyle]}>{selectedTab?.content}</View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  width: "100%",
})

const $tabBar: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  minHeight: 52,
  borderRadius: 14,
  borderWidth: 2,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.background,
  overflow: "hidden",
})

const $tabButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minWidth: 0,
})

const $tabButtonPressed: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.surfacePressed,
})

const $tabButtonDisabled: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.5,
})

const $tabLabel: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 16,
  fontWeight: "700",
  textAlign: "center",
})

const $tabLabelActive: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "800",
})

const $tabLabelDisabled: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
})

const $activeIndicator: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 4,
  backgroundColor: theme.colors.volleyColors.volleyblue,
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingTop: 16,
})
