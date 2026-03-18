import React from "react"
import { useAppTheme } from "@/theme/context";
import {
  View,
  Text,
  Image,
  Pressable,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons"
import { ThemedStyle } from "@/theme/types";

type Props = {
  notificationCount?: number
}

export default function HomeScreen({ notificationCount = 3 }: Props) {
  const badgeText = notificationCount > 9 ? "9+" : String(notificationCount)

  const {
      themed, theme,
    } = useAppTheme()
  

  const placeholderAvatar = theme.isDark
  ? require("../../../../assets/avatar_placeholder_white.png")
  : require("../../../../assets/avatar_placeholder.png")

  const avatarSource = undefined

  const size = 40 //TODO maybe make this dynamic?


  return (
    <SafeAreaView style={themed($container)}>
      <View style={themed($headerRow)}>
        <View style={themed($profileRow)}>
        <Image
          source={avatarSource ?? placeholderAvatar}
          style={[themed($avatar), 
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginRight: 12,
            },
            (avatarSource && theme.isDark) && { backgroundColor: theme.colors.palette.neutral200 ?? "#eee" },]} //when darkmode and no avatar, make grey background
        />
        <View>
          <Text style={themed($name)}>Max Mustermann</Text>
          <Text style={themed($level)}>Additional info</Text>
        </View>
      </View>

        <Pressable style={themed($notificationButton)}>
          <Ionicons name="notifications-outline" size={20} color="#4b5563" />
          {notificationCount > 0 && (
            <View style={themed($badge)}>
              <Text style={themed($badgeText)}>{badgeText}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={themed($spacer)} />

      <Pressable style={themed($mainCard)}>
        <View style={themed($playCircle)}>
          <Ionicons name="play" size={48} color="#fff" />
        </View>
        <Text style={themed($mainText)}>Start Game</Text>
      </Pressable>

      <View style={themed($bottomRow)}>
        <Pressable style={[themed($smallCard), themed($collectionCard)]}>
          <View style={themed($smallIconCircle)}>
            <Ionicons name="cube-outline" size={30} color="#fff" />
          </View>
          <Text style={themed($smallText)}>Collection</Text>
        </Pressable>

        <Pressable style={[themed($smallCard), themed($settingsCard)]}>
          <View style={themed($smallIconCircle)}>
            <Ionicons name="settings-outline" size={30} color="#fff" />
          </View>
          <Text style={themed($smallText)}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  padding: 12,
})

const $headerRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
})

const $profileRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $avatar: ThemedStyle<ImageStyle> = () => ({
  width: 52,
  height: 52,
  borderRadius: 26,
  marginRight: 12,
})

const $name: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 18,
  fontWeight: "700",
  color: theme.colors.text,
})

const $level: ThemedStyle<TextStyle> = (theme) => ({
  marginTop: 2,
  fontSize: 14,
  color: theme.colors.text,
})

const $notificationButton: ThemedStyle<ViewStyle> = () => ({
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#f0eef1",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
  position: "relative",
})

const $badge: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: -2,
  right: -1,
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  paddingHorizontal: 4,
  backgroundColor: "#ff3b30",
  justifyContent: "center",
  alignItems: "center",
})

const $badgeText: ThemedStyle<TextStyle> = () => ({
  color: "#fff",
  fontSize: 10,
  fontWeight: "700",
})

const $spacer: ThemedStyle<ViewStyle> = () => ({
  height: 110,
})

const $mainCard: ThemedStyle<ViewStyle> = () => ({
  height: 285,
  borderRadius: 26,
  backgroundColor: "#b000ff",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 22,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 5,
})

const $playCircle: ThemedStyle<ViewStyle> = () => ({
  width: 122,
  height: 122,
  borderRadius: 61,
  backgroundColor: "rgba(255,255,255,0.16)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
})

const $mainText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
  fontWeight: "800",
  color: "#fff",
})

const $bottomRow: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
})

const $smallCard: ThemedStyle<ViewStyle> = () => ({
  width: "47.5%",
  height: "100%",
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 4,
})

const $collectionCard: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#4291f3",
})

const $settingsCard: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#9aa1b0",
})

const $smallIconCircle: ThemedStyle<ViewStyle> = () => ({
  width: 74,
  height: 74,
  borderRadius: 37,
  backgroundColor: "rgba(255,255,255,0.14)",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "40%",
  transform: [{ translateY: -37 }],
})

const $smallText: ThemedStyle<TextStyle> = () => ({
  marginTop: 42,
  fontSize: 15,
  fontWeight: "700",
  color: "#fff",
})
