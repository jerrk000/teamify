import { useState } from "react"
import { Alert, View, type TextStyle, type ViewStyle } from "react-native"
import * as Clipboard from "expo-clipboard"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export default function AddFriendScreen() {
  const router = useRouter()
  const { themed, theme } = useAppTheme()
  const [friendCode, setFriendCode] = useState("")

  const pasteFriendCode = async () => {
    const pastedCode = await Clipboard.getStringAsync()
    setFriendCode(pastedCode)
  }

  const addFriend = () => {
    if (!friendCode.trim()) return

    Alert.alert("Friend code ready", "Backend friend adding will be connected later.")
  }

  const openScanner = () => {
    router.push("/QRCodeScannerScreen" as never)
  }

  return (
    <SafeAreaView style={themed($container)}>
      <View style={themed($content)}>
        <Text text="Add friends" preset="heading" style={themed($title)} />

        <View style={themed($codeSection)}>
          <TextField
            label="Friend code"
            value={friendCode}
            onChangeText={setFriendCode}
            placeholder="Paste a friend code"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button text="Paste code" preset="filled" onPress={pasteFriendCode} />
          <Button
            text="Add friend"
            preset="filled"
            onPress={addFriend}
            disabled={!friendCode.trim()}
            disabledStyle={themed($disabledButton)}
          />
        </View>

        <View style={themed($scannerSection)}>
          <Button
            text="Scan QR Code "
            preset="filled"
            onPress={openScanner}
            RightAccessory={({ style }) => (
              <IconSymbol name="qr-code-scanner" size={22} color={theme.colors.text} style={style} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $content: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  paddingHorizontal: theme.spacing.lg,
  paddingVertical: theme.spacing.xl,
  gap: theme.spacing.lg,
})

const $title: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $codeSection: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.sm,
})

const $scannerSection: ThemedStyle<ViewStyle> = (theme) => ({
  paddingTop: theme.spacing.md,
})

const $disabledButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral300,
  opacity: 0.5,
})
