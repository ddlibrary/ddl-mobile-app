import {
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text, Pressable, Platform
} from "react-native";
import React from "react";
import i18n, {t} from "i18next";
import {DATA as DATA_EN, CardItem} from "@/constants/home/FeaturedCollectionEn";
import {DATA as DATA_FA} from "@/constants/home/FeaturedCollectionFa";
import {DATA as DATA_PS} from "@/constants/home/FeaturedCollectionPs";
import {SafeAreaProvider} from "react-native-safe-area-context";
import FeaturedCollectionIcons, {IconSourceKeys} from "@/components/FeaturedCollectionIcons";
import {router, useNavigation} from "expo-router";
import * as SplashScreen from "expo-splash-screen";

const DATA_MAP: Record<string, typeof DATA_EN> = {
  en: DATA_EN,
  fa: DATA_FA,
  ps: DATA_PS,
};

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});


const renderCards = ({ item }: { item: CardItem }) => {
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgb(255, 207, 119)' : 'white',
        },
        styles.card,
      ]}
      onPress={() => {
        let type, catId;
        if (item.subject_id) {
          type = "subject_area";
          catId = item.subject_id;
        }
        else if (item.type_id) {
          type = "type";
          catId = item.type_id;
        }
        else if (item.level_id) {
          type = "level";
          catId = item.level_id;
        }
        router.push({
          pathname: "./library",
          params: {
            type: type,
            catId: catId,
          }
        });
      }}
    >
        <FeaturedCollectionIcons id={item.id} name={item.file_name} style={styles.card_image} />

      <Text
        style={[
          styles.label,
          {textAlign: i18n.language != "en" ? "right" : "left",}
        ]}
      >
        {item.name}
      </Text>
    </Pressable>
  );
};

const renderSectionFooter = ({ section }: {
  section: {
    data: Array<{
      id: string;
      name: string;
      file_name: IconSourceKeys;
      subject_id: string | null;
      type_id: string | null;
      level_id: string | null;
    }>
  }
}) => {
  return (
    <FlatList
      data={section.data}
      extraData={i18n.language}
      renderItem={renderCards}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        flexDirection: i18n.language != "en" ? "row-reverse" : "row",
      }}
    />
  )
};

export default function homeScreen() {

  const selectedData = DATA_MAP[i18n.language] || DATA_EN;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.parentContainer}>
        <SectionList
          sections={selectedData}
          keyExtractor={(item) => item.id}
          renderItem={() => null} // we'll render using <FlatList /> in the Footer
          renderSectionHeader={({section: {title}}) => (
            <Text
              style={[
                styles.header,
                {
                  textAlign: i18n.language != "en" ? "right" : "left",
                  marginRight: i18n.language != "en" ? 8 : "auto",
                }
              ]}
            >
              {title}
            </Text>
          )}
          stickySectionHeadersEnabled={false}
          renderSectionFooter={renderSectionFooter}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    padding: 10,
    ...(Platform.OS === "ios" && { marginBottom: 80 }),
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    ...(Platform.OS === "ios" && { marginLeft: 5, marginRight: 5 }),
  },
  container: {
  },
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    height: 100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  card_image: {
    flex: 1,
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  label: {
    marginTop: 10,
    fontSize: 10,
  },
});
