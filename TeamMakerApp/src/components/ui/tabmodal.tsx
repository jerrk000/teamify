// ATTENTION: TODO: BlurView is currently not working (maybe because its still experimental on android).
// either fix this or delete the BlurView
import React from 'react';
import { Modal, View,type ViewStyle, Text, TouchableOpacity, StyleSheet,type TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useModalStore from '../../store/useModalStore'; 
import { useAuthStore } from '@/store/useAuthStore';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';

const TabModal = () => {
  const { isModalVisible, toggleModal } = useModalStore();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const {
  themed,
  theme,
  themeContext, // The current theme context ("light" | "darK")
  setThemeContextOverride, // Function to set the theme
  } = useAppTheme()


  const toggleDarkLight = () => {
    // This will toggle between light and dark mode using the Ignite - ThemeProvider context.
  setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  };

  const handleLogout = () => {
    logout();
    toggleModal();
    router.replace('/LoginScreen');
  };

  return (
    <Modal transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
      <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={themed($modalBackground)}>
      <BlurView intensity={50} style={themed($blurView)}>
        <View style={themed($modalContent)}>
          <TouchableOpacity onPress={() => alert('Settings')} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Close')} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDarkLight} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Toggle Light/Dark Mode</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

const $blurView: ThemedStyle<ViewStyle> = (theme) => ({
  ...StyleSheet.absoluteFillObject,
});

const $modalBackground: ThemedStyle<ViewStyle> = (theme) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.palette.overlaymodal,
});

const $modalContent: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const $optionButton: ThemedStyle<ViewStyle> = (theme) => ({
  padding: 15,
  backgroundColor: theme.colors.palette.neutral100, // TODO use a color from the theme instead of hardcoding
  borderRadius: 5,
  marginVertical: 10,
  width: '80%',
  alignItems: 'center',
});

const $optionText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 18, // TODO make fontsize part of theme
  color: theme.colors.text,
});

export default TabModal;
