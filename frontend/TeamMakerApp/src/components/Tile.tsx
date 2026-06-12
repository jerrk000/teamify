import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

const BASE_WIDTH = 120
const BASE_HEIGHT = 170
const BASE_RADIUS = 22

export interface TileProps {
  value: string | number
  label: string
  accentColor?: string
  width?: number
  style?: StyleProp<ViewStyle>
}

export function Tile(props: TileProps) {
  const { value, label, accentColor, width = BASE_WIDTH, style } = props
  const { themed, theme } = useAppTheme()

  const resolvedAccentColor = accentColor ?? theme.colors.palette.primary500
  const scale = width / BASE_WIDTH
  const height = BASE_HEIGHT * scale

  return (
    <View
      style={[
        themed($container),
        {
          width,
          height,
          borderRadius: BASE_RADIUS * scale,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.88)",
          "rgba(255,255,255,0.62)",
          withAlpha(resolvedAccentColor, 0.22),
        ]}
        start={{ x: 0.15, y: 0.05 }}
        end={{ x: 0.85, y: 1 }}
        style={[
          themed($gradient),
          {
            paddingHorizontal: 12 * scale,
            paddingTop: 12 * scale,
            paddingBottom: 20 * scale,
          },
        ]}
      >
        <View
          style={[
            themed($shine),
            {
              top: -8 * scale,
            },
          ]}
        />

        <Text
          text={String(value)}
          style={[
            themed($value),
            {
              fontSize: 62 * scale,
              lineHeight: 68 * scale,
            },
          ]}
        />

        <Text
          text={label}
          style={[
            themed($label),
            {
              fontSize: 22 * scale,
              lineHeight: 28 * scale,
              marginTop: 2 * scale,
            },
          ]}
        />

        <View
          style={[
            themed($accentBar),
            {
              left: 16 * scale,
              right: 16 * scale,
              bottom: 10 * scale,
              height: 10 * scale,
              borderRadius: 999 * scale,
              backgroundColor: resolvedAccentColor,
            },
          ]}
        />
      </LinearGradient>
    </View>
  )
}

function withAlpha(color: string, alpha: number) {
  if (color.startsWith("rgba(")) return color

  if (color.startsWith("rgb(")) {
    const values = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map((v) => v.trim())

    if (values.length === 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
    }
  }

  const hex = color.replace("#", "")

  if (hex.length !== 6) return `rgba(255,255,255,${alpha})`

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.22)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.55)",
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.16,
  shadowRadius: 18,
  elevation: 8,
})

const $gradient: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
})

const $shine: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  left: "58%",
  width: "28%",
  height: "72%",
  backgroundColor: "rgba(255,255,255,0.18)",
  transform: [{ rotate: "16deg" }],
})

const $value: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
})

const $label: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
})

const $accentBar: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
})