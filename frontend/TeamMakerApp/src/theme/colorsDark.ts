const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#F4F2F1",
  neutral700: "#D7CEC9",
  neutral600: "#B6ACA6",
  neutral500: "#978F8A",
  neutral400: "#564E4A",
  neutral300: "#3C3836",
  neutral250: "#2B2426",
  neutral225: "#221A1D",
  neutral200: "#191015",
  neutral100: "#000000",

  primary50:  "#f5f5f6",
  primary100: "#cacacb",
  primary200: "#a0a0a1",
  primary300: "#787879",
  primary400: "#535354",
  primary500: "#303033",
  primary600: "#201f2f",
  primary700: "#0d0924",
  primary800: "#02000c",
  primary900: "#000000",

secondary50:  "#f5f5f6",
secondary100: "#cdcdce",
secondary200: "#a7a7a8",
secondary300: "#838384",
secondary400: "#606061",
secondary500: "#3f3f42",
secondary600: "#363546",
secondary700: "#2a2846",
secondary800: "#201945",
secondary900: "#180745",

tertiary50:  "#f5f5f8",
tertiary100: "#d1d1d4",
tertiary200: "#afafb2",
tertiary300: "#8e8e91",
tertiary400: "#6e6e71",
tertiary500: "#505055",
tertiary600: "#434256",
tertiary700: "#333051",
tertiary800: "#231d4b",
tertiary900: "#180646",

  green100: "#DFF5E3", // I didnt switch the order of these
  green200: "#CDEED3",
  green500: "#2E7D32",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
  overlaymodal: "rgba(0, 0, 0, 0.5)",

  blackHard: "black",
  whiteHard: "white",
  blueHard: "blue",
} as const

const volleyColors = {
  volleyblue: '#2e3c87', //dark blue
  volleyblueTransparent: 'rgba(0, 123, 255, 0.5)', //50% transparent blue, instead of //"#3498db". //TODO this is from first implementation, maybe change.
  volleyyellow: '#fcc340', //yellow
  volleyred: '#de3d4b', //red
  volleyredTransparent: 'rgba(220, 20, 60, 0.5)', //50$ transparent red //TODO this is from first implementation, maybe change.

} as const

export const colors = {
  palette,
  volleyColors,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  selected: palette.neutral300,
  border: palette.neutral400,
  tint: palette.neutral900,//before it was palette.primary500,
  tintInactive: palette.neutral500,//before it was palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
  iconColor: palette.whiteHard,
  buttonBackground: palette.neutral300,
  itemBackground: palette.neutral225,
  primary: palette.primary500,
  secondary: palette.secondary500,
  tertiary: palette.tertiary500,
  onPrimary: palette.neutral900,
  surface: palette.neutral225,       
  surfacePressed: palette.neutral250,
} as const
