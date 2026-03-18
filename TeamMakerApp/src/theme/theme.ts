import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { colors as colorsVolleyballLight } from "./colors.volleyball.light"
import { colors as colorsVolleyballDark } from "./colors.volleyball.dark"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { timing } from "./timing"
import type { ImmutableThemeContextModeT, Theme, ThemeFlavorT } from "./types"
import { typography } from "./typography"

const createTheme = (
  colors: Theme["colors"],
  spacing: Theme["spacing"],
  isDark: boolean,
): Theme => ({
  colors,
  spacing,
  typography,
  timing,
  isDark,
})

export const themeRegistry: Record<ThemeFlavorT, Record<ImmutableThemeContextModeT, Theme>> = {
  default: {
    light: createTheme(colorsLight, spacingLight, false),
    dark: createTheme(colorsDark, spacingDark, true),
  },
  volleyball: {
    light: createTheme(colorsVolleyballLight, spacingLight, false),
    dark: createTheme(colorsVolleyballDark, spacingDark, true),
  },
} as const

export const isThemeFlavor = (value: string | undefined): value is ThemeFlavorT => {
  return !!value && value in themeRegistry
}

export const getTheme = (flavor: ThemeFlavorT, mode: ImmutableThemeContextModeT): Theme => {
  return themeRegistry[flavor][mode]
}

export const themeFlavors = Object.keys(themeRegistry) as ThemeFlavorT[]
