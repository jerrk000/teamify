import React from "react"
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { IconSymbol } from "@/components/ui/IconSymbol"
import { useAppTheme } from "@/theme/context"
import type { Theme, ThemedStyle } from "@/theme/types"

type PreviewToken =
  | "primary"
  | "secondary"
  | "tertiary"
  | "onPrimary"
  | "text"
  | "textDim"
  | "background"
  | "selected"
  | "border"
  | "tint"
  | "tintInactive"
  | "separator"
  | "error"
  | "errorBackground"
  | "iconColor"
  | "buttonBackground"
  | "itemBackground"
  | "surface"
  | "surfacePressed"

const colorTokens: PreviewToken[] = [
  "primary",
  "secondary",
  "tertiary",
  "onPrimary",
  "text",
  "textDim",
  "background",
  "selected",
  "border",
  "tint",
  "tintInactive",
  "separator",
  "error",
  "errorBackground",
  "iconColor",
  "buttonBackground",
  "itemBackground",
  "surface",
  "surfacePressed",
]

const prettyNames: Record<PreviewToken, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  onPrimary: "OnPrimary",
  text: "Text",
  textDim: "TextDim",
  background: "Background",
  selected: "Selected",
  border: "Border",
  tint: "Tint",
  tintInactive: "TintInactive",
  separator: "Separator",
  error: "Error",
  errorBackground: "ErrorBackground",
  iconColor: "IconColor",
  buttonBackground: "ButtonBackground",
  itemBackground: "ItemBackground",
  surface: "Surface",
  surfacePressed: "SurfacePressed",
}

const getTokenColor = (theme: Theme, token: PreviewToken) => {
  const value = (theme.colors as Record<string, unknown>)[token]
  return typeof value === "string" ? value : undefined
}

function TokenButton({
  label,
  backgroundColor,
  textColor,
  borderColor,
}: {
  label: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
}) {
  return (
    <Pressable
      style={{
        flex: 1,
        minHeight: 52,
        borderRadius: 12,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor ?? "transparent",
        borderWidth: 1,
        borderColor: borderColor ?? "#999",
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", color: textColor ?? "#111" }}>{label}</Text>
    </Pressable>
  )
}

export default function PreviewScreen() {
  const {
    theme,
    themed,
    themeFlavor,
    themeFlavors,
    themeContext,
    setThemeFlavor,
    setThemeContextOverride,
  } = useAppTheme()

  const cycleThemeFlavor = React.useCallback(() => {
    const currentIndex = themeFlavors.indexOf(themeFlavor)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeFlavors.length
    setThemeFlavor(themeFlavors[nextIndex])
  }, [setThemeFlavor, themeFlavor, themeFlavors])

  const toggleMode = React.useCallback(() => {
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [setThemeContextOverride, themeContext])

  const primary = getTokenColor(theme, "primary")
  const secondary = getTokenColor(theme, "secondary")
  const tertiary = getTokenColor(theme, "tertiary")
  const onPrimary = getTokenColor(theme, "onPrimary")
  const textColor = getTokenColor(theme, "text")

  return (
    <SafeAreaView style={themed($screen)}>
      <ScrollView contentContainerStyle={themed($content)}>


        <View style={themed($topControls)}>
          <Pressable style={themed($toggleButton)} onPress={cycleThemeFlavor}>
            <Text style={themed($toggleButtonText)}>Theme: {themeFlavor} (tap to rotate)</Text>
          </Pressable>

          <Pressable style={themed($toggleButton)} onPress={toggleMode}>
            <Text style={themed($toggleButtonText)}>
              Mode: {themeContext} (tap to switch to {themeContext === "dark" ? "light" : "dark"})
            </Text>
          </Pressable>
        </View>


        <View style={themed($section)}>
          <Text style={themed($sectionTitle)}>Button Colors</Text>
          <View style={themed($buttonRow)}>
            <TokenButton
              label="Primary"
              backgroundColor={primary}
              textColor={onPrimary ?? textColor}
              borderColor={getTokenColor(theme, "border")}
            />
            <TokenButton
              label="Secondary"
              backgroundColor={secondary}
              textColor={onPrimary ?? textColor}
              borderColor={getTokenColor(theme, "border")}
            />
            <TokenButton
              label="Tertiary"
              backgroundColor={tertiary}
              textColor={onPrimary ?? textColor}
              borderColor={getTokenColor(theme, "border")}
            />
          </View>
        </View>


        <View style={themed($section)}>
          <Text style={themed($sectionTitle)}>Use Cases</Text>

          <View style={[themed($tokenExample), { backgroundColor: getTokenColor(theme, "surface") }]}>
            <Text style={{ color: getTokenColor(theme, "text"), fontWeight: "700" }}>
              text on surface
            </Text>
            <Text style={{ color: getTokenColor(theme, "textDim") }}>textDim for secondary info</Text>
          </View>

          <View
            style={[
              themed($tokenExample),
              {
                backgroundColor: getTokenColor(theme, "selected"),
                borderColor: getTokenColor(theme, "border"),
                borderWidth: 1,
              },
            ]}
          >
            <Text style={{ color: getTokenColor(theme, "text") }}>selected + border state</Text>
          </View>

          <View style={themed($tokenRow)}>
            <View
              style={[
                themed($iconChip),
                { backgroundColor: getTokenColor(theme, "buttonBackground") ?? getTokenColor(theme, "surface") },
              ]}
            >
              <IconSymbol
                name="star"
                iconSet="fontawesome"
                size={18}
                color={getTokenColor(theme, "iconColor") ?? theme.colors.text}
              />
              <Text style={{ color: getTokenColor(theme, "text"), marginLeft: 8 }}>iconColor + buttonBackground</Text>
            </View>
          </View>

          <View style={themed($tokenRow)}>
            <View style={[themed($tinyPill), { backgroundColor: getTokenColor(theme, "tint") }]}>
              <Text style={{ color: getTokenColor(theme, "onPrimary") ?? "#fff", fontSize: 12 }}>tint</Text>
            </View>
            <View style={[themed($tinyPill), { backgroundColor: getTokenColor(theme, "tintInactive") }]}>
              <Text style={{ color: getTokenColor(theme, "text"), fontSize: 12 }}>tintInactive</Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: getTokenColor(theme, "separator"),
              width: "100%",
              marginVertical: 12,
            }}
          />

          <View
            style={[
              themed($tokenExample),
              { backgroundColor: getTokenColor(theme, "errorBackground"), borderColor: getTokenColor(theme, "error"), borderWidth: 1 },
            ]}
          >
            <Text style={{ color: getTokenColor(theme, "error"), fontWeight: "700" }}>Error banner</Text>
            <Text style={{ color: getTokenColor(theme, "text") }}>error + errorBackground</Text>
          </View>

          <View
            style={[
              themed($tokenExample),
              {
                backgroundColor: getTokenColor(theme, "itemBackground"),
                borderColor: getTokenColor(theme, "border"),
                borderWidth: 1,
              },
            ]}
          >
            <Text style={{ color: getTokenColor(theme, "text") }}>itemBackground list row</Text>
          </View>

          <View style={themed($tokenRow)}>
            <View style={[themed($surfaceBlock), { backgroundColor: getTokenColor(theme, "surface") }]}>
              <Text style={{ color: getTokenColor(theme, "text"), fontSize: 12 }}>surface</Text>
            </View>
            <View style={[themed($surfaceBlock), { backgroundColor: getTokenColor(theme, "surfacePressed") }]}>
              <Text style={{ color: getTokenColor(theme, "text"), fontSize: 12 }}>surfacePressed</Text>
            </View>
          </View>
        </View>

        <View style={themed($section)}>
          <Text style={themed($sectionTitle)}>All Token Swatches</Text>
          <View style={themed($swatchGrid)}>
            {colorTokens.map((token) => {
              const tokenColor = getTokenColor(theme, token)

              return (
                <View
                  key={token}
                  style={[
                    themed($swatchItem),
                    {
                      backgroundColor: tokenColor ?? getTokenColor(theme, "surface"),
                      borderColor: getTokenColor(theme, "border"),
                    },
                  ]}
                >
                  <Text style={{ color: getTokenColor(theme, "text"), fontSize: 12, fontWeight: "700" }}>
                    {prettyNames[token]}
                  </Text>
                  <Text style={{ color: getTokenColor(theme, "textDim"), fontSize: 11 }}>
                    {tokenColor ?? "not defined in this flavor"}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const $screen: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $content: ThemedStyle<ViewStyle> = (theme) => ({
  padding: theme.spacing.md,
  paddingBottom: theme.spacing.xl,
  gap: theme.spacing.md,
})

const $topControls: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.sm,
})

const $toggleButton: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.itemBackground,
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
})

const $toggleButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "700",
})

const $section: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 14,
  borderColor: theme.colors.border,
  borderWidth: 1,
  padding: theme.spacing.md,
  backgroundColor: theme.colors.surface,
  gap: theme.spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontWeight: "800",
  fontSize: 16,
})

const $buttonRow: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  gap: theme.spacing.xs,
})

const $tokenExample: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 10,
  padding: theme.spacing.sm,
})

const $tokenRow: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing.sm,
})

const $iconChip: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 999,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
})

const $tinyPill: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 999,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
})

const $surfaceBlock: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  borderRadius: 10,
  borderColor: theme.colors.border,
  borderWidth: 1,
  padding: theme.spacing.sm,
  alignItems: "center",
})

const $swatchGrid: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.xs,
})

const $swatchItem: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: 10,
  borderWidth: 1,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
})
