import React from "react"
import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native"
import { Player } from "@/types/PlayerType"
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { IconSymbol } from "@/components/ui/IconSymbol"

interface SelectedPlayersProps {
  selectedPlayers: Player[]
  onClickPlayer?: (player: Player) => void
  containerStyle?: ViewStyle
  selectedItemStyle?: ViewStyle
  textStyle?: TextStyle
  disableTouch?: boolean
  isCentered?: boolean
}

const NAME_MAX_WIDTH = 100 // <- max width for the name before truncation

const SelectedPlayers: React.FC<SelectedPlayersProps> = ({
  selectedPlayers,
  onClickPlayer = () => {},
  containerStyle,
  selectedItemStyle,
  textStyle,
  disableTouch = false,
  isCentered = false,
}) => {
  const { themed, theme, themeContext, } = useAppTheme()
  return (
    <View style={[themed($container), containerStyle]}>
      <View
        style={[
          themed($wrapRow),
          isCentered ? { justifyContent: "center" } : { justifyContent: "flex-start" },
        ]}
      >
        {selectedPlayers.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => onClickPlayer(p)}
            disabled={disableTouch}
            style={[themed($chip), selectedItemStyle]}
          >
            <Text
              style={[themed($name), textStyle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {p.name}
            </Text>

            {!disableTouch ? <IconSymbol name="xmark" iconSet="fontawesome6" color={"red"} style={themed($cross)} /> : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  marginBottom: 10,
});

const $wrapRow: ThemedStyle<ViewStyle> = (theme) => ({ // Wrapping layout: variable items per row, based on chip widths
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "flex-start",
});

const $chip: ThemedStyle<ViewStyle> = (theme) => ({  // Each item sizes to content (up to the name max), then wraps naturally
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  paddingHorizontal: 10,
  backgroundColor: theme.colors.itemBackground,
  borderWidth: 2,
  borderColor: theme.colors.primary, //TODO maybe use a different color for the border?
  borderRadius: 10,
  marginRight: 8,
  marginBottom: 8,
  // important for truncation / preventing weird overflow
  minWidth: 0,
  maxWidth: "100%", // never exceed screen width
});

const $name: ThemedStyle<TextStyle> = (theme) => ({
    fontWeight: "bold",
    color: theme.colors.text,

    // cap the name width and allow truncation
    maxWidth: NAME_MAX_WIDTH,
    flexShrink: 1,
    minWidth: 0,
})

const $cross: ThemedStyle<TextStyle> = (theme) => ({
  marginLeft: 8,
  fontSize: 22,
  color: "red",
})

export default SelectedPlayers