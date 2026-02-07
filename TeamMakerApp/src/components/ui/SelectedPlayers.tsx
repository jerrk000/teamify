import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Player } from '@/types/PlayerType';

interface SelectedPlayersProps {
  selectedPlayers: Player[];
  onClickPlayer?: (player: Player) => void;
  containerStyle?: ViewStyle;
  selectedItemStyle?: ViewStyle;
  textStyle?: TextStyle;
  disableTouch?: boolean;
  isCentered?: boolean;
}

const SelectedPlayers: React.FC<SelectedPlayersProps> = ({ 
  selectedPlayers, 
  onClickPlayer = () => {},
  containerStyle, 
  selectedItemStyle,
  textStyle,
  disableTouch = false,
  isCentered = false
  }) => {
  return (
    <View style={[styles.selectedPlayersContainer, containerStyle]}>
      <FlatList
        data={selectedPlayers}
        keyExtractor={(player) => player.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onClickPlayer(item)} disabled={disableTouch}>
            <View style={[styles.selectedItem, selectedItemStyle]}>
              <Text style={[styles.itemtext, textStyle]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              {!disableTouch ? (<Text style={styles.cross}>❌</Text>) : null}
            </View>
          </TouchableOpacity>
        )}
        numColumns={3}
        contentContainerStyle = {isCentered ? {alignItems: 'center'} : {alignItems: 'stretch'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectedPlayersContainer: {
    marginBottom: 10,
  },
  selectedItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    margin: 5,
    borderWidth: 2, // Border thickness
    borderColor: "#3498db", // Blue border color
    borderRadius: 10, // Rounded corners
  },
  itemtext: {
    fontWeight: "bold",
    color: "#3498db", // Blue
    maxWidth: 90,
  },
  cross: {
    fontSize: 16,
    color: 'red',
  },
});

export default SelectedPlayers;
