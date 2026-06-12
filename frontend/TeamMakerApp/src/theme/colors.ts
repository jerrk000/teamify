const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral225: "#EDE9E7",
  neutral250: "#E6E0DD",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary50:  "#f5f5f4",
  primary100: "#d0d0cf",
  primary200: "#acacab", //did not use the normal scheme with primary, secondary and tertiary color palette
  primary300: "#898988", //tertiary color for default
  primary400: "#686867", //secondary color for default
  primary500: "#48484a", //primary color for default
  primary600: "#3d3c4d",
  primary700: "#2f2d4a",
  primary800: "#221b47",
  primary900: "#180844",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  green100: "#DFF5E3",
  green500: "#CDEED3",
  green200: "#2E7D32",

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
  volleyColors, //TODO delete this later?
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information. Also used for placeholder text.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /*
  * The default color for a selected item, for example a selected list item or selected button.
  */
  selected: palette.neutral300,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.neutral900,//before it was palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,//before it was palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
  /**
   * Color of icons.
   */
  iconColor: palette.blackHard,
  /*
  * Default button background color, should be used for buttons that do not have a specific color.
  */
  buttonBackground: palette.neutral300,
  /*
  * Default item background color, should be used for items that do not have a specific color.
  */
  itemBackground: palette.neutral225,
  /*
  * Strong primary color, used for key components like the active tab and active buttons. Try to use sparingly, as it can be overpowering.
  */
  primary: palette.primary500,
  /*
  * Strong secondary color, used for key components like second important buttons. Try to use sparingly, as it can be overpowering.
  */
  secondary: palette.primary400,
  /*
  * Strong tertiary color, used for key components like third important buttons. Try to use sparingly, as it can be overpowering.
  */
  tertiary: palette.primary300,
  /**
  * On primary color, used for text and icons on top of the primary color. Should have good contrast with primary.
  */
  onPrimary: palette.neutral100,
  /*
  * Surface color, used for cards, sheets, and other surfaces. Can be used as a background color for components.
  */
  surface: palette.neutral225,     
  /*
  * Pressed state for surfaces, such as cards and sheets. Should be a subtle change from surface to indicate interactivity.
  */   
  surfacePressed: palette.neutral250, // pressed state for chips
} as const
