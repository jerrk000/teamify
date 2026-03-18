const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F7F8FC",
  neutral225: "#EEF1FA",
  neutral250: "#E4E9F7",
  neutral300: "#CDD7EE",
  neutral400: "#A5B5D9",
  neutral500: "#7184B0",
  neutral600: "#45587F",
  neutral700: "#273A64",
  neutral800: "#1B2947",
  neutral900: "#0B162D",

  primary100: "#E7ECFF",
  primary200: "#CCD8FF",
  primary300: "#AFBFFF",
  primary400: "#8AA0FF",
  primary500: "#2E3C87",
  primary600: "#1E2A63",

  secondary100: "#FFE8E9",
  secondary200: "#FFD0D5",
  secondary300: "#FFADB7",
  secondary400: "#F46A78",
  secondary500: "#DE3D4B",

  accent100: "#FFF6DC",
  accent200: "#FFECC0",
  accent300: "#FFE19B",
  accent400: "#FDD468",
  accent500: "#FCC340",

  green100: "#DFF5E3",
  green500: "#CDEED3",
  green200: "#2E7D32",

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
  volleyblue: "#2e3c87",
  volleyblueTransparent: "rgba(46, 60, 135, 0.5)",
  volleyyellow: "#fcc340",
  volleyred: "#de3d4b",
  volleyredTransparent: "rgba(222, 61, 75, 0.5)",
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
  tint: volleyColors.volleyblue,
  tintInactive: palette.neutral500,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
  iconColor: palette.neutral900,
  buttonBackground: palette.accent200,
  itemBackground: palette.neutral225,
  primary: volleyColors.volleyblue,
  onPrimary: palette.neutral100,
  surface: palette.neutral225,
  surfacePressed: palette.neutral250,
} as const
