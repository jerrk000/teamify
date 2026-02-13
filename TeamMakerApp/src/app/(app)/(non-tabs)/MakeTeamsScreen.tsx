import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useListStore } from "../../../store/useListStore";
import BackgroundPicture from '@/components/ImageBackground';
import SelectedPlayers from '@/components/ui/SelectedPlayers';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
//import { useThemeColor } from '@/hooks/useThemeColor';


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


  const colorScheme = useColorScheme();
  //const background = useThemeColor({ light: 'light', dark: 'dark' }, 'background'); //does not work?
  //const textColor = useThemeColor({ light: 'light', dark: 'dark' }, 'text'); //does not work?


  return (
    <BackgroundPicture>
      <View style={styles.container}>
        
        <View style={styles.teamContainer}>  
          <Text style={[styles.teamTitle, {color: Colors[colorScheme ?? 'light'].volley1}]}>Team</Text>
          <SelectedPlayers 
            selectedPlayers={firstGroup} 
            disableTouch={true} 
            isCentered={true} 
            selectedItemStyle={{backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: Colors[colorScheme ?? 'light'].volley1}}
            textStyle={{color: Colors[colorScheme ?? 'light'].text}}
          />
        </View>
        

        
        <View style={styles.simplebuttonContainer}>
          <Button 
            text="Randomize Teams" 
            onPress={randomizeItems} 
            style={{backgroundColor: Colors[colorScheme ?? 'light'].volley3}} 
          />
        </View>

        
        <View style={styles.teamContainer}>  
          <Text style={[styles.teamTitle, {color: Colors[colorScheme ?? 'light'].volley2}]}>Team</Text>
          <SelectedPlayers 
            selectedPlayers={secondGroup} 
            disableTouch={true} 
            isCentered={true} 
            selectedItemStyle={{backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: Colors[colorScheme ?? 'light'].volley2}}
            textStyle={{color: Colors[colorScheme ?? 'light'].text}}
          />
        </View>

        {/* Choose Winner Button */}
        <View style={styles.simplebuttonContainer}>
          <Button 
            text="Choose winner" 
            onPress={() => setShowAdditionalButtons(!showAdditionalButtons)} 
            style={{backgroundColor: Colors[colorScheme ?? 'light'].volley3}}
          />
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
  teamContainer: {
    flex: 1,
    marginBottom: 16,
  },
  teamTitle: {
    fontSize: 24,
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

  

