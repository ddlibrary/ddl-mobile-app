import {Image} from 'react-native';
import {IconSymbol} from "@/components/ui/IconSymbol";
import React from "react";
import {Colors} from "@/constants/Colors";
import {useColorScheme} from "@/hooks/useColorScheme";

export type IconSourceKeys =
  | 'mathematics-icon'
  | 'social-sciences-icon'
  | 'earth-sciences-icon'
  | 'life-sciences-icon'
  | 'language-arts-icon'
  | 'applied-sciences-icon'
  | 'arts-and-humanities-icon'
  | 'career-and-technical-education-icon'
  | 'education-icon'
  | 'history-icon'
  | 'business-and-communication-icon'
  | 'physical-sciences-icon'
  | 'fiber-new'
  | 'book'
  | 'newspaper'
  | 'child-care'
  | 'local-library'
  | 'school'
  | 'featured-video';

const collectionIconSources: Record<IconSourceKeys, any> = {
  'mathematics-icon': require('@/assets/images/home/mathematics-icon.png'),
  'social-sciences-icon': require('@/assets/images/home/social-sciences-icon.png'),
  'earth-sciences-icon': require('@/assets/images/home/earth-sciences-icon.png'),
  'life-sciences-icon': require('@/assets/images/home/life-sciences-icon.png'),
  'language-arts-icon': require('@/assets/images/home/language-arts-icon.png'),
  'applied-sciences-icon': require('@/assets/images/home/applied-sciences-icon.png'),
  'arts-and-humanities-icon': require('@/assets/images/home/arts-and-humanities-icon.png'),
  'career-and-technical-education-icon': require('@/assets/images/home/career-and-technical-education-icon.png'),
  'education-icon': require('@/assets/images/home/education-icon.png'),
  'history-icon': require('@/assets/images/home/history-icon.png'),
  'business-and-communication-icon': require('@/assets/images/home/business-and-communication-icon.png'),
  'physical-sciences-icon': require('@/assets/images/home/physical-sciences-icon.png'),
  'fiber-new': 'sparkles.rectangle.stack.fill',
  'book': 'book.fill',
  'newspaper': 'newspaper.fill',
  'child-care': 'figure.child',
  'local-library': 'studentdesk',
  'school': 'graduationcap.fill',
  'featured-video': 'video.fill',
};

const FeaturedCollectionIcons = ({ id, name, style }: { id: string, name: IconSourceKeys; style: any }) => {
  const source = collectionIconSources[name];

  if (!source) {
    console.warn(`Image/icon for "${name}" not found!`);
    return null;
  }
  if (Number(id) < 13)
    return <Image source={source} style={style} />;
  return <IconSymbol size={38} name={source} color={Colors[useColorScheme() ?? 'light'].tint} />
};

export default FeaturedCollectionIcons;
