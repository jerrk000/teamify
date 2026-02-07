/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// TODO i am not sure if this is needed at a later point. I hope I can translate this into the theme-engine of ignite, so that we can delete this.

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    listselection: '#fcc340', //yellow
    button: '#2e3c87', //dark blue
    buttonText: '#ffffff', //white
    volley1: '#2e3c87', //dark blue
    volley2: '#fcc340', //yellow
    volley3: '#de3d4b', //red
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    listselection: '#fcc340', //yellow
    button: '#fcc340', //yellow
    buttonText: '#000000', //black
    volley1: '#2e3c87', //dark blue
    volley2: '#fcc340', //yellow
    volley3: '#de3d4b', //red
  },
};
