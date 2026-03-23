import React from "react"
import { useAppTheme } from "@/theme/context";
import {
  View,
  Text,
  Image,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedStyle } from "@/theme/types";
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

type Props = {
  notificationCount?: number
}

export default function HomeScreen({ notificationCount = 12 }: Props) {
  const badgeText = notificationCount > 9 ? "9+" : String(notificationCount)

  const {
      themed, theme,
    } = useAppTheme()
  

  const placeholderAvatar = theme.isDark
  ? require("../../../../assets/avatar_placeholder_white.png")
  : require("../../../../assets/avatar_placeholder.png")

  const avatarSource = undefined

  const size = 40 //TODO maybe make this dynamic?

    const handlePlayerSelection = () => {
      router.push({pathname: '/MakeTeamsScreen',})
        // Dont forget to add cases here if new modes are implemented
    }

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

        <View style={themed($notificationButtonContainer)}>
          <Button
            style={themed($notificationButton)}
            LeftAccessory={({ style }) => (
              <View style={[style, themed($notificationIconWrapper)]}>
                <IconSymbol
                  size={20}
                  name="bell"
                  color={theme.colors.iconColor}
                  iconSet="fontawesome6"
                />
              </View>
            )}
          />
          {notificationCount > 0 && (
            <View pointerEvents="none" style={themed($badge)}>
              <Text style={themed($badgeText)}>{badgeText}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={themed($content)}>
        <Button
          text="Start Game" 
          onPress={handlePlayerSelection} 
          style={themed($mainCard)}
          textStyle={themed($mainText)} 
          LeftAccessory={({ style }) => (
            <View style={[style, themed($mainIconCircle)]}>
              <IconSymbol
                size={48}
                name="play"
                color={theme.colors.onPrimary}
                iconSet="fontawesome"
              />
            </View>
          )}
        />
    

        <View style={themed($bottomRow)}>
          <Button
            text="Play for fun" 
            onPress={handlePlayerSelection} 
            style={[themed($smallCard), themed($smallCardLeft), themed($collectionCard)]}
            textStyle={themed($smallText)} 
            LeftAccessory={({ style }) => (
              <View style={[style, themed($smallIconCircle)]}>
                <IconSymbol
                  size={30}
                  name="rocket"
                  color={theme.colors.onPrimary}
                  iconSet="fontawesome"
                />
              </View>
            )}
          />
        
          <Button
            text="Settings" 
            onPress={handlePlayerSelection} 
            style={[themed($smallCard), themed($settingsCard)]}
            textStyle={themed($smallText)} 
            LeftAccessory={({ style }) => (
              <View style={[style, themed($smallIconCircle)]}>
                <IconSymbol
                  size={30}
                  name="gear"
                  color={theme.colors.onPrimary}
                  iconSet="fontawesome"
                />
              </View>
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

const $notificationButtonContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
})

const $notificationButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: 42, //TODO hardcoded size currently
  height: 42,
  minHeight: 42,
  borderRadius: 21,
  backgroundColor: theme.colors.itemBackground, //TODO itemBackground?
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 0,
  paddingVertical: 0,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
})

const $notificationIconWrapper: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
})

const $badge: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 2,
  right: 2,
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

const $content: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  marginTop: 24,
})

const $mainCard: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 0.62,
  borderRadius: 26,
  backgroundColor: theme.colors.primary,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 5,
})

const $mainIconCircle: ThemedStyle<ViewStyle> = () => ({
  width: 122,
  height: 122,
  borderRadius: 61,
  backgroundColor: "rgba(255,255,255,0.16)", //some tinted primary?
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
})

const $mainText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: "800",
  color: theme.colors.onPrimary,
  marginTop: 6,
})

const $bottomRow: ThemedStyle<ViewStyle> = () => ({
  flex: 0.38,
  flexDirection: "row",
})

const $smallCardLeft: ThemedStyle<ViewStyle> = () => ({
  marginRight: 10,
})

const $smallCard: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  height: "100%",
  borderRadius: 16,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 4,
})

const $collectionCard: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.secondary,
})

const $settingsCard: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.tertiary,
})

const $smallIconCircle: ThemedStyle<ViewStyle> = () => ({
  width: 74,
  height: 74,
  borderRadius: 37,
  backgroundColor: "rgba(255,255,255,0.14)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
})

const $smallText: ThemedStyle<TextStyle> = (theme) => ({
  marginTop: 2,
  fontSize: 18,
  fontWeight: "700",
  color: theme.colors.onPrimary,
})
