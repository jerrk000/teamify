import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

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
  'info-outline': 'info',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

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
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof FontAwesome>['name']
  >
>;

// Add your SF Symbol to FontAwesome mappings here.
const FONT_AWESOME6_MAPPING = {
  'delete.left.fill': 'delete-left',
  'magnifying-glass': 'magnifying-glass',
  'xmark': 'xmark',
  'shuffle': 'shuffle',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof FontAwesome6>['name']
  >
>;

export type IconSymbolName =
  | keyof typeof MATERIAL_ICONS_MAPPING
  | keyof typeof FONT_AWESOME_MAPPING
  | keyof typeof FONT_AWESOME6_MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons or FontAwesome on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons or FontAwesome.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  iconSet = 'material', // Default to MaterialIcons
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  iconSet?: 'material' | 'fontawesome' | 'fontawesome6'; // Specify which icon set to use
}) {
  if (iconSet === 'fontawesome') {
    return <FontAwesome color={color} size={size} name={FONT_AWESOME_MAPPING[name]} style={style} />;
  }
  else if (iconSet === 'fontawesome6') {
    return <FontAwesome6 color={color} size={size} name={FONT_AWESOME6_MAPPING[name]} style={style} />;
  }

  // Default to MaterialIcons
  return <MaterialIcons color={color} size={size} name={MATERIAL_ICONS_MAPPING[name]} style={style} />;
}
