import { DefaultTheme } from '@react-navigation/native';

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', //white
    primary: '#2e3c87', //dark blue
    text: '#000000', //black
    //corresponding yellow color '#fcc340'
    //sand: '#f0dbc3'
    //blue sky: '#d7e5f0'
  },
};

export default CustomLightTheme;
