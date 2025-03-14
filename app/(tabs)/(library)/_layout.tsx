import { Stack, Tabs } from "expo-router";
import React from "react";
import {t} from "i18next";

export default function LibraryLayout () {
  return (
    <Stack>
      <Tabs.Screen
        name="library"
        options={{
          title: t('library'),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
      <Stack.Screen
        name="resource"
        options={{
          title: t('Resource'),
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
      <Stack.Screen
        name="file"
        options={{
          title: t('File'),
          headerStyle: {
            backgroundColor: "#ffa800",
          },
        }}
      />
    </Stack>
  )
}
