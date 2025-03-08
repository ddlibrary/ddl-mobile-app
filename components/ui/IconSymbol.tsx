// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.library
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'library-books.fill': 'library-books',
  'download.fill': 'download',
  'language.fill': 'language',
  'menu.fill': 'menu',
  'arrow-back.fill': 'arrow-back',
  'account-box.fill': 'account-box',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'fiber-new.fill': 'fiber-new',
  'book.fill': 'book',
  'newspaper.fill': 'newspaper',
  'child-care.fill': 'child-care',
  'local-library.fill': 'local-library',
  'school.fill': 'school',
  'featured-video.fill': 'featured-video',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
