import React from 'react';
import { View,type ViewStyle, type TextStyle, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';

type Item = {
    id: string;
    name: string;
  };

const FriendsListScreen = () => {

  const {
    themed, theme, themeContext,
  } = useAppTheme()

  // Sample data for the friends list
  const friends = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
    { id: '5', name: 'Charlie Davis' },
  ];

  // Render each friend item
  const renderFriendItem = ({ item }: { item: Item }) => (
    <View style={themed($friendItem)}>
      <Text style={themed($friendName)}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={themed($container)}>
      <Text style={themed($title)}>Friends List</Text>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
});

const $title: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
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