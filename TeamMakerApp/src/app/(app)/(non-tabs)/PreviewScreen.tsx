import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, type ViewStyle } from "react-native"

import { PlayerCard } from "@/components/ui/PlayerCard"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export default function PreviewScreen() {
  const { themed } = useAppTheme()

  return (
    <SafeAreaView style={themed($screen)}>
      <View style={themed($cardWrap)}>
        <PlayerCard
          name="Sample Player"
          number={67}
          placeholderAvatarSource={require("../../../../assets/avatar-placeholder.png")}
          cardWidth={180}
          //cardHeight={180} //dont provide this, so aspectRatio can keep proportions
          themed={themed}
        />
      </View>
    </SafeAreaView>
  )
}

const $screen: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  alignItems: "center",
  justifyContent: "center",
})

const $cardWrap: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
})
