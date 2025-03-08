import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  Pressable,
  Platform,
  ActivityIndicator,
  TextInput, Button, Modal
} from "react-native";
import {Directory, File, Paths} from "expo-file-system/next";
import * as FileSystem from "expo-file-system";
import {useLocalSearchParams} from "expo-router";
import React, {useEffect, useState} from "react";
import Api from "@/constants/Api";
import {SafeAreaProvider} from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import i18n, {t} from "i18next";

export default function DownloadsScreen() {
  const { id: rawId, title } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<{
    title: string,
    fileName: string,
    type: string | null,
    uri: string,
    size: number | null
  }[]>([]);
  const id = String(rawId);

  const downloadAndStoreFile = async (id: string) => {
    const url = Api.fileApi + id;
    console.log("Downloading " + url);
    const destination = new Directory(Paths.document, "resource_files");
    try {
      destination.create();
      const files = destination.list();
      const fileNamesWithoutExt = files.map((file) => (file.uri.split("/").pop() ?? "").replace(/\.[^/.]+$/, ""));
      const exists = fileNamesWithoutExt.includes(id);
      if (!exists) {
        const output = await File.downloadFileAsync(url, destination);
        const metadata = { title, filename: output.uri.split("/").pop(), downloadedAt: new Date().toISOString() };
        const metadataFile = new File(destination, id + ".json");
        metadataFile.create();
        metadataFile.write(JSON.stringify(metadata, null, 2));
        console.log("File created")
      }
    } catch (error) {
      console.error(error);
    }
  }

  const listFiles = () => {
    const directory = new Directory(Paths.document, "resource_files");
    const files = directory.list();
    const fileData = [];
    for (const file of files) {
      if (file.uri.endsWith(".json")) continue;
      const fileName = file.uri.split("/").pop() ?? "";
      const metadataPath = "resource_files/" + fileName.replace(/\.[^/.]+$/, "") + ".json";
      const metadataFile = new File(Paths.document, metadataPath);
      let title = "";
      let downloaded = "";
      if (metadataFile.exists) {
        try {
          const metadataContent = metadataFile.text();
          const metadata = JSON.parse(metadataContent);
          title = metadata.title;
          title = title.length > 40 ? title.slice(0, 40) + "..." : title;
          downloaded = metadata.downloadedAt;
        } catch (error) {
          console.error("Error reading metadata file:", error);
        }
      }
      if (file instanceof File) {
        fileData.push({title, fileName: fileName, type: file.type, uri: file.uri, size: file.size, downloaded});
      }
    }
    setData(fileData);
  }

  useEffect(() => {
    if (id !== "undefined") {
      setIsLoading(true);
      downloadAndStoreFile( id )
        .then(() => listFiles())
        .then(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    listFiles();
  }, []);

  const openFile = async (uri: string) => {
    if (Platform.OS === 'android') {
      try {
        const contentUri = await FileSystem.getContentUriAsync(uri)
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
        });
      } catch (error) {
        console.error("Error opening file:", error);
      }
    } else {
      await Linking.openURL(uri);
    }
  };

  const deleteFile = (fileName: string) => {
    try {
      const jsonFileName = fileName.replace(/\.[^/.]+$/, ".json");
      const file = new File(Paths.document, "resource_files/" + fileName);
      if (file.exists) {
        file.delete();
      }
      const jsonFile = new File(Paths.document, "resource_files/" + jsonFileName);
      if (jsonFile.exists) {
        jsonFile.delete();
      }
      setSelectedId(null);
      listFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const Loading = () => {
    if (isLoading) {
      return (
        <View
          style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
        >
          <ActivityIndicator animating size={"small"}/>
        </View>
      );
    }
  };

  const Cards = ({item}) => {
    let fileType = "book";
    switch (item.type) {
      case "application/pdf":
        fileType = "file-pdf-box";
        break;
      case "application/msword":
        fileType = "file-word-box";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        fileType = "file-word-box";
        break;
      case "audio/mpeg":
        fileType = "audio-file";
        break;
    }
    return (
      <View style={styles.fileContainer}>
        <Pressable
          style={styles.card}
          onPress={() => openFile(item.uri)}
        >
          <View style={styles.cardFirstRow}>
            {fileType === "audio-file" ? (
              <MaterialIcons name="audio-file" size={28} color="black" />
            ) : (
              <MaterialCommunityIcons name={fileType} size={28} color="black" />
            )}
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.cardSecondRow}>
            <Text style={styles.fileSize}>{(item.size/(1024 * 1024)).toFixed(2)} MB</Text>
            <Text style={styles.time}>{item.downloaded.slice(0, 10)}</Text>
          </View>
        </Pressable>
        <MaterialIcons
          style={{
            marginLeft: i18n.language != "en" ? 12 : 0,
            marginRight: i18n.language != "en" ? 0 : 12,
          }}
          name="delete"
          size={24}
          color="red"
          onPress={() => setSelectedId(item.uri)}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedId === item.uri}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("Are you sure?")}{"\n"}{"\n"}</Text>
              <View style={styles.buttonContainer}>
                <Button title={t("Cancel")} onPress={() => setSelectedId(null)} />
                <Button title={t("Confirm")} color="red" onPress={() => {deleteFile(item.fileName)}} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            direction: i18n.language != "en" ? "rtl" : "ltr",
          }
        ]}>
        <FlatList
          data={data}
          renderItem={({item}) => <Cards item={item} />}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<Loading />}
          extraData={data}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#ffa800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardFirstRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSecondRow: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  fileSize: {
    backgroundColor: "gray",
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 5,
    color: "white",
    fontSize: 12,
  },
  time: {
    fontSize: 12,
    color: "#393939",
  },
  modalOverlay:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
