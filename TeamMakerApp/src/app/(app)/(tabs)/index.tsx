import React, {useState, useEffect} from 'react';
import { View, type ViewStyle, TextInput, FlatList, Text, TouchableOpacity, Keyboard, type TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useListStore } from "../../../store/useListStore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
//import { useTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { $styles } from '@/theme/styles';
import { Button } from '@/components/Button'
import SelectedPlayers from '@/components/ui/SelectedPlayers';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { SearchField } from '@/components/SearchField';
import { PlayerList } from '@/components/ui/PlayerList';
import { TopOptionTabs } from "@/components/ui/TopOptionTabs"

type Item = {
  id: string;
  name: string;
};

const options = [
  { key: "overview", label: "Overview" },
  { key: "stats", label: "Stats" },
  { key: "matches", label: "Matches" },
  { key: "history", label: "History" },
  { key: "advanced", label: "Advanced" },
]

const HomeScreen = () => {
  const router = useRouter();
  const setItems = useListStore((state) => state.setItems);
  const [data, setData] = useState<Item[]>([
    { id: '1', name: 'Nikolaus' },
    { id: '2', name: 'Silvester' },
    { id: '3', name: 'David' },
    { id: '4', name: 'Lukas' },
    { id: '5', name: 'Anton' },
    { id: '6', name: 'Maria' },
    { id: '7', name: 'Josef' },
    { id: '8', name: 'Mario' },
    { id: '9', name: 'Simon' },
    { id: '10', name: 'Markus' },
    { id: '11', name: 'Bernd' },
    { id: '12', name: 'Maximilian' },
    { id: '13', name: 'Markus Aurelius Dominikus' },
    { id: '14', name: 'Maximilian Baximilian Raximus' },
    { id: '15', name: 'Servus Versus Cersus' },
  ]);

  const [tab, setTab] = useState("options")


  const {
    themed, theme, themeContext,
  } = useAppTheme()

  const placeholderAvatar = require("../../../../assets/avatar-placeholder.png") //TODO change this to an actual placeholder avatar, this one is just quickly from the internet.

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>(() => {
    // Initialize with the item that has id=1 //TODO change this to their own user
    const initialItem = data.find(item => item.id === '1'); 
    return initialItem ? [initialItem] : [];
  });
  const [inputName, setInputName] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredData(data);
  };

  const handleItemPress = (item: Item) => {
    if (!selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]); //add item if not already selected
    }
    else {
      handleRemoveItem(item); //delete item if it was already selected
    }
  };

  const handleRemoveItem = (item: Item) => {
    const updatedItems = selectedItems.filter((selected) => selected.id !== item.id);
    setSelectedItems(updatedItems);
  };

  const handleAddItem = () => {
    if (inputName.trim()) {
      const newItem: Item = {
        id: String(data.length + 1),
        name: inputName + " (temp)",
      };
      setData([...data, newItem]);
      setInputName('');
      if (!selectedItems.some((selected) => selected.id === newItem.id)) {
        setSelectedItems([...selectedItems, newItem]); //add item if not already selected
      } 
    }
  };

  const handleClearSelectedItems = () => {
    setSelectedItems([]);
  };

  const isItemSelected = (item: Item) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  const handleSave = () => {
    setItems(selectedItems); // Store the list in Zustand
    router.push({
      pathname: '/MakeTeamsScreen',
    });
  };

  return (
    <SafeAreaView style={themed($container)}>
      <Text style={themed($header)}>Add Players</Text>
      <View>
      <TopOptionTabs
        options={options}
        value={tab}
        onChange={setTab}
        rightHint="chevron"
      />
          <Text>Selected: {tab}</Text>
      </View>
      <View style={themed($searchContainer)}>
        <SearchField
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search…"
          onClear={clearSearch}
          onSubmit={(q) => handleSearch(q)}
          testID="players-search"
          inputTestID="players-search-input"
          clearButtonTestID="players-search-clear"
        />
      </View>
      <View style={themed($buttonRow)}>
        <View style={themed($leftContainer)}>
          <TextInput
            style={themed($newplayerinput)}
            placeholder="Add temp player"
            placeholderTextColor={theme.colors.textDim}
            value={inputName}
            onChangeText={setInputName}
          />
          <TouchableOpacity onPress={handleAddItem} style={themed($iconContainer)}>
            <IconSymbol size={28} name='person.badge.plus' color={theme.colors.iconColor} iconSet="material" />
          </TouchableOpacity>
        </View>
        <View style={themed($clearItemsButton)}>
          <Button
            text="Clear Selection" 
            onPress={handleClearSelectedItems}
            style={themed($Button)}
            textStyle={themed($clearSelectionButtonText)}
          />
        </View>
      </View>


      <PlayerList
        data={filteredData.length > 0 ? filteredData : data}
        themed={themed}
        isSelected={(item) => isItemSelected(item)}
        favoriteDisabled={true}
        onPressRow={(item) => handleItemPress(item)}
        onPressFavorite={(item) => console.log("fav", item.id)}
        onPressMore={(item) => console.log("more", item.id)}
        placeholderAvatarSource={placeholderAvatar}
      />

      <View style={themed($fullWidthDivider)} />
      <Text style={themed($selectedTitle)}>Selected Players: {selectedItems.length}</Text>
      {!keyboardStatus ? (
      <SelectedPlayers 
        selectedPlayers={selectedItems} 
        onClickPlayer={handleRemoveItem}
        selectedItemStyle={themed($selectedItem)}
        textStyle={themed($selectedItemText)} 
      />
        ) : null
      }
      <Button
        text="Create Teams" 
        onPress={handleSave} 
        style={themed($Button)}
        textStyle={themed($saveButtonText)} 
      />
    </SafeAreaView>
  );
};



const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  padding: 16,
  backgroundColor: theme.colors.background,
});

const $header: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 5,
  color: theme.colors.text, // TODO what does this do again?
});

const $searchBar: ThemedStyle<TextStyle> = (theme) => ({
  flex: 1,
  height: 40,
  borderColor: theme.colors.border,
  borderWidth: 1,
  paddingLeft: 8,
  color: theme.colors.text, // TODO what does it do?
});

const $searchContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "stretch",
  //paddingHorizontal: 10,
  marginBottom: 16,
  marginTop: 16,
});

// TODO placeholder can also be styled i think, check if that is possible with theming and if so add it to the theme and use it here. Multiple placeholders in here

const $clearButton: ThemedStyle<ViewStyle> = (theme) => ({
  //height: 40,
  marginLeft: 10,
  padding: 5,
  justifyContent: "center",
  alignItems: "center",
});

const $clearButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  color: 'red', // TODO use theme color for this. Check hardcoded values for all these spacings etc here in general.
});

const $fullWidthDivider: ThemedStyle<ViewStyle> = (theme) => ({
  height: 4,
  backgroundColor: theme.colors.border, //marginHorizontal: -16, // cancel container padding
  marginBottom: 8,
});


const $selectedTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 4, 
  marginBottom: 12,
  color: theme.colors.text, // TODO what does this do again, just color of text?
});

const $selectedItem: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  backgroundColor: theme.colors.itemBackground, 
  margin: 5,
  borderWidth: 2,
  borderColor: theme.colors.palette.primary500, // TODO change this and add this to the theme
  borderRadius: 10, // Rounded corners
});

const $cross: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  color: 'red', // TODO change this and add this to the theme
});

const $playernameflatList: ThemedStyle<ViewStyle> = (theme) => ({
  alignItems: "center", // Ensures items are centered
});

const $playerlistitemcontainer: ThemedStyle<ViewStyle> = (theme) => ({
  width: 100,
  height: 50,
  backgroundColor: theme.colors.palette.neutral100, // Light background, TODO change this and add this to the theme
  margin: 5,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2, // Border thickness
  borderColor: theme.colors.palette.primary500, // TODO change this and add this to the theme, was blue, maybe change to that
  borderRadius: 10, // Rounded corners
});

const $playerlistitemtext: ThemedStyle<TextStyle> = (theme) => ({
  fontWeight: "bold",
  color: theme.colors.text, // TODO change this and add this to the theme, was blue, maybe change to that
  maxWidth: 90, //TODO change this to make it responsive or add it to the theme, maybe add an ellipsis if text is too long instead of just cutting it off like this
});

const $buttonRow: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
});

const $clearItemsButton: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1, // Takes up available space on the right
  marginLeft: 20,
});

const $leftContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flex: 2, // Takes up more space on the left
});

const $newplayerinput: ThemedStyle<TextStyle> = (theme) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 8,
  width: 150, // Fixed width for the TextInput
  marginRight: 8, // Space between TextInput and Add Item button
});

const $iconContainer: ThemedStyle<ViewStyle> = (theme) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 8,
  backgroundColor: theme.colors.buttonBackground,
});

const $selectedItemsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginBottom: 10,
});

const $selectedItemText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text, 
});

const $Button: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.buttonBackground,
  color: theme.colors.text,
})

const $saveButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 20, //TODO maybe do not hardcode this and add it to the theme or make it responsive, maybe also add font weight and stuff like that to the theme
  color: theme.colors.text,
});

const $clearSelectionButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16, //TODO maybe do not hardcode this and add it to the theme or make it responsive, maybe also add font weight and stuff like that to the theme
  color: theme.colors.text,
});
export default HomeScreen;