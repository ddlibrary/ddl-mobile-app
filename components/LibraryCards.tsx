import {Image, Pressable, StyleSheet, Text} from 'react-native';
import React, {memo} from "react";
import i18n from "i18next";
import {router} from "expo-router";
import * as FileSystem from 'expo-file-system/legacy';


export const resourceImageDir = FileSystem.cacheDirectory + 'resource_images/';
export const getResourceImageFileUri = (resourceId: string) => resourceImageDir + `${resourceId}`;

export async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(resourceImageDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(resourceImageDir, { intermediates: true });
  }
}

const RenderCard = ({ item }) => {
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgb(255, 207, 119)' : 'white',
        },
        styles.card,
      ]}
      onPress={async () => {
        await ensureDirExists();
        const imageUri = getResourceImageFileUri(item.id);
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          await FileSystem.downloadAsync(item.img, imageUri);
        }
        router.push({
          pathname: "./resource",
          params: {
            id: item.id,
            title: item.title,
            abstract: item.abstract,
            img: imageUri,
          }
        });
      }}
    >
      <Image
        style={styles.cardImage}
        source={{ uri: item.img }}
      />
      <Text
        style={[
          styles.cardTitle,
          {textAlign: i18n.language !== "en" ? "right" : "left",}
        ]}
        numberOfLines={2}
        ellipsizeMode={"tail"}
      >
        {item.title}
      </Text>
    </Pressable>
  );
};

export default memo(RenderCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 11,
  },
  cardImage: {
    height: 100,
    width: 100,
    resizeMode: "stretch",
  },
});
