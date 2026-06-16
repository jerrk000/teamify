import { useCallback, useEffect, useState } from "react"
import {
  Image,
  ImageBackground,
  ImageStyle,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { RadarChart } from "@salmonco/react-native-radar-chart"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { IconSymbol } from "@/components/ui/IconSymbol"
import PlayerSkillRatingModal, { PlayerSkillRatings } from "@/components/ui/PlayerSkillRatingModal"
import { SegmentedContentTabs } from "@/components/ui/SegmentedContentTabs"
import { api } from "@/services/api"
import type {
  ApiGameTeamKey,
  ApiPlayerStats,
  ApiPlayerStatsUpdate,
  ApiRecentGame,
} from "@/services/api/types"
import { useAuthStore } from "@/store/useAuthStore"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

// It sucks that I have to use a radar chart from a random person
// TODO maybe implement radar chart yourself?

const CHART_ORANGE = "#FF9432"
const CHART_ORANGE_LIGHT = "#FFE8D3"
const CHART_ORANGE_PALE = "#FFF8F1"
const CHART_ORANGE_STROKE = "#ff9532"
const CHART_SALMON = "salmon"
const VALUE_BACKGROUND = "#F4F2F1"
const PROFILE_HEADER_HEIGHT = 300
const AVATAR_SIZE = 128

type RadarDataItem = {
  label: string
  value: number
}

type ProfileTabKey = "preview" | "games" | "stats"

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

const formatGameType = (gameType: string | null) =>
  (gameType ?? "Game")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const formatGameDate = (endedAt: string | null) => {
  if (!endedAt) return "Unknown date"

  const date = new Date(endedAt)

  if (Number.isNaN(date.getTime())) return "Unknown date"

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })
}

const PlayerStatsScreen = () => {
  const { themed, theme } = useAppTheme()
  const authPlayerId = useAuthStore((state) => state.authPlayerId)
  const authPlayerName = useAuthStore((state) => state.authPlayerName)
  const authEmail = useAuthStore((state) => state.authEmail)
  const [selectedTab, setSelectedTab] = useState<ProfileTabKey>("stats")
  const [skillRatingModalVisible, setSkillRatingModalVisible] = useState(false)
  const [skillRatings, setSkillRatings] = useState<PlayerSkillRatings>(INITIAL_SKILL_RATINGS)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isSavingStats, setIsSavingStats] = useState(false)
  const [statsMessage, setStatsMessage] = useState("")
  const [currentStats, setCurrentStats] = useState<ApiPlayerStats | null>(null)
  const [recentGames, setRecentGames] = useState<ApiRecentGame[]>([])
  const [isLoadingGames, setIsLoadingGames] = useState(false)
  const [gamesMessage, setGamesMessage] = useState("")
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null)

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

  const loadRecentGames = useCallback(async () => {
    if (!authPlayerId) {
      setGamesMessage("Log in again so the app knows which games to show.")
      return
    }

    setIsLoadingGames(true)
    setGamesMessage("")

    const result = await api.getRecentGames(authPlayerId, 10)
    setIsLoadingGames(false)

    if (result.kind !== "ok") {
      setGamesMessage("Could not load your recent games.")
      return
    }

    setRecentGames(result.games)
    setExpandedGameId(result.games[0]?.id ?? null)

    if (result.games.length === 0) {
      setGamesMessage("No games yet.")
    }
  }, [authPlayerId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStats()
  }, [loadStats])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRecentGames()
  }, [loadRecentGames])

  const saveSkillRatings = async (ratings: PlayerSkillRatings) => {
    if (!authPlayerId) {
      setStatsMessage("Log in again so the app knows which player to update.")
      return
    }

    setIsSavingStats(true)
    setStatsMessage("")

    const result = await api.updatePlayerStats(
      authPlayerId,
      statsFromRatings(ratings, currentStats),
    )
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
  const displayName = authPlayerName ?? "Player"
  const username = authEmail ? `@${authEmail.split("@")[0]}` : "@player"
  const placeholderAvatar = theme.isDark
    ? require("../../../../assets/avatar_placeholder_white.png")
    : require("../../../../assets/avatar_placeholder.png")
  const heroBackground = require("../../../../assets/images/volleyball_court_black.png")
  const renderGameTeam = (game: ApiRecentGame, teamKey: ApiGameTeamKey, label: string) => {
    const players = game.teams[teamKey]
    const isWinner = game.winning_team === teamKey

    return (
      <View style={themed($gameTeam)}>
        <View style={themed($gameTeamHeader)}>
          <Text style={themed($gameTeamTitle)}>{label}</Text>
          {isWinner ? <Text style={themed($winnerText)}>Winner</Text> : null}
        </View>
        <Text style={themed($gameTeamPlayers)}>
          {players.map((player) => player.name).join(", ")}
        </Text>
      </View>
    )
  }

  const previewContent = (
    <ScrollView
      style={themed($tabScroll)}
      contentContainerStyle={themed($tabScrollContent)}
      showsVerticalScrollIndicator={false}
    >
      <View style={themed($summaryRow)}>
        <View style={themed($summaryItem)}>
          <Text style={themed($summaryValue)}>{Math.round(authPlayerId ?? 0)}</Text>
          <Text style={themed($summaryLabel)}>Player ID</Text>
        </View>
        <View style={themed($summaryItem)}>
          <Text style={themed($summaryValue)}>
            {Math.round(Object.values(skillRatings).reduce((sum, rating) => sum + rating, 0) / 7)}
          </Text>
          <Text style={themed($summaryLabel)}>Avg. rating</Text>
        </View>
      </View>
    </ScrollView>
  )

  const gamesContent =
    isLoadingGames || recentGames.length > 0 ? (
      <ScrollView
        style={themed($tabScroll)}
        contentContainerStyle={themed($gamesContent)}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themed($sectionTitle)}>Recent Games</Text>
        {isLoadingGames ? <Text style={themed($statusText)}>Loading games...</Text> : null}
        {gamesMessage && recentGames.length > 0 ? (
          <Text style={themed($statusText)}>{gamesMessage}</Text>
        ) : null}

        <View style={themed($gamesList)}>
          {recentGames.map((game) => {
            const isExpanded = expandedGameId === game.id
            const resultLabel = game.result === "won" ? "Won" : "Lost"

            return (
              <Pressable
                key={game.id}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityLabel={`${formatGameType(game.game_type)} on ${formatGameDate(
                  game.ended_at,
                )}. ${resultLabel}. Show teams.`}
                onPress={() => setExpandedGameId(isExpanded ? null : game.id)}
                style={({ pressed }) => [themed($gameCard), pressed && themed($gameCardPressed)]}
              >
                <View style={themed($gameCardHeader)}>
                  <View style={themed($gameTitleGroup)}>
                    <Text style={themed($gameTitle)}>{formatGameType(game.game_type)}</Text>
                    <Text style={themed($gameMeta)}>{formatGameDate(game.ended_at)}</Text>
                  </View>
                  <View
                    style={[
                      themed($resultPill),
                      game.result === "won" ? themed($wonPill) : themed($lostPill),
                    ]}
                  >
                    <Text
                      style={[
                        themed($resultPillText),
                        game.result === "won" ? themed($wonPillText) : themed($lostPillText),
                      ]}
                    >
                      {resultLabel}
                    </Text>
                  </View>
                </View>

                <View style={themed($gameScoreRow)}>
                  <Text style={themed($gameScore)}>
                    {game.team_a_score ?? "-"} : {game.team_b_score ?? "-"}
                  </Text>
                  <IconSymbol
                    size={16}
                    name="chevron.down"
                    color={theme.colors.textDim}
                    iconSet="fontawesome"
                    style={isExpanded ? themed($chevronExpanded) : undefined}
                  />
                </View>

                {isExpanded ? (
                  <View style={themed($teamsWrap)}>
                    {renderGameTeam(game, "team_a", "Team A")}
                    {renderGameTeam(game, "team_b", "Team B")}
                  </View>
                ) : null}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    ) : (
      <View style={themed($emptyContent)}>
        <IconSymbol size={40} name="sportscourt" color={theme.colors.textDim} iconSet="material" />
        <Text style={themed($emptyTitle)}>{gamesMessage || "No games yet"}</Text>
        <Text style={themed($emptyText)}>Finished games will appear here.</Text>
      </View>
    )

  const statsContent = (
    <ScrollView
      style={themed($tabScroll)}
      contentContainerStyle={themed($statsContent)}
      showsVerticalScrollIndicator={false}
    >
      <Text style={themed($sectionTitle)}>Your Stats</Text>
      <View style={themed($chartWrap)}>
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
          labelColor={theme.colors.text}
          dataFillColor={CHART_ORANGE}
          dataFillOpacity={0.8}
          dataStroke={CHART_SALMON}
          dataStrokeWidth={2}
        />
      </View>

      <View style={themed($skillRatingSection)}>
        {isLoadingStats ? <Text style={themed($statusText)}>Loading stats...</Text> : null}
        {statsMessage ? <Text style={themed($statusText)}>{statsMessage}</Text> : null}
        <Button
          text={isSavingStats ? "Saving..." : "Rate Player Skills"}
          onPress={() => setSkillRatingModalVisible(true)}
          disabled={isLoadingStats || isSavingStats}
          style={themed($actionButton)}
        />
        <View style={themed($skillRatingValues)}>
          {Object.entries(SKILL_LABELS).map(([skill, label]) => (
            <View key={skill} style={themed($skillRatingRow)}>
              <Text style={themed($skillRatingText)}>{label}</Text>
              <Text style={themed($skillRatingValue)}>
                {skillRatings[skill as keyof PlayerSkillRatings]}/10
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  return (
    <SafeAreaView style={themed($screen)} edges={["top"]}>
      <View style={themed($profileHeader)}>
        <ImageBackground source={heroBackground} resizeMode="cover" style={themed($heroImage)}>
          <View style={themed($heroTint)} />
          <View style={themed($headerActions)}>
            <View style={themed($walletPill)}>
              <Text style={themed($walletText)}>0.00</Text>
            </View>
            <View style={themed($iconActions)}>
              <IconSymbol
                size={28}
                name="bell"
                color={theme.colors.volleyColors.volleyyellow}
                iconSet="fontawesome6"
              />
              <IconSymbol size={30} name="gear" color="#FFFFFF" iconSet="fontawesome" />
            </View>
          </View>
          <View style={themed($profileIdentity)}>
            <Image
              source={placeholderAvatar}
              style={themed($avatar)}
              accessibilityLabel={`${displayName} profile picture`}
            />
            <Text style={themed($displayName)} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={themed($username)} numberOfLines={1}>
              {username}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <SegmentedContentTabs
        value={selectedTab}
        onChange={setSelectedTab}
        a11yLabelPrefix="Player profile tab"
        style={themed($tabs)}
        contentContainerStyle={themed($tabContent)}
        tabs={[
          { key: "preview", label: "Preview", content: previewContent },
          { key: "games", label: "Games", content: gamesContent },
          { key: "stats", label: "Stats", content: statsContent },
        ]}
      />

      <PlayerSkillRatingModal
        visible={skillRatingModalVisible}
        ratings={skillRatings}
        onSave={(ratings) => void saveSkillRatings(ratings)}
        onCancel={() => setSkillRatingModalVisible(false)}
      />
    </SafeAreaView>
  )
}

const $screen: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $profileHeader: ThemedStyle<ViewStyle> = () => ({
  height: PROFILE_HEADER_HEIGHT,
  width: "100%",
})

const $heroImage: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "space-between",
})

const $heroTint: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.68)",
})

const $headerActions: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingTop: 14,
})

const $walletPill: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.48)",
  borderRadius: 26,
  flexDirection: "row",
  minHeight: 48,
  paddingHorizontal: 22,
})

const $walletText: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "800",
})

const $iconActions: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  gap: 24,
})

const $profileIdentity: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingBottom: 28,
  paddingHorizontal: 20,
})

const $avatar: ThemedStyle<ImageStyle> = (theme) => ({
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: AVATAR_SIZE / 2,
  backgroundColor: theme.colors.surface,
  borderColor: "rgba(255, 255, 255, 0.12)",
  borderWidth: 2,
  marginBottom: 14,
})

const $displayName: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 34,
  fontWeight: "900",
  lineHeight: 40,
  textAlign: "center",
})

const $username: ThemedStyle<TextStyle> = () => ({
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: 18,
  lineHeight: 24,
  marginTop: 2,
  textAlign: "center",
})

const $tabs: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.background,
})

const $tabContent: ThemedStyle<ViewStyle> = () => ({
  paddingTop: 0,
})

const $tabScroll: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $tabScrollContent: ThemedStyle<ViewStyle> = () => ({
  padding: 20,
  paddingBottom: 116,
})

const $statsContent: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  padding: 20,
  paddingBottom: 116,
})

const $gamesContent: ThemedStyle<ViewStyle> = () => ({
  padding: 20,
  paddingBottom: 116,
})

const $sectionTitle: ThemedStyle<TextStyle> = (theme) => ({
  alignSelf: "flex-start",
  color: theme.colors.text,
  fontSize: 28,
  fontWeight: "900",
  lineHeight: 34,
  marginBottom: 10,
})

const $chartWrap: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  minHeight: 280,
  width: "100%",
})

const $skillRatingSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "stretch",
  marginTop: 16,
  width: "100%",
})

const $actionButton: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "center",
  minWidth: 180,
})

const $statusText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 14,
  marginBottom: 8,
  textAlign: "center",
})

const $skillRatingValues: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.isDark ? theme.colors.surface : VALUE_BACKGROUND,
  borderRadius: 8,
  gap: 10,
  marginTop: 14,
  padding: 14,
})

const $skillRatingRow: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
})

const $skillRatingText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 16,
  lineHeight: 22,
  textTransform: "capitalize",
})

const $skillRatingValue: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: "800",
  lineHeight: 22,
})

const $summaryRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  gap: 12,
})

const $summaryItem: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: 8,
  flex: 1,
  padding: 16,
})

const $summaryValue: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 28,
  fontWeight: "900",
  lineHeight: 34,
})

const $summaryLabel: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 14,
  lineHeight: 20,
  marginTop: 4,
})

const $gamesList: ThemedStyle<ViewStyle> = () => ({
  gap: 12,
  width: "100%",
})

const $gameCard: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  borderRadius: 8,
  borderWidth: 1,
  padding: 14,
})

const $gameCardPressed: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.surfacePressed,
})

const $gameCardHeader: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-start",
  flexDirection: "row",
  gap: 12,
  justifyContent: "space-between",
})

const $gameTitleGroup: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
})

const $gameTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 18,
  fontWeight: "800",
  lineHeight: 24,
})

const $gameMeta: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 13,
  lineHeight: 18,
  marginTop: 2,
})

const $resultPill: ThemedStyle<ViewStyle> = () => ({
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
})

const $wonPill: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.green100,
})

const $lostPill: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.errorBackground,
})

const $resultPillText: ThemedStyle<TextStyle> = () => ({
  fontSize: 13,
  fontWeight: "800",
  lineHeight: 16,
})

const $wonPillText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.green500,
})

const $lostPillText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.error,
})

const $gameScoreRow: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
})

const $gameScore: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 26,
  fontWeight: "900",
  lineHeight: 32,
})

const $chevronExpanded: ThemedStyle<TextStyle> = () => ({
  transform: [{ rotate: "180deg" }],
})

const $teamsWrap: ThemedStyle<ViewStyle> = (theme) => ({
  borderTopColor: theme.colors.separator,
  borderTopWidth: 1,
  gap: 12,
  marginTop: 14,
  paddingTop: 14,
})

const $gameTeam: ThemedStyle<ViewStyle> = () => ({
  gap: 4,
})

const $gameTeamHeader: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flexDirection: "row",
  gap: 8,
})

const $gameTeamTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 15,
  fontWeight: "800",
  lineHeight: 20,
})

const $winnerText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.volleyColors.volleyyellow,
  fontSize: 12,
  fontWeight: "800",
  lineHeight: 16,
})

const $gameTeamPlayers: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 15,
  lineHeight: 21,
})

const $emptyContent: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  padding: 32,
})

const $emptyTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 22,
  fontWeight: "800",
  lineHeight: 28,
  marginTop: 16,
  textAlign: "center",
})

const $emptyText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 16,
  lineHeight: 22,
  marginTop: 6,
  textAlign: "center",
})

export default PlayerStatsScreen
