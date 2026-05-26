import { FC, useMemo, useState } from "react"
import { Modal, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Slider } from "@expo/ui/community/slider"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Player } from "@/types/PlayerType"

const MIN_RATING = 0
const MAX_RATING = 10
const DEFAULT_RATING = 5

export type PlayerSkillRatingKey =
  | "technique"
  | "fitness"
  | "tactics"
  | "mentality"
  | "passing"
  | "shooting"

export type PlayerSkillRatings = Record<PlayerSkillRatingKey, number>

export interface PlayerSkillRatingItem {
  key: PlayerSkillRatingKey
  title: string
  lowEmoji: string
  lowLabel: string
  highEmoji: string
  highLabel: string
}

interface PlayerSkillRatingModalProps {
  visible: boolean
  player?: Player
  ratings?: Partial<PlayerSkillRatings>
  skills?: PlayerSkillRatingItem[]
  onSave: (ratings: PlayerSkillRatings) => void
  onCancel: () => void
}

const DEFAULT_SKILLS: PlayerSkillRatingItem[] = [
  {
    key: "technique",
    title: "Technique",
    lowEmoji: "😅",
    lowLabel: "New to football",
    highEmoji: "⚽",
    highLabel: "Outstanding technique",
  },
  {
    key: "fitness",
    title: "Fitness",
    lowEmoji: "🫁",
    lowLabel: "Done after one sprint",
    highEmoji: "🏃",
    highLabel: "Runs the whole game",
  },
  {
    key: "tactics",
    title: "Tactics",
    lowEmoji: "🤷",
    lowLabel: "No idea where to stand",
    highEmoji: "🧠",
    highLabel: "Strong tactical understanding",
  },
  {
    key: "mentality",
    title: "Mentality",
    lowEmoji: "🤯",
    lowLabel: "Struggles under pressure",
    highEmoji: "💪",
    highLabel: "Calm in big moments",
  },
  {
    key: "passing",
    title: "Passing",
    lowEmoji: "🎯",
    lowLabel: "Passes rarely arrive",
    highEmoji: "🪄",
    highLabel: "Finds every teammate",
  },
  {
    key: "shooting",
    title: "Shooting",
    lowEmoji: "🥅",
    lowLabel: "Avoids taking shots",
    highEmoji: "🚀",
    highLabel: "Clinical finisher",
  },
]

function buildRatings(ratings?: Partial<PlayerSkillRatings>): PlayerSkillRatings {
  return DEFAULT_SKILLS.reduce((nextRatings, skill) => {
    nextRatings[skill.key] = clampRating(ratings?.[skill.key] ?? DEFAULT_RATING)
    return nextRatings
  }, {} as PlayerSkillRatings)
}

function clampRating(rating: number) {
  return Math.min(MAX_RATING, Math.max(MIN_RATING, Math.round(rating)))
}

const PlayerSkillRatingModal: FC<PlayerSkillRatingModalProps> = ({
  visible,
  player,
  ratings,
  skills = DEFAULT_SKILLS,
  onSave,
  onCancel,
}) => {
  const { themed, theme } = useAppTheme()
  const initialRatings = useMemo(() => buildRatings(ratings), [ratings])
  const [draftRatings, setDraftRatings] = useState<PlayerSkillRatings>(initialRatings)

  const setSkillRating = (skillKey: PlayerSkillRatingKey, nextRating: number) => {
    setDraftRatings((currentRatings) => ({
      ...currentRatings,
      [skillKey]: clampRating(nextRating),
    }))
  }

  const handleSave = () => {
    onSave(draftRatings)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
      onShow={() => setDraftRatings(initialRatings)}
      statusBarTranslucent
    >
      <SafeAreaView style={themed($screen)}>
        <View style={themed($header)}>
          <Button
            text="Cancel"
            onPress={onCancel}
            style={themed($headerButton)}
            textStyle={themed($headerButtonText)}
          />
          <Text style={themed($title)} numberOfLines={1}>
            Player Rating
          </Text>
          <View style={themed($headerSpacer)} />
        </View>

        <ScrollView
          style={themed($scroll)}
          contentContainerStyle={themed($scrollContent)}
          showsVerticalScrollIndicator={false}
        >
          <View style={themed($intro)}>
            <Text style={themed($headline)}>
              Rate {player?.name ?? "this player"} across these football skills.
            </Text>
            <Text style={themed($subhead)}>
              Use the sliders to capture the current player level.
            </Text>
          </View>

          {skills.map((skill) => (
            <View key={skill.key} style={themed($skillBlock)}>
              <Text style={themed($skillTitle)}>{skill.title}</Text>

              <View style={themed($skillLabels)}>
                <View style={themed($skillLabelGroup)}>
                  <Text style={themed($emoji)}>{skill.lowEmoji}</Text>
                  <Text style={themed($skillLabel)}>{skill.lowLabel}</Text>
                </View>
                <View style={[themed($skillLabelGroup), themed($rightLabelGroup)]}>
                  <Text style={themed($emoji)}>{skill.highEmoji}</Text>
                  <Text style={[themed($skillLabel), themed($rightLabel)]}>{skill.highLabel}</Text>
                </View>
              </View>

              <View style={themed($sliderWrap)}>
                <View pointerEvents="none" style={themed($tickRow)}>
                  {Array.from({ length: MAX_RATING + 1 }).map((_, index) => {
                    const isActive = index <= draftRatings[skill.key]
                    return (
                      <View
                        key={index}
                        style={[
                          themed($tick),
                          {
                            backgroundColor: isActive
                              ? theme.colors.volleyColors.volleyyellow
                              : theme.colors.palette.neutral400,
                          },
                        ]}
                      />
                    )
                  })}
                </View>
                <Slider
                  value={draftRatings[skill.key]}
                  minimumValue={MIN_RATING}
                  maximumValue={MAX_RATING}
                  lowerLimit={MIN_RATING}
                  upperLimit={MAX_RATING}
                  step={1}
                  minimumTrackTintColor={theme.colors.volleyColors.volleyyellow}
                  maximumTrackTintColor={theme.colors.palette.neutral400}
                  thumbTintColor={theme.colors.palette.whiteHard}
                  onValueChange={(nextRating) => setSkillRating(skill.key, nextRating)}
                  style={themed($slider)}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={themed($footer)}>
          <Button
            text="Save"
            onPress={handleSave}
            style={themed($saveButton)}
            textStyle={themed($saveButtonText)}
          />
          <Button
            text="Cancel"
            onPress={onCancel}
            style={themed($cancelButton)}
            textStyle={themed($cancelButtonText)}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const $screen: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $header: ThemedStyle<ViewStyle> = () => ({
  minHeight: 58,
  paddingHorizontal: 18,
  flexDirection: "row",
  alignItems: "center",
})

const $headerButton: ThemedStyle<ViewStyle> = () => ({
  minHeight: 44,
  minWidth: 82,
  borderWidth: 0,
  backgroundColor: "transparent",
  paddingHorizontal: 0,
})

const $headerButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 17,
  lineHeight: 22,
  fontWeight: "500",
  textAlign: "left",
})

const $title: ThemedStyle<TextStyle> = (theme) => ({
  flex: 1,
  color: theme.colors.text,
  fontSize: 20,
  lineHeight: 26,
  fontWeight: "800",
  textAlign: "center",
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 82,
})

const $scroll: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $scrollContent: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: 20,
  paddingTop: 36,
  paddingBottom: 18,
})

const $intro: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 42,
})

const $headline: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 28,
  lineHeight: 38,
  fontWeight: "800",
  marginBottom: 14,
})

const $subhead: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 21,
  lineHeight: 30,
  fontWeight: "500",
})

const $skillBlock: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 44,
})

const $skillTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 27,
  lineHeight: 34,
  fontWeight: "800",
  marginBottom: 8,
})

const $skillLabels: ThemedStyle<ViewStyle> = () => ({
  minHeight: 88,
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 18,
  marginBottom: 12,
})

const $skillLabelGroup: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "flex-start",
})

const $rightLabelGroup: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})

const $emoji: ThemedStyle<TextStyle> = () => ({
  fontSize: 22,
  lineHeight: 28,
  marginBottom: 4,
})

const $skillLabel: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 22,
  lineHeight: 31,
  fontWeight: "500",
})

const $rightLabel: ThemedStyle<TextStyle> = () => ({
  textAlign: "right",
})

const $sliderWrap: ThemedStyle<ViewStyle> = () => ({
  minHeight: 50,
  justifyContent: "center",
})

const $tickRow: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 2,
  right: 2,
  height: 50,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $tick: ThemedStyle<ViewStyle> = () => ({
  width: 12,
  height: 12,
  borderRadius: 6,
})

const $slider: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  height: 50,
})

const $footer: ThemedStyle<ViewStyle> = (theme) => ({
  paddingHorizontal: 20,
  paddingTop: 14,
  paddingBottom: 14,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: theme.colors.separator,
  backgroundColor: theme.colors.background,
})

const $saveButton: ThemedStyle<ViewStyle> = (theme) => ({
  minHeight: 64,
  borderRadius: 14,
  borderWidth: 0,
  backgroundColor: theme.colors.volleyColors.volleyyellow,
  marginBottom: 10,
})

const $saveButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.blackHard,
  fontSize: 24,
  lineHeight: 30,
  fontWeight: "800",
})

const $cancelButton: ThemedStyle<ViewStyle> = () => ({
  minHeight: 52,
  borderWidth: 0,
  backgroundColor: "transparent",
})

const $cancelButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.volleyColors.volleyyellow,
  fontSize: 21,
  lineHeight: 27,
  fontWeight: "700",
})

export default PlayerSkillRatingModal
