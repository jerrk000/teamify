import { FC, useEffect, useState } from "react"
import { Modal, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

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

const MIN_RATING = 1
const MAX_RATING = 10
const DEFAULT_TRACK_WIDTH = 1

const PlayerRatingModal: FC<PlayerRatingModalProps> = ({
  visible,
  player,
  rating,
  onChangeRating,
  onDone,
}) => {
  const { themed, theme } = useAppTheme()
  const [trackWidth, setTrackWidth] = useState(DEFAULT_TRACK_WIDTH)

  useEffect(() => {
    if (visible && rating < MIN_RATING) {
      onChangeRating(MIN_RATING)
    }
  }, [onChangeRating, rating, visible])

  const clampedRating = Math.min(MAX_RATING, Math.max(MIN_RATING, Math.round(rating)))
  const progress = (clampedRating - MIN_RATING) / (MAX_RATING - MIN_RATING)

  const updateRatingFromX = (x: number) => {
    const nextProgress = Math.min(1, Math.max(0, x / trackWidth))
    const nextRating = Math.round(MIN_RATING + nextProgress * (MAX_RATING - MIN_RATING))
    onChangeRating(nextRating)
  }

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
          <Text style={themed($title)}>Rate between 1 to 10</Text>

          <View style={themed($ratingPanel)}>
            <Text style={themed($ratingText)} numberOfLines={2}>
              Rating of {player?.name ?? "Player"} is - {clampedRating}
            </Text>

            <View
              style={themed($sliderHitArea)}
              onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(event) => updateRatingFromX(event.nativeEvent.locationX)}
              onResponderMove={(event) => updateRatingFromX(event.nativeEvent.locationX)}
            >
              <View style={themed($track)}>
                <View style={[themed($activeTrack), { width: `${progress * 100}%` }]} />
                {Array.from({ length: MAX_RATING - MIN_RATING + 1 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      themed($tick),
                      { left: `${(index / (MAX_RATING - MIN_RATING)) * 100}%` },
                    ]}
                  />
                ))}
                <View
                  style={[
                    themed($thumb),
                    {
                      left: `${progress * 100}%`,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
              </View>
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
  ...StyleSheet.absoluteFillObject,
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
  fontSize: 30,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 22,
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

const $sliderHitArea: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  height: 48,
  justifyContent: "center",
})

const $track: ThemedStyle<ViewStyle> = (theme) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.colors.palette.neutral500,
  position: "relative",
})

const $activeTrack: ThemedStyle<ViewStyle> = (theme) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.colors.palette.neutral100,
})

const $tick: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  top: 1,
  width: 4,
  height: 4,
  marginLeft: -2,
  borderRadius: 2,
  backgroundColor: theme.colors.palette.neutral600,
})

const $thumb: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: -18,
  width: 42,
  height: 42,
  marginLeft: -21,
  borderRadius: 21,
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
