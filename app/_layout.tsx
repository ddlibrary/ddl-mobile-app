import 'expo-localization';
import { initI18n } from "@/i18n";
import { Stack } from 'expo-router/stack';
import {SessionProvider} from "@/context/AuthContext";
import {t} from "i18next";
import {StatusBar} from "expo-status-bar";
import {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";

export default function Root() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      setLoading(false);
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            title: t('Login'),
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: "#ffa800",
            },
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: t('Register'),
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: "#ffa800",
            },
            headerLeft: ()=> null,
          }}
        />
      </Stack>
    </SessionProvider>
  );
}
