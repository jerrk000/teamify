import React, { useState } from 'react';
import { View,type ViewStyle, type TextStyle, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { PlayerList } from '@/components/ui/PlayerList';
import { SearchField } from '@/components/SearchField';

type Item = {
    id: string;
    name: string;
  };

const FriendsListScreen = () => {

  const {
    themed, theme, themeContext,
  } = useAppTheme()

  const placeholderAvatar = require("../../../../assets/avatar-placeholder.png") //TODO change this to an actual placeholder avatar, this one is just quickly from the internet.

  // Sample data for the friends list
  const friends = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
    { id: '5', name: 'Charlie Davis' },
  ];


  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Item[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = friends.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredData(friends);
  };

  return (
    <SafeAreaView style={themed($container)}>
      <Text style={themed($header)}>Friends List</Text>
      <View style={themed($searchContainer)}>
        <SearchField
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search Friend…"
          onClear={clearSearch}
          onSubmit={(q) => handleSearch(q)}
          testID="friend-search"
          inputTestID="friend-search-input"
          clearButtonTestID="friend-search-clear"
          containerStyle={(theme) => ({ width: "100%",})}
        />
      </View>
      <PlayerList
        data={filteredData.length > 0 ? filteredData : friends}
        themed={themed}
        isSelected={(item) => false} //TODO implement selected state if we want to allow selecting friends from this screen. But  currently not planned
        favoriteDisabled={false} //TODO maybe only allow favoriting from a details screen?
        onPressRow={(item) => console.log("pressed row", item.id)}
        onPressFavorite={(item) => console.log("fav", item.id)}
        onPressMore={(item) => console.log("more", item.id)}
        placeholderAvatarSource={placeholderAvatar}
      />

    </SafeAreaView>
  );
};

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  backgroundColor: theme.colors.background,
});

const $searchContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "stretch",
  //paddingHorizontal: 10,
  marginBottom: 16,
  marginTop: 16,
});

const $header: ThemedStyle<TextStyle> = (theme) => ({ //TODO multiple $header, also multiple $container. Maybe single source of truth?
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 5,
  color: theme.colors.text, 
});

const $friendItem: ThemedStyle<ViewStyle> = (theme) => ({
  padding: 16,
  backgroundColor: theme.colors.itemBackground, // TODO change this and add this to the theme
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.palette.neutral400, // TODO change this and add this to the theme
});

const $friendName: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
});

export default FriendsListScreen;