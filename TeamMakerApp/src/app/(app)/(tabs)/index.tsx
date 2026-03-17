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

export default function HomeScreen() {

  const {
      themed, theme, themeContext,
    } = useAppTheme()
  

  const placeholderAvatar = theme.isDark
  ? require("../../../../assets/avatar_placeholder_white.png")
  : require("../../../../assets/avatar_placeholder.png")

  const avatarSource = undefined

  const size = 40 //TODO maybe make this dynamic?

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top profile row */}
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

        {/* Main CTA card */}
        <Pressable style={styles.mainCard}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={52} color="#fff" />
          </View>
          <Text style={styles.mainCardText}>Start Game</Text>
        </Pressable>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <Pressable style={[styles.smallCard, styles.collectionCard]}>
            <View style={styles.smallIconCircle}>
              <Ionicons name="cube-outline" size={34} color="#fff" />
            </View>
            <Text style={styles.smallCardText}>Collection</Text>
          </Pressable>

          <Pressable style={[styles.smallCard, styles.settingsCard]}>
            <View style={styles.smallIconCircle}>
              <Ionicons name="settings-outline" size={34} color="#fff" />
            </View>
            <Text style={styles.smallCardText}>Settings</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const $avatar: ThemedStyle<ImageStyle> = (theme) => ({
  //TODO do I even need this?
  //backgroundColor: colors?.neutral200 ?? "#eee", //not needed

})


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#dcd8df",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },

  level: {
    marginTop: 2,
    fontSize: 16,
    color: "#6b7280",
  },

  mainCard: {
    flex: 1,
    minHeight: 340,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#b300ff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  playCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  mainCardText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  smallCard: {
    flex: 1,
    height: 150,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  collectionCard: {
    backgroundColor: "#4d97f3",
  },

  settingsCard: {
    backgroundColor: "#9ca3af",
  },

  smallIconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  smallCardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
})