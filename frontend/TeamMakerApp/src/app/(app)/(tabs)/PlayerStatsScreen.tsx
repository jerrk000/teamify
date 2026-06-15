import { useCallback, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { RadarChart } from "@salmonco/react-native-radar-chart"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import PlayerSkillRatingModal, { PlayerSkillRatings } from "@/components/ui/PlayerSkillRatingModal"
import { api } from "@/services/api"
import type { ApiPlayerStats, ApiPlayerStatsUpdate } from "@/services/api/types"
import { useAuthStore } from "@/store/useAuthStore"

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
  serve: "Serve",
  receive: "Receive",
  set: "Set",
  hit: "Hit",
  block: "Block",
  effort: "Effort",
  mentality: "Mentality",
}

const INITIAL_SKILL_RATINGS: PlayerSkillRatings = {
  serve: 5,
  receive: 5,
  set: 5,
  hit: 5,
  block: 5,
  effort: 5,
  mentality: 5,
}

const buildRadarData = (ratings: PlayerSkillRatings): RadarDataItem[] =>
  Object.entries(SKILL_LABELS).map(([skill, label]) => ({
    label,
    value: ratings[skill as keyof PlayerSkillRatings] * 10,
  }))

const ratingsFromStats = (stats: ApiPlayerStats | null): PlayerSkillRatings => ({
  serve: stats?.beachvolleyball_serve ?? INITIAL_SKILL_RATINGS.serve,
  receive: stats?.beachvolleyball_receive ?? INITIAL_SKILL_RATINGS.receive,
  set: stats?.beachvolleyball_set ?? INITIAL_SKILL_RATINGS.set,
  hit: stats?.beachvolleyball_hit ?? INITIAL_SKILL_RATINGS.hit,
  block: stats?.beachvolleyball_block ?? INITIAL_SKILL_RATINGS.block,
  effort: stats?.beachvolleyball_effort ?? INITIAL_SKILL_RATINGS.effort,
  mentality: stats?.beachvolleyball_mentality ?? INITIAL_SKILL_RATINGS.mentality,
})

const statsFromRatings = (
  ratings: PlayerSkillRatings,
  currentStats: ApiPlayerStats | null,
): ApiPlayerStatsUpdate => ({
  beachvolleyball_serve: ratings.serve,
  beachvolleyball_receive: ratings.receive,
  beachvolleyball_set: ratings.set,
  beachvolleyball_hit: ratings.hit,
  beachvolleyball_block: ratings.block,
  beachvolleyball_effort: ratings.effort,
  beachvolleyball_mentality: ratings.mentality,
  beachvolleyball_quick: currentStats?.beachvolleyball_quick ?? 5,
  football_quick: currentStats?.football_quick ?? 5,
  general_quick: currentStats?.general_quick ?? 5,
})

const PlayerStatsScreen = () => {
  const authPlayerId = useAuthStore((state) => state.authPlayerId)
  const [skillRatingModalVisible, setSkillRatingModalVisible] = useState(false)
  const [skillRatings, setSkillRatings] = useState<PlayerSkillRatings>(INITIAL_SKILL_RATINGS)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isSavingStats, setIsSavingStats] = useState(false)
  const [statsMessage, setStatsMessage] = useState("")
  const [currentStats, setCurrentStats] = useState<ApiPlayerStats | null>(null)

  const loadStats = useCallback(async () => {
    if (!authPlayerId) {
      setStatsMessage("Log in again so the app knows which player to update.")
      return
    }

    setIsLoadingStats(true)
    setStatsMessage("")

    const result = await api.getPlayerStats(authPlayerId)
    setIsLoadingStats(false)

    if (result.kind !== "ok") {
      setStatsMessage("Could not load your player stats.")
      return
    }

    setCurrentStats(result.stats)
    setSkillRatings(ratingsFromStats(result.stats))
  }, [authPlayerId])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  const saveSkillRatings = async (ratings: PlayerSkillRatings) => {
    if (!authPlayerId) {
      setStatsMessage("Log in again so the app knows which player to update.")
      return
    }

    setIsSavingStats(true)
    setStatsMessage("")

    const result = await api.updatePlayerStats(authPlayerId, statsFromRatings(ratings, currentStats))
    setIsSavingStats(false)

    if (result.kind !== "ok") {
      setStatsMessage("Could not save your player stats.")
      return
    }

    setCurrentStats(result.stats)
    setSkillRatings(ratingsFromStats(result.stats))
    setSkillRatingModalVisible(false)
    setStatsMessage("Stats saved.")
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
        {isLoadingStats ? <Text style={styles.statusText}>Loading stats...</Text> : null}
        {statsMessage ? <Text style={styles.statusText}>{statsMessage}</Text> : null}
        <Button
          text={isSavingStats ? "Saving..." : "Rate Player Skills"}
          onPress={() => setSkillRatingModalVisible(true)}
          disabled={isLoadingStats || isSavingStats}
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
        onSave={(ratings) => void saveSkillRatings(ratings)}
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
  statusText: {
    color: TEXT_DARK,
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
})

export default PlayerStatsScreen
