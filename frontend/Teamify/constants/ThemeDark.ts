import { DarkTheme } from '@react-navigation/native';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000', //black
    primary: '#fcc340', //yellow
    text: '#fcc340', //also yellow, check if nowhere text on primary
  },
};

export default CustomDarkTheme;
