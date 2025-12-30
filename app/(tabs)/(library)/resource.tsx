import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Image,
  Dimensions,
  RefreshControl,
  Pressable, Platform
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect, useState} from "react";
import Api from "@/constants/Api";
import i18n, {t} from "i18next";
import ScrollView = Animated.ScrollView;
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {File} from 'expo-file-system/next';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as WebBrowser from 'expo-web-browser';
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function ResourceScreen() {
  const {id, title, img: rawId, abstract: rawAbstract} = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [waitTime, setWaitTime] = useState(0);
  const [base64Image, setBase64Image] = useState("");
  const img = String(rawId);

  const isRTL = i18n.language !== "en";
  const textAlign = isRTL ? "right" : "left";

  const sanitizeText = (text: any) => {
    if (typeof text !== 'string') return '';
    let cleaned = text.replace(/<[^>]*>?/gm, '');
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&rsquo;': "'",
      '&lsquo;': "'",
      '&rdquo;': '"',
      '&ldquo;': '"',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&apos;': "'",
      '&copy;': '©',
      '&reg;': '®',
      '&#39;': "'",
      '&bull;': '•',
    };
    cleaned = cleaned.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);
    return cleaned.trim();
  };

  const abstract = sanitizeText(rawAbstract);

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (waitTime <= 0) return;
    const interval = setInterval(() => {
      setWaitTime((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [waitTime]);

  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const base64 = await new File(img).base64();
        setBase64Image(`data:image/jpeg;base64,${base64}`);
      } catch (e) {
        console.error("Error converting image to Base64:", e);
        setBase64Image("");
      }
    };
    if (Platform.OS === "ios" && img && !img.startsWith('http')) {
      convertToBase64();
    } else {
      setBase64Image(img);
    }
  }, [img]);

  const fetchData = async (url: string) => {
    setIsLoading(true);
    setError(null);
    const retries = 5;

    try {
      for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          setData(json);
          return;
        }
        if (response.status === 429) {
          const wait = 5000; // 5s
          setWaitTime(wait);
          await new Promise((resolve) => setTimeout(resolve, wait));
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getData = () => fetchData(Api.resourceApi + id);

  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating size="large" />
        <Text style={{ marginTop: 10 }}>
          {waitTime > 0
            ? t("server_busy_retrying", { waitTime: waitTime / 1000 })
            : t("loading_with_periods")}
        </Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text>{t("Error fetching data.")}</Text>
        <Pressable onPress={getData} style={[styles.fileButton, {marginTop: 20}]}>
          <Text style={{color: 'white'}}>{t("Retry")}</Text>
        </Pressable>
      </View>
    );
  }

  const InfoSection = ({ title, items, field = "name" }: { title: string, items: any[], field?: string }) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.cardView}>
        <Text style={[styles.cardTitle, { textAlign, fontWeight: "bold" }]}>{title}</Text>
        <Text style={[styles.cardText, { textAlign }]}>
          {items.map((item, idx) => (
            <Text key={item.id || idx}>{item[field]}{idx < items.length - 1 ? '\n' : ''}</Text>
          ))}
        </Text>
      </View>
    );
  };

  const LanguageSection = ({ translations }: { translations: any[] }) => {
    const langMap: Record<string, string> = { ps: 'پشتو', fa: 'فارسی', en: 'English' };
    const filtered = translations?.filter(t => langMap[t.language]);
    if (!filtered?.length) return null;

    return (
      <View style={styles.cardView}>
        <Text style={[styles.cardTitle, { textAlign, fontWeight: "bold" }]}>{t("Available in the following languages")}</Text>
        <View style={{ marginTop: 4 }}>
          {filtered.map((tr) => {
            const isCurrent = String(tr.id) === String(id);
            return (
              <Pressable
                key={tr.id}
                disabled={isCurrent}
                onPress={() => {
                  router.push({
                    pathname: "./resource",
                    params: {
                      id: tr.id,
                      title: tr.title,
                      abstract: tr.abstract || "",
                    }
                  });
                }}
                style={({ pressed }) => [{
                  opacity: pressed ? 0.5 : 1,
                  paddingVertical: 4
                }]}
              >
                <Text style={[
                  styles.cardText,
                  { textAlign },
                  !isCurrent && { color: "#23b3ff", textDecorationLine: 'underline' }
                ]}>
                  {langMap[tr.language]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const AttachmentsSection = ({ attachments }: { attachments: any[] }) => {
    const getIcon = (mime: string) => {
      if (mime.includes("pdf")) return { lib: MaterialCommunityIcons, name: "file-pdf-box" };
      if (mime.includes("msword") || mime.includes("officedocument")) return { lib: MaterialCommunityIcons, name: "file-word-box" };
      if (mime.includes("audio")) return { lib: MaterialIcons, name: "audio-file" };
      return { lib: MaterialCommunityIcons, name: "book" };
    };

    return (
      <View style={styles.cardView}>
        <Text style={[styles.cardTitle, { textAlign, fontWeight: "bold", marginBottom: 10 }]}>{t("Resource files")}</Text>
        {attachments?.length > 0 ? (
          attachments.map((att) => {
            const IconComp: any = getIcon(att.file_mime).lib;
            return (
              <View key={att.id} style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 10, marginBottom: 15, alignItems: 'center' }}>
                <IconComp name={getIcon(att.file_mime).name} size={28} color="black" />
                <Pressable style={styles.fileButton} onPress={() => router.push({ pathname: "./file", params: { id: att.id, title } })}>
                  <View style={styles.buttonInner}>
                    <MaterialIcons name="remove-red-eye" size={18} color="white" />
                    <Text style={styles.buttonText}>{t("View")}</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.fileButton} onPress={() => router.push({ pathname: "../downloads", params: { id: att.id, title } })}>
                  <View style={styles.buttonInner}>
                    <MaterialIcons name="download" size={18} color="white" />
                    <Text style={styles.buttonText}>{t("Download")}</Text>
                  </View>
                </Pressable>
              </View>
            );
          })
        ) : (
          <Pressable
            style={styles.fileMissingButton}
            onPress={() => WebBrowser.openBrowserAsync(`${Api.mainUrl}${i18n.language}/resource/${id}`)}
          >
            <View style={styles.buttonInner}>
              <MaterialIcons name="link" size={20} color="white" />
              <Text style={styles.buttonText}>{t("View this resource in your browser")}</Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaProvider style={[styles.container, Platform.OS === "ios" && { marginBottom: 80 }]}>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: base64Image || `${Api.mainUrl}storage/files/placeholder_image.png` }}
            style={styles.coverPhoto}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardView}>
          <Text style={[styles.cardTitle, { textAlign, fontSize: 18, fontWeight: "bold" }]}>{title}</Text>
        </View>

        {abstract && (
          <View style={styles.cardView}>
            <Text style={[styles.cardTitle, { textAlign, fontWeight: "bold" }]}>{t("Abstract")}</Text>
            <Text style={[styles.cardText, { textAlign, marginTop: 4 }]}>{abstract}</Text>
          </View>
        )}

        {data && (
          <>
            <InfoSection title={t("Author")} items={data.authors} />
            <InfoSection title={t("Resource level")} items={data.levels} />
            <InfoSection title={t("Subject area")} items={data.subjects} />
            <InfoSection title={t("Learning resource type")} items={data.LearningResourceTypes} />
            <InfoSection title={t("Publisher")} items={data.publishers} />
            <LanguageSection translations={data.translations} />
            <InfoSection title={t("License")} items={data.CreativeCommons} />
            <AttachmentsSection attachments={data.attachments} />
          </>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  coverContainer: {
    height: 250,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    padding: 5,
    marginVertical: 10,
  },
  coverPhoto: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  cardView: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 12,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  fileButton: {
    backgroundColor: 'rgba(156,108,31,1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fileMissingButton: {
    backgroundColor: 'rgb(138,138,138)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  }
});
