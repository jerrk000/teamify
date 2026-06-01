import { useState } from "react"
import { View, type TextStyle, type ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { SearchField } from "@/components/SearchField"
import { Text } from "@/components/Text"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { PlayerList } from "@/components/ui/PlayerList"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

type Item = {
  id: string
  name: string
}

const friends = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Brown" },
  { id: "5", name: "Charlie Davis" },
]

const FriendsListScreen = () => {
  const router = useRouter()
  const { themed, theme } = useAppTheme()

  const placeholderAvatar = require("../../../../assets/avatar_placeholder.png") //TODO change this to an actual placeholder avatar, this one is just quickly from the internet.

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredData, setFilteredData] = useState<Item[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = friends.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredData(filtered)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilteredData(friends)
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

      <PlayerList
        data={filteredData.length > 0 ? filteredData : friends}
        themed={themed}
        isSelected={() => false} //TODO implement selected state if we want to allow selecting friends from this screen. But currently not planned
        favoriteDisabled={false} //TODO maybe only allow favoriting from a details screen?
        onPressRow={(item) => console.log("pressed row", item.id)}
        onPressFavorite={(item) => console.log("fav", item.id)}
        onPressMore={(item) => console.log("more", item.id)}
        placeholderAvatarSource={placeholderAvatar}
      />
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

const $searchField: ViewStyle = {
  width: "100%",
}

const $header: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginVertical: 5,
  color: theme.colors.text,
})

export default FriendsListScreen
