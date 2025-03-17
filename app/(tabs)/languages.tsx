import React from "react";
import {StyleSheet, Text, SafeAreaView, View, Pressable} from "react-native";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaProvider} from "react-native-safe-area-context";
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
      <Pressable
        style={styles.button}
        onPress={ async () => {
          await AsyncStorage.setItem("language", lang);
          await i18n.changeLanguage(lang);
          await reloadAppAsync();
        }}
      >
        <Text style={{textAlign: "center"}}>{title}</Text>
      </Pressable>
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
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgb(230,230,230)',
    borderColor: 'transparent',
    borderWidth: 0,
    width: "50%",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
