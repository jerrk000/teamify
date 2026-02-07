import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

//TODO this is the button from my old project. There is also a button outside of the ui folder 
// (original from ignite boilerplate). Probably remove this button and just use the other one
//TODO maybe make this a *themed* button here already, so that i dont have to manually change to darkmode everywhere

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  textStyle?: object;
  lightColor?: string;
  darkColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  lightColor,
  darkColor,
}) => {
  
  const buttonColor = useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  return (
    <TouchableOpacity
      style={[{backgroundColor: buttonColor}, styles.button, disabled && styles.disabledButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    //backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
