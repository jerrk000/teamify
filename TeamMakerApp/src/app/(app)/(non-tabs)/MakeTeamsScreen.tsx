import React, { useEffect, useRef, useState } from "react"
import { Text, TouchableOpacity, View, type TextStyle, type ViewStyle } from "react-native"
import { useListStore } from "../../../store/useListStore"
import BackgroundPicture from "@/components/ImageBackground"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import {
  CombinedTeamsGrid,
  //GRID_COLUMNS_DEFAULT, //OLD
  type PlayerPointer,
  type TeamId,
  type TeamGridPlayer,
} from "@/components/ui/TeamPlayerGrid"

// Example “diamond” layout for 4 slots (normalized inside the team area)
const DIAMOND_4 = [
  { x: 0.5, y: 0.0 }, // top center
  { x: 1.0, y: 0.5 }, // right center
  { x: 0.5, y: 1.0 }, // bottom center
  { x: 0.0, y: 0.5 }, // left center
] as const

type PlayerWithAvatar = TeamGridPlayer

type TeamSplit = {
  teamA: PlayerWithAvatar[]
  teamB: PlayerWithAvatar[]
}

const splitIntoTeams = (allPlayers: PlayerWithAvatar[]): TeamSplit => {
  const half = Math.ceil(allPlayers.length / 2)

  return {
    teamA: allPlayers.slice(0, half),
    teamB: allPlayers.slice(half),
  }
}

const SavedItemsScreen = () => {
  const { themed, theme } = useAppTheme()

  const items = useListStore((state) => state.items as PlayerWithAvatar[])
  const setItems = useListStore((state) => state.setItems)
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false)
  const [teams, setTeams] = useState<TeamSplit>({ teamA: [], teamB: [] })

  // When we persist a local drag/drop change into the global store, the `items`
  // subscription will fire and this screen's effect would re-split the list in half,
  // undoing cross-team transfers. This flag prevents that feedback loop.
  const internalStoreUpdateRef = useRef(false)

  const placeholderAvatar = require("../../../../assets/avatar-placeholder.png")

  useEffect(() => {
    if (internalStoreUpdateRef.current) {
      internalStoreUpdateRef.current = false
      return
    }

    setTeams(splitIntoTeams(items))
  }, [items])

  const syncStoreFromTeams = (nextTeams: TeamSplit) => {
    internalStoreUpdateRef.current = true
    setItems([...nextTeams.teamA, ...nextTeams.teamB])
  }

  const swapAcrossTeams = (from: PlayerPointer, to: PlayerPointer) => {
    setTeams((prev) => {
      const next: TeamSplit = { teamA: [...prev.teamA], teamB: [...prev.teamB] }

      const fromArr = from.team === "teamA" ? next.teamA : next.teamB
      const toArr = to.team === "teamA" ? next.teamA : next.teamB

      const tmp = fromArr[from.index]
      fromArr[from.index] = toArr[to.index]
      toArr[to.index] = tmp

      syncStoreFromTeams(next)
      return next
    })
  }

  const moveIntoTeam = (from: PlayerPointer, toTeam: TeamId) => {
    setTeams((prev) => {
      if (from.team === toTeam) return prev

      const next: TeamSplit = { teamA: [...prev.teamA], teamB: [...prev.teamB] }
      const fromArr = from.team === "teamA" ? next.teamA : next.teamB
      const toArr = toTeam === "teamA" ? next.teamA : next.teamB

      const [moved] = fromArr.splice(from.index, 1)
      if (!moved) return prev

      // current behavior: append to the end of the target team.
      toArr.push(moved)

      syncStoreFromTeams(next)
      return next
    })
  }

  const randomizeItems = () => {
    const allPlayers = [...teams.teamA, ...teams.teamB]
    const shuffled = allPlayers.sort(() => Math.random() - 0.5)
    const nextTeams = splitIntoTeams(shuffled)

    setTeams(nextTeams)
    setItems(shuffled)
  }

  return (
    <View style={themed($outerContainer)}>
      <BackgroundPicture
        source={require('../../../../assets/images/volleyball_court.png')}
        width="90%"
        height="100%"
        horizontalPosition="left"
        resizeMode="stretch"
        contentFullWidth
      >

        <View style={themed($container)}>
          {/*<Text style={themed($teamTitle)}>Teams</Text>*/}

          <CombinedTeamsGrid
            teamA={teams.teamA}
            teamB={teams.teamB}
            layoutA={DIAMOND_4}
            layoutB={DIAMOND_4}
            onSwapAcrossTeams={swapAcrossTeams}
            onMoveIntoTeam={moveIntoTeam}
            placeholderAvatarSource={placeholderAvatar}
            teamABorderColor={theme.colors.volleyColors.volleyblue}
            teamBBorderColor={theme.colors.volleyColors.volleyred}
            themed={themed}
          />
          {/* Randomize Teams Button 
          <View style={themed($simplebuttonContainer)}>
            <Button
              text="Randomize Teams"
              onPress={randomizeItems}
              style={[themed($randomizeButton), { backgroundColor: "red" }]}
            />
          </View>

          <View style={themed($simplebuttonContainer)}>
            <Button
              text="Choose winner"
              onPress={() => setShowAdditionalButtons(!showAdditionalButtons)}
              style={{ backgroundColor: "red" }} // TODO this is hardcoded
            />
          </View>
          */}

          {/* Overlay with Additional Buttons */}
          {showAdditionalButtons ? (
            <View style={themed($overlay)}>
              <TouchableOpacity
                style={themed($overlayBackground)}
                activeOpacity={1}
                onPress={() => setShowAdditionalButtons(false)}
              />

              <TouchableOpacity
                style={[themed($button), { backgroundColor: theme.colors.volleyColors.volleyredTransparent }]}
                onPress={() => alert("Team Red will be saved as winner")}
              >
                <Text style={themed($buttonText)}>Winner</Text>
              </TouchableOpacity>

              <TouchableOpacity style={themed($button)} onPress={() => alert("Team Blue will be saved as winner")}>
                <Text style={themed($buttonText)}>Winner</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </BackgroundPicture>
    </View>
  )
}

const $outerContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.palette.neutral100, //TODO make it an official color of theme, maybe theme.colors.backgroundLight
})

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  alignItems: "center",
})

const $teamTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 10,
  textAlignVertical: "center",
  textAlign: "center",
  color: theme.colors.text,
})

const $simplebuttonContainer: ThemedStyle<ViewStyle> = () => ({
  marginTop: 16,
  marginBottom: 16,
})

const $overlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
})

const $overlayBackground: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.palette.overlaymodal,
})

const $button: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  width: "70%",
  height: "40%",
  padding: 15,
  backgroundColor: theme.colors.volleyColors.volleyblueTransparent,
  borderRadius: 5,
  marginVertical: 60,
  alignItems: "center",
  justifyContent: "center",
})

const $buttonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontSize: 20,
})

const $randomizeButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.buttonBackground,
  color: theme.colors.text,
})

export default SavedItemsScreen
