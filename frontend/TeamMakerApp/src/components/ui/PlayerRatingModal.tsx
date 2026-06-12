import { FC, useEffect } from "react"
import { Modal, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Slider } from "@expo/ui/community/slider"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

interface PlayerRatingModalProps {
  visible: boolean
  player?: Player
  rating: number
  onChangeRating: (rating: number) => void
  onDone: () => void
}

const MIN_RATING = 0
const MAX_RATING = 10

const PlayerRatingModal: FC<PlayerRatingModalProps> = ({
  visible,
  player,
  rating,
  onChangeRating,
  onDone,
}) => {
  const { themed, theme } = useAppTheme()

  useEffect(() => {
    if (visible && rating < MIN_RATING) {
      onChangeRating(MIN_RATING)
    }
  }, [onChangeRating, rating, visible])

  const clampedRating = Math.min(MAX_RATING, Math.max(MIN_RATING, Math.round(rating)))

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onDone}
      statusBarTranslucent
    >
      <View style={themed($overlay)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onDone}
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close rating modal"
        />

        <View style={themed($sheet)}>
          <Text style={themed($title)}>Quick Rating</Text>

          <View style={themed($ratingPanel)}>
            <Text style={themed($ratingText)} numberOfLines={2}>
              Rating of {player?.name ?? "Player"}: {clampedRating}
            </Text>

            <View style={themed($sliderWrap)}>
               <View style={themed($sliderLabels)}>
                <Text style={themed($sliderLabel)}>Beginner</Text>
                <Text style={themed($sliderLabel)}>Professional</Text>
              </View>
              <Slider
                value={clampedRating}
                minimumValue={MIN_RATING}
                maximumValue={MAX_RATING}
                lowerLimit={MIN_RATING}
                upperLimit={MAX_RATING}
                step={1}
                minimumTrackTintColor={theme.colors.palette.neutral100}
                maximumTrackTintColor={theme.colors.palette.neutral500}
                thumbTintColor={theme.colors.primary}
                onValueChange={(nextRating) => onChangeRating(Math.round(nextRating))}
                style={themed($slider)}
              />
            </View>
          </View>

          <View style={themed($buttonWrap)}>
            <Button
              text="Done"
              onPress={onDone}
              style={themed($doneButton)}
              textStyle={themed($doneButtonText)}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const $overlay: ThemedStyle<ViewStyle> = (theme) => ({
  ...StyleSheet.absoluteFill,
  justifyContent: "flex-end",
  backgroundColor: theme.colors.palette.overlaymodal,
})

const $sheet: ThemedStyle<ViewStyle> = (theme) => ({
  width: "100%",
  paddingTop: 18,
  paddingBottom: 22,
  paddingLeft: 20,
  paddingRight: 20,
  borderTopLeftRadius: 38,
  borderTopRightRadius: 38,
  backgroundColor: theme.colors.itemBackground,
})

const $title: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.primary,
  fontSize: 28,
  lineHeight: 36,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 18,
  paddingBottom: 4,
  
})

const $ratingPanel: ThemedStyle<ViewStyle> = (theme) => ({
  minHeight: 150,
  borderRadius: 14,
  backgroundColor: theme.colors.secondary,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 24,
  paddingVertical: 22,
})

const $ratingText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 24,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 24,
})

const $sliderWrap: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  justifyContent: "center",
})

const $sliderLabels: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  //marginBottom: 6,
})

const $sliderLabel: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 14,
  fontWeight: "700",
})


const $slider: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  height: 48,
})

const $buttonWrap: ThemedStyle<ViewStyle> = () => ({
  marginTop: 28,
})

const $doneButton: ThemedStyle<ViewStyle> = (theme) => ({
  minHeight: 68,
  borderRadius: 14,
  backgroundColor: theme.colors.primary,
})

const $doneButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.onPrimary,
  fontSize: 28,
  fontWeight: "800",
})

export default PlayerRatingModal
