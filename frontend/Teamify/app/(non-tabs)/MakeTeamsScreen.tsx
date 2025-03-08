import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useListStore } from "../../store/useListStore";
import BackgroundPicture from '@/components/ImageBackground';

type Item = {
  id: string;
  name: string;
};

const SavedItemsScreen = () => {
  const items = useListStore((state) => state.items); // Get items from Zustand
  const setItems = useListStore((state) => state.setItems); // Get setItems function from Zustand
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

  // Split the items into two groups
  const half = Math.ceil(items.length / 2);
  const firstGroup = items.slice(0, half);
  const secondGroup = items.slice(half);

  // Function to randomize items
  const randomizeItems = () => {
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffledItems); // Update the Zustand store with shuffled items
  };


  const renderItemUpper = ({ item }: { item: Item }) => ( //crimson red
    <View style={[styles.playerlistitemcontainer, {borderColor: "#DC143C"}]}> 
      <Text style={[styles.playerlistitemtext, {color: "#DC143C"}]}>{item.name}</Text> 
    </View>
  );

  // Render item for FlatList
  const renderItemLower = ({ item }: { item: Item }) => (
    <View style={styles.playerlistitemcontainer}>
      <Text style={styles.playerlistitemtext}>{item.name}</Text>
    </View>
  );

  return (
    <BackgroundPicture>
      <View style={styles.container}>
        {/* Upper Group */}
        <View style={styles.teamContainer}>
          <Text style={[styles.teamTitle, {color: "#DC143C"}]}>Team</Text>
          <FlatList
            data={firstGroup}
            renderItem={renderItemUpper}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.playernameflatList}
          />
        </View>

        {/* Randomize Button */}
        <View style={styles.simplebuttonContainer}>
          <Button title="Randomize Teams" onPress={randomizeItems} />
        </View>

        {/* Bottom Group */}
        <View style={styles.teamContainer}>
          <Text style={[styles.teamTitle, {color: "#3498db"}]}>Team</Text>
          <FlatList
            data={secondGroup}
            renderItem={renderItemLower}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.playernameflatList}
          />
        </View>

        {/* Choose Winner Button */}
        <View style={styles.simplebuttonContainer}>
          <Button title="Choose winner" onPress={() => setShowAdditionalButtons(!showAdditionalButtons)} />
        </View>

        {/* Overlay with Additional Buttons */}
        {showAdditionalButtons ? (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.overlayBackground}
              activeOpacity={1}
              onPress={() => setShowAdditionalButtons(false)}
            >
              {/* Empty TouchableOpacity to close the overlay when tapping outside buttons */}
            </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'rgba(220, 20, 60, 0.5)'}]}
                onPress={() => alert('Team Red will be saved as winner')}
              >
                <Text style={styles.buttonText}>Winner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => alert('Team Blue will be saved as winner')}
              >
                <Text style={styles.buttonText}>Winner</Text>
              </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </BackgroundPicture>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  playernameflatList: {
    alignItems: "center", // Ensures items are centered
  },
  teamContainer: {
    flex: 1,
    marginBottom: 16,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlignVertical: "center",
    textAlign: "center"
  },
  simplebuttonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  playerlistitemcontainer: {
    width: 100,
    height: 50,
    backgroundColor: "#f9f9f9", // Light background
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Border thickness
    borderColor: "#3498db", // Blue border color
    borderRadius: 10, // Rounded corners
  },
  playerlistitemtext: {
    fontWeight: "bold",
    color: "#3498db", // Blue
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  button: {
    flex: 1,
    width: '70%',
    height: '40%',
    padding: 15,
    backgroundColor: 'rgba(0, 123, 255, 0.5)', //50% transparent blue, instead of //"#3498db",
    borderRadius: 5,
    marginVertical: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default SavedItemsScreen;

  

