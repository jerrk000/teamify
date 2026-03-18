import React from "react"
import { useAppTheme } from "@/theme/context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageStyle,
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
      themed, theme, themeContext,
    } = useAppTheme()
  

  const placeholderAvatar = theme.isDark
  ? require("../../../../assets/avatar_placeholder_white.png")
  : require("../../../../assets/avatar_placeholder.png")

  const avatarSource = undefined

  const size = 40 //TODO maybe make this dynamic?


  return (
    <View style={styles.outer}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.headerRow}>
          <View style={styles.profileRow}>
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
            <Text style={styles.name}>Max Mustermann</Text>
            <Text style={styles.level}>Additional info</Text>
          </View>
        </View>

          <Pressable style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color="#4b5563" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <Pressable style={styles.mainCard}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={48} color="#fff" />
          </View>
          <Text style={styles.mainText}>Start Game</Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Pressable style={[styles.smallCard, styles.collectionCard]}>
            <View style={styles.smallIconCircle}>
              <Ionicons name="cube-outline" size={30} color="#fff" />
            </View>
            <Text style={styles.smallText}>Collection</Text>
          </Pressable>

          <Pressable style={[styles.smallCard, styles.settingsCard]}>
            <View style={styles.smallIconCircle}>
              <Ionicons name="settings-outline" size={30} color="#fff" />
            </View>
            <Text style={styles.smallText}>Settings</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#373737",
    padding: 12,
  },

  screen: {
    flex: 1,
    backgroundColor: "#e6e2e8",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10213a",
  },

  level: {
    marginTop: 2,
    fontSize: 14,
    color: "#6b7a99",
  },

  notificationButton: {
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
  },

  badge: {
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
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  spacer: {
    height: 110,
  },

  mainCard: {
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
  },

  playCircle: {
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  mainText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallCard: {
    width: "47.5%",
    height: 101,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  collectionCard: {
    backgroundColor: "#4291f3",
  },

  settingsCard: {
    backgroundColor: "#9aa1b0",
  },

  smallIconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -8,
  },

  smallText: {
    marginTop: 42,
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
})

const $avatar: ThemedStyle<ImageStyle> = (theme) => ({
  //TODO do I even need this?
  //backgroundColor: colors?.neutral200 ?? "#eee", //not needed

})
