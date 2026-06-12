import { useState } from "react"
import { StyleSheet, View } from "react-native"
import { RadarChart } from "@salmonco/react-native-radar-chart"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import PlayerSkillRatingModal, { PlayerSkillRatings } from "@/components/ui/PlayerSkillRatingModal"

// It sucks that I have to use a radar chart from a random person
// TODO maybe implement radar chart yourself?

const CHART_ORANGE = "#FF9432"
const CHART_ORANGE_LIGHT = "#FFE8D3"
const CHART_ORANGE_PALE = "#FFF8F1"
const CHART_ORANGE_STROKE = "#ff9532"
const CHART_SALMON = "salmon"
const TEXT_DARK = "#433D3A"
const VALUE_BACKGROUND = "#F4F2F1"

type RadarDataItem = {
  label: string
  value: number
}

const SKILL_LABELS: Record<keyof PlayerSkillRatings, string> = {
  technique: "Technique",
  fitness: "Fitness",
  tactics: "Tactics",
  mentality: "Mentality",
  passing: "Passing",
  shooting: "Shooting",
}

const INITIAL_SKILL_RATINGS: PlayerSkillRatings = {
  fitness: 5,
  mentality: 5,
  passing: 5,
  shooting: 5,
  tactics: 5,
  technique: 5,
}

const buildRadarData = (ratings: PlayerSkillRatings): RadarDataItem[] =>
  Object.entries(SKILL_LABELS).map(([skill, label]) => ({
    label,
    value: ratings[skill as keyof PlayerSkillRatings] * 10,
  }))

const PlayerStatsScreen = () => {
  const [skillRatingModalVisible, setSkillRatingModalVisible] = useState(false)
  const [skillRatings, setSkillRatings] = useState<PlayerSkillRatings>(INITIAL_SKILL_RATINGS)

  const saveSkillRatings = (ratings: PlayerSkillRatings) => {
    setSkillRatings(ratings)
    setSkillRatingModalVisible(false)
  }

  const data = buildRadarData(skillRatings)

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Stats</Text>
      <RadarChart
        data={data}
        maxValue={100}
        gradientColor={{
          count: 5,
          endColor: CHART_ORANGE_PALE,
          startColor: CHART_ORANGE,
        }}
        stroke={[
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_STROKE,
        ]}
        strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
        strokeOpacity={[1, 1, 1, 1, 0.13]}
        labelColor={TEXT_DARK}
        dataFillColor={CHART_ORANGE}
        dataFillOpacity={0.8}
        dataStroke={CHART_SALMON}
        dataStrokeWidth={2}
      />

      <View style={styles.skillRatingSection}>
        <Button
          text="Rate Player Skills"
          onPress={() => setSkillRatingModalVisible(true)}
          style={styles.actionButton}
        />
        <View style={styles.skillRatingValues}>
          {Object.entries(SKILL_LABELS).map(([skill, label]) => (
            <Text key={skill} style={styles.skillRatingText}>
              {label}: {skillRatings[skill as keyof PlayerSkillRatings]}
            </Text>
          ))}
        </View>
      </View>

      <PlayerSkillRatingModal
        visible={skillRatingModalVisible}
        ratings={skillRatings}
        onSave={saveSkillRatings}
        onCancel={() => setSkillRatingModalVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    minWidth: 180,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  skillRatingSection: {
    alignItems: "stretch",
    marginTop: 16,
    width: "80%",
  },
  skillRatingText: {
    color: TEXT_DARK,
    fontSize: 16,
    lineHeight: 22,
    textTransform: "capitalize",
  },
  skillRatingValues: {
    backgroundColor: VALUE_BACKGROUND,
    borderRadius: 8,
    marginTop: 10,
    padding: 12,
  },
})

export default PlayerStatsScreen
