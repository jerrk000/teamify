// ATTENTION: TODO: BlurView is currently not working (maybe because its still experimental on android).
// either fix this or delete the BlurView
import {
  Modal,
  Pressable,
  View,
  type ViewStyle,
  TouchableOpacity,
  StyleSheet,
  type TextStyle,
} from "react-native"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useAuthStore } from "@/store/useAuthStore"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

import useModalStore from "../../store/useModalStore"

const TabModal = () => {
  const { isModalVisible, closeModal } = useModalStore()
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const {
    themed,
    themeFlavor,
    themeContext, // The current theme context ("light" | "darK")
    setThemeContextOverride, // Function to set the theme
    setThemeFlavor,
  } = useAppTheme()

  const toggleDarkLight = () => {
    // This will toggle between light and dark mode using the Ignite - ThemeProvider context.
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }

  const toggleThemeFlavor = () => {
    setThemeFlavor(themeFlavor === "default" ? "volleyball" : "default")
  }

  const handleLogout = () => {
    logout()
    closeModal()
    router.replace("/LoginScreen")
  }

  const handleOpenScanner = () => {
    closeModal()
    router.push("/QRCodeScannerScreen" as never)
  }

  return (
    <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={closeModal}>
      <View style={themed($modalRoot)}>
        <BlurView intensity={50} pointerEvents="none" style={themed($blurView)} />
        <Pressable onPress={closeModal} style={themed($modalBackground)} />
        <View
          onStartShouldSetResponder={() => true}
          style={themed([$modalContent, { bottom: insets.bottom + 82 }])}
        >
          <TouchableOpacity onPress={() => alert("Settings")} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenScanner} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Scan QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDarkLight} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Toggle Light/Dark Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleThemeFlavor} style={themed($optionButton)}>
            <Text style={themed($optionText)}>Toggle Theme Flavor ({themeFlavor})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const $modalRoot: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFill,
})

const $blurView: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFill,
})

const $modalBackground: ThemedStyle<ViewStyle> = (theme) => ({
  ...StyleSheet.absoluteFill,
  backgroundColor: theme.colors.palette.overlaymodal,
})

const $modalContent: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  right: 12,
  width: 260,
  maxWidth: "90%",
  padding: 10,
  borderRadius: 8,
  backgroundColor: theme.colors.background,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.border,
  shadowColor: theme.colors.palette.neutral900,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
})

const $optionButton: ThemedStyle<ViewStyle> = (theme) => ({
  paddingVertical: 14,
  paddingHorizontal: 12,
  backgroundColor: theme.colors.palette.neutral100, // TODO use a color from the theme instead of hardcoding
  borderRadius: 5,
  marginVertical: 4,
  width: "100%",
  alignItems: "center",
})

const $optionText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 18, // TODO make fontsize part of theme
  color: theme.colors.text,
})

export default TabModal
