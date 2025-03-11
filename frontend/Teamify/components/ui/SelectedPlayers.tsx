import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Player } from '@/types/PlayerType';

interface SelectedPlayersProps {
  selectedPlayers: Player[];
  onRemovePlayer: (player: Player) => void;
  style?: ViewStyle;
}

const SelectedPlayers: React.FC<SelectedPlayersProps> = ({ selectedPlayers, onRemovePlayer, style }) => {
  return (
    <View style={[styles.selectedPlayersContainer, style]}>
      <FlatList
        data={selectedPlayers}
        keyExtractor={(player) => player.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onRemovePlayer(item)}>
            <View style={styles.selectedItem}>
              <Text style={styles.itemtext} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text style={styles.cross}>❌</Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={3}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
