import { useCallback, useEffect, useMemo, useState } from "react"
import { View, type TextStyle, type ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { SearchField } from "@/components/SearchField"
import { Text } from "@/components/Text"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { PlayerList } from "@/components/ui/PlayerList"
import { api } from "@/services/api"
import { useAuthStore } from "@/store/useAuthStore"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

type Item = {
  id: string
  name: string
}

const FriendsListScreen = () => {
  const router = useRouter()
  const { themed, theme } = useAppTheme()
  const authPlayerId = useAuthStore((state) => state.authPlayerId)

  const placeholderAvatar = require("../../../../assets/avatar_placeholder.png") //TODO change this to an actual placeholder avatar, this one is just quickly from the internet.

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [friends, setFriends] = useState<Item[]>([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(false)
  const [friendsError, setFriendsError] = useState("")

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) return friends

    return friends.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
  }, [friends, searchQuery])

  const loadFriends = useCallback(async () => {
    if (!authPlayerId) {
      setFriends([])
      setFriendsError("Log in again so the app knows which player to load.")
      return
    }

    setIsLoadingFriends(true)
    setFriendsError("")

    const result = await api.getFriends(authPlayerId)
    setIsLoadingFriends(false)

    if (result.kind !== "ok") {
      setFriends([])
      setFriendsError("Could not load your friends. Check your backend connection.")
      return
    }

    setFriends(result.friends.map((friend) => ({ id: String(friend.id), name: friend.name })))
  }, [authPlayerId])

  useEffect(() => {
    void loadFriends()
  }, [loadFriends])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const openFriendLink = () => {
    router.push("/FriendLinkScreen" as never)
  }

  const openAddFriends = () => {
    router.push("/AddFriendScreen" as never)
  }

  return (
    <SafeAreaView style={themed($container)}>
      <Text style={themed($header)}>Friends List</Text>

      <View style={themed($actionsContainer)}>
        <Button
          text="Share your QR-Code "
          preset="filled"
          onPress={openFriendLink}
          RightAccessory={({ style }) => (
            <IconSymbol name="qr-code-2" size={22} color={theme.colors.text} style={style} />
          )}
        />
        <Button text="Add friends " 
          preset="filled" 
          onPress={openAddFriends} 
          RightAccessory={({ style }) => (
            <IconSymbol iconSet="material" name="person.badge.plus" size={22} color={theme.colors.text} style={style} />
          )}
        />
      </View>

      <View style={themed($searchContainer)}>
        <SearchField
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search Friend..."
          onClear={clearSearch}
          onSubmit={(q) => handleSearch(q)}
          testID="friend-search"
          inputTestID="friend-search-input"
          clearButtonTestID="friend-search-clear"
          containerStyle={$searchField}
        />
      </View>

      {isLoadingFriends ? <Text text="Loading friends..." style={themed($stateText)} /> : null}

      {friendsError ? (
        <View style={themed($stateContainer)}>
          <Text text={friendsError} style={themed($stateText)} />
          <Button text="Try again" preset="filled" onPress={() => void loadFriends()} />
        </View>
      ) : null}

      {!isLoadingFriends && !friendsError && filteredData.length === 0 ? (
        <Text
          text={searchQuery ? "No friends match your search." : "No friends yet."}
          style={themed($stateText)}
        />
      ) : null}

      {!friendsError && filteredData.length > 0 ? (
        <PlayerList
          data={filteredData}
          themed={themed}
          isSelected={() => false} //TODO implement selected state if we want to allow selecting friends from this screen. But currently not planned
          favoriteDisabled={false} //TODO maybe only allow favoriting from a details screen?
          onPressRow={(item) => console.log("pressed row", item.id)}
          onPressFavorite={(item) => console.log("fav", item.id)}
          onPressMore={(item) => console.log("more", item.id)}
          placeholderAvatarSource={placeholderAvatar}
        />
      ) : null}
    </SafeAreaView>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  backgroundColor: theme.colors.background,
})

const $actionsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.sm,
  marginTop: 16,
})

const $searchContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "stretch",
  marginBottom: 16,
  marginTop: 16,
})

const $searchField: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
})

const $header: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginVertical: 5,
  color: theme.colors.text,
})

const $stateContainer: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.sm,
})

const $stateText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  marginTop: theme.spacing.md,
  textAlign: "center",
})

export default FriendsListScreen
