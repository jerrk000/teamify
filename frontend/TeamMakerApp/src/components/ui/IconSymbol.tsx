import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];
type FontAwesome6IconName = React.ComponentProps<typeof FontAwesome6>['name'];

// Add your SF Symbol to MaterialIcons mappings here.
const MATERIAL_ICONS_MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.badge.plus': 'person-add',
  'line.horizontal.3': 'menu',
  'sportscourt': 'sports-volleyball',
  'gear': 'settings',
  'delete': 'delete',
  'info-outline': 'info-outline',
  'qr-code-2': 'qr-code-2',
  'qr-code-scanner': 'qr-code-scanner',
} as const satisfies Record<string, MaterialIconName>;

// Add your SF Symbol to FontAwesome mappings here.
const FONT_AWESOME_MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'paper-plane',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.3.fill': 'group',
  'chart.bar.fill': 'bar-chart',
  'star': 'star',
  'star-o': 'star-o',
  'chevron.down': 'chevron-down',
  'check': 'check',
  'book': 'book',
  'play': 'play',
  'rocket': 'rocket',
  'gear': 'gear',
} as const satisfies Record<string, FontAwesomeIconName>;

// Add your SF Symbol to FontAwesome mappings here.
const FONT_AWESOME6_MAPPING = {
  'delete.left.fill': 'delete-left',
  'magnifying-glass': 'magnifying-glass',
  'xmark': 'xmark',
  'shuffle': 'shuffle',
  'bell': 'bell',
  'copy': 'copy',
  'clock': 'clock',
} as const satisfies Record<string, FontAwesome6IconName>;

export type IconSymbolName =
  | keyof typeof MATERIAL_ICONS_MAPPING
  | keyof typeof FONT_AWESOME_MAPPING
  | keyof typeof FONT_AWESOME6_MAPPING;

type CommonIconSymbolProps = {
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

type IconSymbolProps =
  | (CommonIconSymbolProps & {
      name: keyof typeof MATERIAL_ICONS_MAPPING;
      iconSet?: 'material';
    })
  | (CommonIconSymbolProps & {
      name: keyof typeof FONT_AWESOME_MAPPING;
      iconSet: 'fontawesome';
    })
  | (CommonIconSymbolProps & {
      name: keyof typeof FONT_AWESOME6_MAPPING;
      iconSet: 'fontawesome6';
    });

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons or FontAwesome on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons or FontAwesome.
 */
export function IconSymbol(props: IconSymbolProps) {
  const { size = 24, color, style } = props;

  if (props.iconSet === 'fontawesome') {
    return <FontAwesome color={color} size={size} name={FONT_AWESOME_MAPPING[props.name]} style={style} />;
  }
  else if (props.iconSet === 'fontawesome6') {
    return <FontAwesome6 color={color} size={size} name={FONT_AWESOME6_MAPPING[props.name]} style={style} />;
  }

  // Default to MaterialIcons
  return <MaterialIcons color={color} size={size} name={MATERIAL_ICONS_MAPPING[props.name]} style={style} />;
}
