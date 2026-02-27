import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, type TextStyle, type ViewStyle } from "react-native"
import { useListStore } from "../../../store/useListStore"
import BackgroundPicture from "@/components/ImageBackground"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import {
  GRID_COLUMNS_DEFAULT,
  TeamGridPlayer,
  TeamPlayerGrid,
} from "@/components/ui/TeamPlayerGrid"

type PlayerWithAvatar = TeamGridPlayer

type TeamKey = "teamA" | "teamB"

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

  const placeholderAvatar = require("../../../../assets/avatar-placeholder.png")

  useEffect(() => {
    setTeams(splitIntoTeams(items))
  }, [items])

  const swapPlayersInTeam = (team: TeamKey, fromIndex: number, toIndex: number) => {
    setTeams((prev) => {
      const nextPlayers = [...prev[team]]
      ;[nextPlayers[fromIndex], nextPlayers[toIndex]] = [nextPlayers[toIndex], nextPlayers[fromIndex]]

      return {
        ...prev,
        [team]: nextPlayers,
      }
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
    <BackgroundPicture>
      <View style={themed($container)}>
        <View style={themed($teamContainer)}>
          <Text style={themed($teamTitle)}>Team</Text>
          <TeamPlayerGrid
            players={teams.teamA}
            columns={GRID_COLUMNS_DEFAULT}
            onSwapPlayers={(fromIndex, toIndex) => swapPlayersInTeam("teamA", fromIndex, toIndex)}
            placeholderAvatarSource={placeholderAvatar}
            borderColor={theme.colors.volleyColors.volleyblue}
            themed={themed}
          />
        </View>

        <View style={themed($simplebuttonContainer)}>
          <Button
            text="Randomize Teams"
            onPress={randomizeItems}
            style={[themed($randomizeButton), { backgroundColor: "red" }]}
          />
        </View>

        <View style={themed($teamContainer)}>
          <Text style={[themed($teamTitle), { color: "blue" }]}>Team</Text>
          <TeamPlayerGrid
            players={teams.teamB}
            columns={GRID_COLUMNS_DEFAULT}
            onSwapPlayers={(fromIndex, toIndex) => swapPlayersInTeam("teamB", fromIndex, toIndex)}
            placeholderAvatarSource={placeholderAvatar}
            borderColor={theme.colors.volleyColors.volleyred}
            themed={themed}
          />
        </View>

        {/* Choose Winner Button */}
        <View style={themed($simplebuttonContainer)}>
          <Button
            text="Choose winner"
            onPress={() => setShowAdditionalButtons(!showAdditionalButtons)}
            style={{backgroundColor: "red"}} //TODO this is hardcoded and not pretty
          />
        </View>

        {/* Overlay with Additional Buttons */}
        {showAdditionalButtons ? (
          <View style={themed($overlay)}>
            <TouchableOpacity
              style={themed($overlayBackground)}
              activeOpacity={1}
              onPress={() => setShowAdditionalButtons(false)}
            >
              {/* Empty TouchableOpacity to close the overlay when tapping outside buttons */}
            </TouchableOpacity>
            <TouchableOpacity
                style={[themed($button), {backgroundColor: theme.colors.volleyColors.volleyredTransparent}]} //TODO this is hardcoded
                onPress={() => alert('Team Red will be saved as winner')}
            >
              <Text style={themed($buttonText)}>Winner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={themed($button)}
                onPress={() => alert('Team Blue will be saved as winner')}
            >
              <Text style={themed($buttonText)}>Winner</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </BackgroundPicture>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  alignItems: "center",
})

const $teamContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  width: "100%",
  marginBottom: 16,
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

const $randomizeButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 20, //TODO maybe do not hardcode this and add it to the theme or make it responsive, maybe also add font weight and stuff like that to the theme
  color: theme.colors.text,
});

export default SavedItemsScreen;

  

