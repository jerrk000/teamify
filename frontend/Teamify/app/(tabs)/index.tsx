import React, {useState, useEffect} from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Button, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useListStore } from "../../store/useListStore";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';


type Item = {
  id: string;
  name: string;
};

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
      params: {
        customTitle: 'Custom Header Title', // Pass dynamic header title
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add friends to game</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.clearButton}>
            <TouchableOpacity onPress={clearSearch} style={styles.iconContainer}>
              <IconSymbol size={28} name='delete.left.fill' color='black' iconSet="fontawesome6" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.leftContainer}>
            <TextInput
              style={styles.newplayerinput}
              placeholder="Add temp player"
              value={inputName}
              onChangeText={setInputName}
            />
            <TouchableOpacity onPress={handleAddItem} style={styles.iconContainer}>
              <IconSymbol size={28} name='person.badge.plus' color='black' iconSet="material" />
            </TouchableOpacity>
          </View>
          <View style={styles.clearItemsButton}>
            <Button title="Clear Selection" onPress={handleClearSelectedItems} />
          </View>
        </View>
        
        <FlatList
          data={filteredData.length > 0 ? filteredData : data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={[
                styles.item,
                isItemSelected(item) ? styles.clickedItem : styles.noclickedItem
              ]}>
                <Text>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.selectedTitle}>Selected Items: {selectedItems.length}</Text>
        {!keyboardStatus ? (
          <View style={styles.selectedItemsContainer}>
            <FlatList
              data={selectedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                  <View style={styles.selectedItem}>
                    <Text style={styles.playerlistitemtext}
                    numberOfLines={1} 
                    ellipsizeMode="tail">
                      {item.name}</Text>
                      <Text style={styles.cross}>❌</Text>
                  </View>
                </TouchableOpacity>
              )}
              numColumns={3}
              columnWrapperStyle={selectedItems.length === 1 ? { justifyContent: "center" } : {}}
              contentContainerStyle={styles.playernameflatList}
            />
          </View>
          ) : null
        }
        <Button title="Save Selected Items" onPress={handleSave} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  clearButton: {
    //height: 40,
    marginLeft: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: 'red',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clickedItem: {
    backgroundColor: '#C8E6C9',
  },
  noclickedItem: {
    borderBottomColor: '#ccc', //unneeded, because already in item, but maybe customized later?
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  selectedItem: {
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
  cross: {
    fontSize: 16,
    color: 'red',
  },
  playernameflatList: {
    alignItems: "center", // Ensures items are centered
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
    maxWidth: 90,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearItemsButton: {
    flex: 1, // Takes up available space on the right
    marginLeft: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 2, // Takes up more space on the left
  },
  newplayerinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 150, // Fixed width for the TextInput
    marginRight: 8, // Space between TextInput and Add Item button
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  selectedItemsContainer: {
    marginBottom: 10,
  }
});

export default HomeScreen;