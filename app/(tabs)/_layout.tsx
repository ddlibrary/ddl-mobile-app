import {Redirect, router, Tabs, useSegments} from 'expo-router';
import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {useTranslation} from "react-i18next";
import {useSession} from "@/context/AuthContext";

function LogoTitle() {
  return (
    <Image style={styles.ddlLogo} source={require('@/assets/images/dd-library-logo-white.png')} />
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  const segments = useSegments();

  if (!isLoading && !session && ["account", "downloads"].includes(segments[1] ?? "")) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
          headerTitle: props => <LogoTitle />,
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          title: t('library'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="books.vertical.fill" color={color} />,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: t('downloads'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.and.arrow.down.fill" color={color} />,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
      <Tabs.Screen
        name="languages"
        options={{
          title: t('languages'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="globe" color={color} />,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('Account'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  ddlLogo: {
    height: 34,
    width: 250,
    top: Platform.OS === "android" ? 15 : 0,
    position: Platform.OS === "android" ? "absolute" : "relative",
  },
  leftCornerButton: {
    margin: 7,
  },
});
