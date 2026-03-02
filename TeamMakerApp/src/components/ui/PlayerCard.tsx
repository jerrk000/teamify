import React from "react"
import { Image, ImageBackground, StyleSheet, Text, View, Pressable, ViewStyle } from "react-native"

type Img = any // require(...) or { uri: string }
type ThemeFn = <T>(styleFn: (theme: any) => T) => T



export type PlayerCardProps = {
  name: string
  number: number
  playerPng?: Img
  placeholderAvatarSource?: Img
  cardWidth?: number  // Provide this if possible!
  cardHeight?: number // dont provide this, so aspectRatio can maintain consistent card proportions across different widths
  themed?: ThemeFn
  style?: ViewStyle
}

/**
 * Card sizing: keep it stable for grid + drag.
 * Tweak width in the parent; aspectRatio keeps height consistent.
 */
export function PlayerCard({
  name,
  number,
  playerPng,
  placeholderAvatarSource,
  cardWidth,
  cardHeight,
  themed,
  style,
}: PlayerCardProps) {
  const imageSource = playerPng ?? placeholderAvatarSource
  const sizeStyle: ViewStyle = {
    ...(cardWidth != null ? { width: cardWidth } : {}),
    ...(cardHeight != null ? { height: cardHeight, aspectRatio: undefined } : {}),
  }

  return (
    <View style={[styles.wrap, sizeStyle, style]}>
        <ImageBackground
            source={require("../../../assets/images/playercard_empty.png")}
            resizeMode="cover"
            style={styles.bg}
        >
        <View style={{ flex: 1}}/>
        {/* Upper part */}
        <View style={{ flex: 6 }}>
            {imageSource ? (
                <Image source={imageSource} resizeMode="contain" style={styles.playerImg} />
            ) : null}
            {/*<View style={{ position: "absolute", top: 6, left: 6 }}>
                <Text style={[styles.number, themed ? themed($numberText) : null]} numberOfLines={1}>
                    {number}
                </Text>
            </View>*/} 
        </View>

        <View style={{ flex: 3, alignItems: "center", justifyContent: "flex-start" }}>
            <Text style={[styles.name, themed ? themed($nameText) : null]} numberOfLines={1}>
                {name}
            </Text>
        </View>
        <View style={{ flex: 1}}/>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: 110,
    aspectRatio: 0.78, 
  },
  bg: {
    flex: 1,
    position: "relative", // important: absolute children anchor to this
    overflow: "hidden",   // keeps PNG from spilling outside card
  },

  number: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
  },

    playerImg: {
    width: "100%",
    height: "100%",
    },
  name: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111",
    textTransform: "uppercase",
  },
  player: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: "62%",
    width: "100%",
  },
})

const $numberText = (theme: any) =>
  ({
    color: theme.colors.text,
  }) as const

const $nameText = (theme: any) =>
  ({
    color: theme.colors.text,
  }) as const
