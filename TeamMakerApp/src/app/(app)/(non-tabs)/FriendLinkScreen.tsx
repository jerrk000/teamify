import { useState } from "react"
import { View, type TextStyle, type ViewStyle } from "react-native"
import * as Clipboard from "expo-clipboard"
import QRCode from "react-native-qrcode-svg"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

const FRIEND_LINK = "https://yourapp.com/join/123456789"

export default function FriendLinkScreen() {
  const { themed, theme } = useAppTheme()
  const [copyButtonText, setCopyButtonText] = useState("Copy link")

  const copyFriendLink = async () => {
    await Clipboard.setStringAsync(FRIEND_LINK)
    setCopyButtonText("Copied")
  }

  return (
    <SafeAreaView style={themed($container)}>
      <View style={themed($content)}>
        <View style={themed($qrCodeContainer)}>
          <QRCode
            value={FRIEND_LINK}
            size={220}
            color={theme.colors.palette.neutral900}
            backgroundColor={theme.colors.palette.neutral100}
          />
        </View>

        <View style={themed($linkContainer)}>
          <Text text={FRIEND_LINK} style={themed($linkText)} selectable />
          <Button
            text={copyButtonText}
            preset="filled"
            onPress={copyFriendLink}
            style={themed($copyButton)}
          />
        </View>

        <Text
          text="Every person that you add as a friend can add you to a game without your future permission. Only share your friend-link with people you trust!"
          style={themed($disclaimer)}
        />
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
  justifyContent: "center",
  paddingHorizontal: theme.spacing.lg,
  paddingVertical: theme.spacing.xl,
  gap: theme.spacing.lg,
})

const $qrCodeContainer: ThemedStyle<ViewStyle> = (theme) => ({
  alignSelf: "center",
  padding: theme.spacing.md,
  backgroundColor: theme.colors.palette.neutral100,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.colors.border,
})

const $linkContainer: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.sm,
})

const $linkText: ThemedStyle<TextStyle> = (theme) => ({
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
  borderRadius: 6,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  textAlign: "center",
})

const $copyButton: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "stretch",
})

const $disclaimer: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  textAlign: "center",
})
