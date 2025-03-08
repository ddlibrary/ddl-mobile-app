import i18next from "i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "../i18n/locales/en.json";
import translationFa from "../i18n/locales/fa.json";
import translationMj from "../i18n/locales/mj.json";
import translationNo from "../i18n/locales/no.json";
import translationPs from "../i18n/locales/ps.json";
import translationSh from "../i18n/locales/sh.json";
import translationSw from "../i18n/locales/sw.json";
import translationUz from "../i18n/locales/uz.json";
import {initReactI18next} from "react-i18next";

const resources = {
  "en": { translation: translationEn },
  "fa": { translation: translationFa },
  "mj": { translation: translationMj },
  "no": { translation: translationNo },
  "ps": { translation: translationPs },
  "sh": { translation: translationSh },
  "sw": { translation: translationSw },
  "uz": { translation: translationUz },
};

export const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode;
  }

  await i18next.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    lng: savedLanguage ?? "en",
    interpolation: {
      escapeValue: false,
    },
  });
};
