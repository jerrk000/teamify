import React, {useState, useEffect} from 'react';
import { Image, View, type ViewStyle, Text, TouchableOpacity, Keyboard, useWindowDimensions, type TextStyle, type ImageStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useListStore } from "../../../store/useListStore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { $styles } from '@/theme/styles';
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField';
import CurrentPlayerSelection from '@/components/ui/CurrentPlayerSelection';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { SearchField } from '@/components/SearchField';
import { PlayerList } from '@/components/ui/PlayerList';
import { OptionTabs } from "@/components/ui/OptionTabs"
import { GAME_OPTIONS_TAGS, type GameOptionsTagKey } from '@/options/GameOptionsTabs';
import { SegmentedContentTabs } from '@/components/ui/SegmentedContentTabs';

type Item = {
  id: string;
  name: string;
};

type RosterTabKey = "players" | "groups";

const MakeTeamsScreen = () => {
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


  const {
    themed, theme, themeContext,
  } = useAppTheme()

  const placeholderAvatar = theme.isDark
    ? require("../../../../assets/avatar_placeholder_white.png")
    : require("../../../../assets/avatar_placeholder.png")

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>(() => {
    // Initialize with the item that has id=1 //TODO change this to their own user
    const initialItem = data.find(item => item.id === '1'); 
    return initialItem ? [initialItem] : [];
  });
  const [inputName, setInputName] = useState('');
  const { height: windowHeight } = useWindowDimensions();
  const selectedPlayersMaxHeight = windowHeight * 0.3;
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [tab, setTab] = useState<GameOptionsTagKey>(GAME_OPTIONS_TAGS[0].key);
  const [rosterTab, setRosterTab] = useState<RosterTabKey>("players");

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
    const guestName = inputName.trim();

    if (guestName) {
      const newItem: Item = {
        id: String(data.length + 1),
        name: guestName + " (temp)",
      };
      setData([...data, newItem]);
      setInputName('');
      if (!selectedItems.some((selected) => selected.id === newItem.id)) {
        setSelectedItems([...selectedItems, newItem]); //add item if not already selected
      } 
    }
  };

  const handleGroupPress = (playerIds: string[]) => {
    const groupPlayers = data.filter((item) => playerIds.includes(item.id));
    const nextItems = [
      ...selectedItems,
      ...groupPlayers.filter(
        (item) => !selectedItems.some((selected) => selected.id === item.id),
      ),
    ];

    setSelectedItems(nextItems);
  };

  const isItemSelected = (item: Item) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  const handleCreateTeams = () => {
    setItems(selectedItems); // Store the list in Zustand
    const actionByTab: Record<GameOptionsTagKey, () => void> = {
      random: () =>router.push({pathname: '/GameScreen',}),
      custom: () => router.push({pathname: '/GameScreen',}),
      tournament: () => router.push({pathname: '/GameScreen',}),
      keepscore: () => router.push({pathname: '/GameScreen',}),
      // Dont forget to add cases here if new modes are implemented
  }
  actionByTab[tab]()
  };

  const playersTabContent = (
    <>
      <View style={themed($guestPlayerRow)}>
        <Image
          source={placeholderAvatar}
          style={themed($guestAvatar)}
          accessibilityLabel="Temporary guest avatar"
        />

        <TextField
          value={inputName}
          onChangeText={setInputName}
          placeholder="Guest name"
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
          autoCorrect={false}
          textAlignVertical="center"
          containerStyle={themed($guestInputContainer)}
          inputWrapperStyle={themed($guestInputFrame)}
          style={themed($guestInput)}
          accessibilityLabel="Guest name"
          testID="players-add-input"
        />

        <TouchableOpacity
          onPress={handleAddItem}
          disabled={!inputName.trim()}
          activeOpacity={0.8}
          style={[themed($guestAddButton), !inputName.trim() ? themed($guestAddButtonDisabled) : null]}
          accessibilityRole="button"
          accessibilityLabel="Add temporary guest"
          testID="players-add"
        >
          <IconSymbol size={26} name='person.badge.plus' color={theme.colors.iconColor} iconSet="material" />
        </TouchableOpacity>
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
    </>
  );

  const groupsTabContent = (
    <View style={themed($groupsContainer)}>
      {[
        { id: "classic-boys", name: "Classic Boys", playerIds: ["1", "2", "3", "4"] },
        { id: "after-work", name: "After Work", playerIds: ["5", "6", "7", "8"] },
        { id: "weekend-mix", name: "Weekend Mix", playerIds: ["9", "10", "11", "12"] },
      ].map((group) => {
        const selectedCount = group.playerIds.filter((id) =>
          selectedItems.some((item) => item.id === id),
        ).length;

        return (
          <TouchableOpacity
            key={group.id}
            activeOpacity={0.8}
            onPress={() => handleGroupPress(group.playerIds)}
            style={themed($groupCard)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${group.name}`}
          >
            <View>
              <Text style={themed($groupName)} numberOfLines={1}>
                {group.name}
              </Text>
              <Text style={themed($groupMeta)}>
                {selectedCount}/{group.playerIds.length} selected
              </Text>
            </View>
            <IconSymbol size={24} name="person.badge.plus" color={theme.colors.iconColor} iconSet="material" />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={themed($container)}>
        <Text style={themed($header)}>Add Players</Text>
        <View>
          <OptionTabs
            options={GAME_OPTIONS_TAGS}
            value={tab}
            onChange={setTab}
            rightHint="fade"
            showBottomDivider={false}
          />
        </View>
        <View style={themed($searchContainer)}>
          <SearchField
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search Player…"
            onClear={clearSearch}
            onSubmit={(q) => handleSearch(q)}
            testID="players-search"
            inputTestID="players-search-input"
            clearButtonTestID="players-search-clear"
            containerStyle={(theme) => ({ width: "100%",})}
          />
        </View>

        <SegmentedContentTabs
          tabs={[
            { key: "players", label: "Players", content: playersTabContent, testID: "roster-tab-players" },
            { key: "groups", label: "Groups", content: groupsTabContent, testID: "roster-tab-groups" },
          ]}
          value={rosterTab}
          onChange={setRosterTab}
          style={themed($rosterTabs)}
          a11yLabelPrefix="Roster"
        />
      </View>
      <View style={themed($fullWidthDivider)} />
      <View style={themed($lowerContainer)}>
        <Text style={themed($selectedTitle)}>Selected Players: {selectedItems.length}</Text>
        {!keyboardStatus ? ( //TODO Maybe not needed anymore, check usability with the keyboard
          <View style={{ maxHeight: selectedPlayersMaxHeight }}>
            <CurrentPlayerSelection
              selectedPlayers={selectedItems} 
              onRemovePlayer={handleRemoveItem}
              textStyle={themed($selectedItemText)} 
              placeholderAvatarSource={placeholderAvatar}
            />
          </View>
        ) : null}
        <View 
        style={{ paddingRight: 20 }} //if you change this padding, also change padding of lowerContainer
        > 
          <Button
            text="Create Teams" 
            onPress={handleCreateTeams} 
            style={themed($Button) }
            textStyle={themed($saveButtonText)} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};



const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  //paddingTop: 8,
  paddingLeft: 16,
  paddingRight: 16,
  backgroundColor: theme.colors.background,
});

const $header: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 5,
  color: theme.colors.text, // TODO what does this do again?
});

const $searchContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "stretch",
  //paddingHorizontal: 10,
  marginBottom: 16,
  marginTop: 16,
});

const $rosterTabs: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 8,
});

// TODO placeholder can also be styled i think, check if that is possible with theming and if so add it to the theme and use it here. Multiple placeholders in here

const $fullWidthDivider: ThemedStyle<ViewStyle> = (theme) => ({
  height: 8,
  backgroundColor: theme.colors.background, //marginHorizontal: -16, // cancel container padding
  //marginBottom: 8,
});

const $lowerContainer: ThemedStyle<ViewStyle> = (theme) => ({
  //flex: 1,
  width: "100%",
  //alignItems: "center",
  //gap: 12,
  paddingTop: 12,
  paddingBottom: 10,
  paddingLeft: 20, // to align with the padding of the button, if you change this also change padding of the button
  borderTopLeftRadius: 38,
  borderTopRightRadius: 38,
  backgroundColor: theme.colors.itemBackground, //TODO maybe make a specific color for this container?
});

const $selectedTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 4, 
  marginBottom: 12,
  color: theme.colors.text, // TODO what does this do again, just color of text?
});

const $guestPlayerRow: ThemedStyle<ViewStyle> = (theme) => ({
  minHeight: 62,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: theme.colors.itemBackground,
  margin: 5,
  marginBottom: 12,
  borderRadius: 10,
});

const $guestAvatar: ThemedStyle<ImageStyle> = (_theme) => ({
  width: 30,
  height: 30,
  borderRadius: 15,
});

const $guestInputContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minWidth: 0,
});

const $guestInputFrame: ThemedStyle<ViewStyle> = (theme) => ({
  height: 44,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.itemBackground,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 12,
});

const $guestInput: ThemedStyle<TextStyle> = (theme) => ({
  flex: 1,
  alignSelf: "stretch",
  color: theme.colors.text,
  fontSize: 16,
  height: 44,
  marginHorizontal: 0,
  marginVertical: 0,
  paddingHorizontal: 0,
  paddingVertical: 0,
  textAlignVertical: "center",
});

const $guestAddButton: ThemedStyle<ViewStyle> = (theme) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.background,
});

const $guestAddButtonDisabled: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.45,
});

const $groupsContainer: ThemedStyle<ViewStyle> = () => ({
  gap: 10,
});

const $groupCard: ThemedStyle<ViewStyle> = (theme) => ({
  minHeight: 72,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.itemBackground,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 12,
});

const $groupName: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: "800",
});

const $groupMeta: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 14,
  marginTop: 4,
});

const $selectedItemText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text, 
});

const $Button: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.buttonBackground,
  //backgroundColor: theme.colors.itemBackground, //itembackground for buttoncolor looks better, but not good designwise
  color: theme.colors.text,
})

const $saveButtonText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 20, //TODO maybe do not hardcode this and add it to the theme or make it responsive, maybe also add font weight and stuff like that to the theme
  color: theme.colors.text,
});

export default MakeTeamsScreen;
