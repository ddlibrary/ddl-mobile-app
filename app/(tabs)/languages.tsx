import React from "react";
import {StyleSheet, Text, SafeAreaView, Button, View} from "react-native";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {router} from "expo-router";
import {reloadAppAsync} from "expo";


export default function LanguageScreen() {
  const { t } = useTranslation();
  const languages = [
    { title: "English", lang: "en" },
    { title: "فارسی", lang: "fa" },
    { title: "پشتو", lang: "ps" },
  ];

  const LanguageItem = ({ lang, title }: { lang: string; title: string }) => (
    <View style={styles.buttonContainer}>
      <Button
        title={title}
        color="#8a8a8a"
        onPress={ async () => {
          await AsyncStorage.setItem("language", lang);
          await i18n.changeLanguage(lang);
          await reloadAppAsync();
        }}
      />
    </View>
  );

  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {languages.map((lang) => (
            <LanguageItem {...lang} key={lang.title} />
          ))}
          <Text style={{textAlign: "center", color: "red", marginTop: 300, }}>{t("App will reload")}</Text>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
buttonContainer: {
    margin: 10,
  },
});
