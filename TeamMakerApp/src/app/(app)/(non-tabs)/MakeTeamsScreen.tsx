import React, { useState } from 'react';
import { View, Text, type ViewStyle, type TextStyle, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useListStore } from "../../../store/useListStore";
import BackgroundPicture from '@/components/ImageBackground';
import SelectedPlayers from '@/components/ui/SelectedPlayers';
import { Button } from '@/components/Button';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';


const SavedItemsScreen = () => {
  const {
      themed, theme, themeContext,
    } = useAppTheme()

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

  return (
    <BackgroundPicture>
      <View style={themed($container)}>
        
        <View style={themed($teamContainer)}>  
          <Text style={themed($teamTitle)}>Team</Text>
          <SelectedPlayers 
            selectedPlayers={firstGroup} 
            disableTouch={true} 
            isCentered={true} 
            selectedItemStyle={{ ...themed($selectedItem), borderColor: theme.colors.volleyColors.volleyblue }}
            textStyle={themed($selectedItemText)}
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
          <Text style={[themed($teamTitle), {color: "blue"}]}>Team</Text>
          <SelectedPlayers 
            selectedPlayers={secondGroup} 
            disableTouch={true} 
            isCentered={true} 
            selectedItemStyle={{ ...themed($selectedItem), borderColor: theme.colors.volleyColors.volleyred }}
            textStyle={themed($selectedItemText)}
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
  );
};
  

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  alignItems: "center",
});

const $selectedItem: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  backgroundColor: theme.colors.itemBackground, // TODO change this and add this to the theme
  margin: 5,
  borderWidth: 2, // Border thickness
  borderColor: theme.colors.palette.primary500, // TODO change this and add this to the theme
  borderRadius: 10, // Rounded corners
});

const $selectedItemText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text, 
});

const $teamContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  marginBottom: 16,
});

const $teamTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 8,
  textAlignVertical: "center",
  textAlign: "center"
});


const $simplebuttonContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginTop: 16,
  marginBottom: 16,
});

const $playerlistitemcontainer: ThemedStyle<ViewStyle> = (theme) => ({
  width: 100,
  height: 50,
  backgroundColor: theme.colors.itemBackground, 
  margin: 5,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2, // Border thickness
  borderColor: theme.colors.volleyColors.volleyblue, //was "#3498db", blue border color
  borderRadius: 10, // Rounded corners
});

const $playerlistitemtext: ThemedStyle<TextStyle> = (theme) => ({
  fontWeight: "bold",
  color: theme.colors.volleyColors.volleyblue, // was "#3498db", blue text
});

const $overlay: ThemedStyle<ViewStyle> = (theme) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
});

const $overlayBackground: ThemedStyle<ViewStyle> = (theme) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.palette.overlaymodal, // Semi-transparent black
});

const $button: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  width: '70%',
  height: '40%',
  padding: 15,
  backgroundColor: theme.colors.volleyColors.volleyblueTransparent, //50% transparent blue, instead of //"#3498db". //TODO not in sync with other blue, check colors.ts
  borderRadius: 5,
  marginVertical: 60,
  alignItems: 'center',
  justifyContent: 'center'
});

const $buttonText: ThemedStyle<TextStyle> = (theme) => ({
    color: 'white',
    fontSize: 20,
});

const $randomizeButton: ThemedStyle<ViewStyle> = (theme) => ({ 
  backgroundColor: theme.colors.buttonBackground,
  color: theme.colors.text,
})

const $randomizeButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 20, //TODO maybe do not hardcode this and add it to the theme or make it responsive, maybe also add font weight and stuff like that to the theme
  color: theme.colors.text,
});

export default SavedItemsScreen;

  

