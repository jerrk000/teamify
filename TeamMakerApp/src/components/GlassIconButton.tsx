import { ReactNode } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

import { Text, TextProps } from "./Text"

export interface GlassIconButtonProps extends PressableProps {
  label?: TextProps["text"]
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  icon: ReactNode
  size?: number
  style?: StyleProp<ViewStyle>
  pressedStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  disabled?: boolean
  disabledStyle?: StyleProp<ViewStyle>
}

export function GlassIconButton(props: GlassIconButtonProps) {
  const {
    label,
    tx,
    txOptions,
    icon,
    size = 96,
    style: $styleOverride,
    pressedStyle: $pressedStyleOverride,
    labelStyle: $labelStyleOverride,
    disabled,
    disabledStyle: $disabledStyleOverride,
    ...rest
  } = props

  const { themed, theme } = useAppTheme()

  function $pressableStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      themed($container),
      { width: size, alignItems: "center" },
      $styleOverride,
      pressed && themed($pressedContainer),
      pressed && $pressedStyleOverride,
      disabled && themed($disabledContainer),
      disabled && $disabledStyleOverride,
    ]
  }

  const circleSize = size
  const iconCircleSize = Math.round(circleSize * 0.72)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={$pressableStyle}
      {...rest}
    >
      <View
        style={[
          themed($circleBase),
          {
            width: iconCircleSize,
            height: iconCircleSize,
            borderRadius: iconCircleSize / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.78)",
            "rgba(255,255,255,0.50)",
            "rgba(175,220,255,0.32)",
          ]}
          start={{ x: 0.18, y: 0.1 }}
          end={{ x: 0.82, y: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: iconCircleSize / 2,
          }}
        />

        <View
          style={[
            themed($highlight),
            {
              borderRadius: iconCircleSize / 2,
            },
          ]}
        />

        <View style={themed($iconContainer)}>{icon}</View>
      </View>

      {!!(label || tx) && (
        <Text
          text={label}
          tx={tx}
          txOptions={txOptions}
          style={[themed($label), $labelStyleOverride]}
        />
      )}
    </Pressable>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.xs,
})

const $circleBase: ThemedStyle<ViewStyle> = ({ colors }) => ({
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.22)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.55)",
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 16,
  elevation: 8,
})

const $highlight: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 1,
  left: 1,
  right: 1,
  height: "52%",
  backgroundColor: "rgba(255,255,255,0.18)",
})

const $iconContainer: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2,
})

const $label: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.medium,
  fontSize: 14,
  lineHeight: 18,
  textAlign: "center",
})

const $pressedContainer: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
})

const $disabledContainer: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.55,
})