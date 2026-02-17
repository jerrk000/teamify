// src/components/SearchField.tsx
import React, { useCallback, useMemo, useRef } from "react"
import {
  Pressable,
  TextInput,
  View,
  type ViewStyle,
  type TextStyle,
  Platform,
  type TextInputProps,
} from "react-native"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

/**
 * Design token: fixed control height for inputs/buttons.
 * Typical production values: 44 (iOS-ish) or 48 (Material-ish).
 */
export const CONTROL_HEIGHT_MD = 44

export type SearchFieldProps = {
  value: string
  onChangeText: (text: string) => void

  placeholder?: string

  /**
   * Called when the user taps the clear button.
   * Defaults to clearing the value via onChangeText("").
   */
  onClear?: () => void

  /**
   * Called when the user submits from the keyboard (return/search).
   */
  onSubmit?: (text: string) => void

  /**
   * Optional: focus programmatically from parent
   */
  autoFocus?: boolean

  /**
   * Optional: disable interactions
   */
  disabled?: boolean

  /**
   * Optional: show/hide the clear button when empty
   */
  showClearWhenEmpty?: boolean

  /**
   * Optional: style overrides
   */
  containerStyle?: ThemedStyle<ViewStyle>
  inputStyle?: ThemedStyle<TextStyle>

  /**
   * Optional: testing hooks
   */
  testID?: string
  inputTestID?: string
  clearButtonTestID?: string

  /**
   * Optional: show/hide left search icon
   * Default: true
  */
  showSearchIcon?: boolean

  /**
   * Optional: pass-through TextInput props (minus ones we control).
   */
  textInputProps?: Omit<
    TextInputProps,
    | "value"
    | "onChangeText"
    | "placeholder"
    | "placeholderTextColor"
    | "editable"
    | "autoFocus"
    | "onSubmitEditing"
    | "returnKeyType"
  >
}

export function SearchField(props: SearchFieldProps) {
  const {
    value,
    onChangeText,
    placeholder = "Search…",
    onClear,
    onSubmit,
    autoFocus = false,
    disabled = false,
    showClearWhenEmpty = false,
    containerStyle,
    inputStyle,
    testID,
    inputTestID,
    clearButtonTestID,
    showSearchIcon = true,
    textInputProps,
  } = props

  const { themed, theme } = useAppTheme()
  const inputRef = useRef<TextInput>(null)

  const canClear = showClearWhenEmpty ? true : value.length > 0

  const handleClear = useCallback(() => {
    if (disabled) return
    if (onClear) onClear()
    else onChangeText("")

    // Keep focus in the field after clearing (common UX)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [disabled, onClear, onChangeText])

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return
    onSubmit(value)
  }, [onSubmit, value])

  const placeholderTextColor = useMemo(() => theme.colors.textDim, [theme.colors.textDim])

  return (
    <View style={[themed($container), containerStyle ? themed(containerStyle) : undefined]} testID={testID}>
      {/* Left icon */}
      {showSearchIcon && (
        <View style={themed($leftIconSlot)} pointerEvents="none">
          <IconSymbol
            size={18}
            name="magnifying-glass"
            iconSet="fontawesome6"
            color={disabled ? theme.colors.border : theme.colors.iconColor}
          />
        </View>
      )}


      {/* Input */}
      <TextInput
        ref={inputRef}
        style={[themed($input), inputStyle ? themed(inputStyle) : undefined]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        editable={!disabled}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never" // we render our own clear button (consistent cross-platform)
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        onSubmitEditing={handleSubmit}
        // Sensible defaults for “search”
        keyboardType="default"
        {...textInputProps}
        testID={inputTestID}
      />

      {/* Right clear button */}
      <Pressable
        onPress={handleClear}
        disabled={disabled || !canClear}
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={8}
        style={({ pressed }) => [
          themed($rightButtonSlot),
          (disabled || !canClear) && themed($rightButtonDisabled),
          pressed && !(disabled || !canClear) && themed($rightButtonPressed),
        ]}
        testID={clearButtonTestID}
      >
        <IconSymbol
          size={22}
          name="xmark"
          iconSet="fontawesome6"
          color={
            disabled || !canClear
              ? theme.colors.border
              : theme.colors.iconColor
          }
        />
      </Pressable>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  height: CONTROL_HEIGHT_MD,
  flexDirection: "row",
  alignItems: "center",
  //width: "100%", //cannot be full width and flex shrink
  flex: 1,
  flexShrink: 1,
  minWidth: 0,

  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.itemBackground, // or theme.colors.background if you prefer

  borderRadius: 10, //TODO make this a token if you have one
})

const $leftIconSlot: ThemedStyle<ViewStyle> = (_theme) => ({
  height: CONTROL_HEIGHT_MD,
  width: CONTROL_HEIGHT_MD,
  alignItems: "center",
  justifyContent: "center",
})

const $input: ThemedStyle<TextStyle> = (theme) => ({
  flex: 1,
  height: CONTROL_HEIGHT_MD,

  // Use horizontal padding; avoid vertical padding to preserve fixed height.
  paddingRight: 8,

  color: theme.colors.text,

  // Android vertical alignment
  ...(Platform.OS === "android"
    ? ({ textAlignVertical: "center" } as const)
    : null),

  // Make font size a token if you have typography scale
  fontSize: 16,
})

const $rightButtonSlot: ThemedStyle<ViewStyle> = (_theme) => ({
  height: CONTROL_HEIGHT_MD,
  width: CONTROL_HEIGHT_MD,
  alignItems: "center",
  justifyContent: "center",
})

const $rightButtonDisabled: ThemedStyle<ViewStyle> = (_theme) => ({
  opacity: 0.5,
})

const $rightButtonPressed: ThemedStyle<ViewStyle> = (_theme) => ({
  opacity: 0.7,
})