const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#EEF1FA",
  neutral700: "#CDD7EE",
  neutral600: "#A5B5D9",
  neutral500: "#7184B0",
  neutral400: "#45587F",
  neutral300: "#273A64",
  neutral250: "#1B2947",
  neutral225: "#14203A",
  neutral200: "#0B162D",
  neutral100: "#000000",

  primary600: "#E7ECFF",
  primary500: "#CCD8FF",
  primary400: "#AFBFFF",
  primary300: "#8AA0FF",
  primary200: "#2E3C87",
  primary100: "#1E2A63",

  secondary500: "#FFE8E9",
  secondary400: "#FFD0D5",
  secondary300: "#FFADB7",
  secondary200: "#F46A78",
  secondary100: "#DE3D4B",

  accent500: "#FFF6DC",
  accent400: "#FFECC0",
  accent300: "#FFE19B",
  accent200: "#FDD468",
  accent100: "#FCC340",

  green100: "#DFF5E3",
  green200: "#CDEED3",
  green500: "#2E7D32",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(11, 22, 45, 0.2)",
  overlay50: "rgba(11, 22, 45, 0.5)",
  overlaymodal: "rgba(0, 0, 0, 0.5)",

  blackHard: "black",
  whiteHard: "white",
  blueHard: "blue",
} as const

const volleyColors = {
  volleyblue: "#8AA0FF",
  volleyblueTransparent: "rgba(138, 160, 255, 0.45)",
  volleyyellow: "#FCC340",
  volleyred: "#FF6573",
  volleyredTransparent: "rgba(255, 101, 115, 0.45)",
} as const

export const colors = {
  palette,
  volleyColors,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  selected: palette.accent200,
  border: palette.neutral400,
  tint: volleyColors.volleyyellow,
  tintInactive: palette.neutral500,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
  iconColor: palette.whiteHard,
  buttonBackground: palette.neutral300,
  itemBackground: palette.neutral225,
  primary: volleyColors.volleyyellow,
  onPrimary: palette.neutral100,
  surface: palette.neutral225,
  surfacePressed: palette.neutral250,
} as const
