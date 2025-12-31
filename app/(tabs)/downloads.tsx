import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  Platform,
  ActivityIndicator,
  Button,
  Modal
} from "react-native";
import {Directory, File, Paths} from "expo-file-system/next";
import * as FileSystem from "expo-file-system/legacy";
import {useLocalSearchParams} from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import Api from "@/constants/Api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import i18n, { t } from "i18next";

const LIBRARY_DIRECTORY = "dd_library_resource_files";

interface DownloadedFile {
  title: string;
  fileName: string;
  type: string | null;
  uri: string;
  size: number | null;
  downloaded: string;
}

export default function DownloadsScreen() {
  const { id: rawId, title } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DownloadedFile | null>(null);
  const [data, setData] = useState<DownloadedFile[]>([]);
  
  const id = String(rawId);
  const isRTL = i18n.language !== "en";

  const listFiles = useCallback(async () => {
    const directory = new Directory(Paths.document, LIBRARY_DIRECTORY);
    if (!directory.exists) {
      try {
        directory.create();
      } catch (error) {
        console.error("Error creating directory:", error);
        return;
      }
    }

    const files = directory.list();
    const fileData: DownloadedFile[] = [];

    for (const file of files) {
      if (file.uri.endsWith(".json") || !(file instanceof File)) continue;

      const fileName = file.uri.split("/").pop() ?? "";
      const metadataFile = new File(directory, fileName.replace(/\.[^/.]+$/, "") + ".json");
      
      let trimmedTitle = fileName;
      let downloaded = new Date().toISOString();

      if (metadataFile.exists) {
        try {
          const metadata = JSON.parse(await metadataFile.text());
          trimmedTitle = metadata.title || fileName;
          downloaded = metadata.downloadedAt || downloaded;
        } catch (error) {
          console.error("Error reading metadata:", error);
        }
      }

      fileData.push({
        title: trimmedTitle,
        fileName,
        type: file.type,
        uri: file.uri,
        size: file.size,
        downloaded
      });
    }
    setData(fileData);
  }, []);

  const downloadAndStoreFile = useCallback(async (fileId: string) => {
    const url = Api.fileApi + fileId;
    const destination = new Directory(Paths.document, LIBRARY_DIRECTORY);
    
    try {
      if (!destination.exists) destination.create();
      
      const files = destination.list();
      const exists = files.some(f => f.uri.includes(fileId));

      if (!exists) {
        const output = await File.downloadFileAsync(url, destination);
        const fileName = output.uri.split("/").pop() ?? "";
        const ext = fileName.split(".").pop();
        
        // Ensure filename matches ID for consistency
        if (!fileName.startsWith(fileId)) {
          await FileSystem.moveAsync({
            from: output.uri,
            to: `${destination.uri}/${fileId}.${ext}`
          });
        }

        const metadata = { 
          title: title, 
          filename: fileName, 
          downloadedAt: new Date().toISOString() 
        };
        const metadataFile = new File(destination, `${fileId}.json`);
        metadataFile.create();
        metadataFile.write(JSON.stringify(metadata, null, 2));
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  }, [title]);

  useEffect(() => {
    const init = async () => {
      if (id !== "undefined") {
        setIsLoading(true);
        await downloadAndStoreFile(id);
      }
      await listFiles();
      setIsLoading(false);
    };
    init();
  }, [id, downloadAndStoreFile, listFiles]);

  const openFile = async (uri: string) => {
    try {
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
        });
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      const baseName = fileName.replace(/\.[^/.]+$/, "");
      const file = new File(Paths.document, `${LIBRARY_DIRECTORY}/${fileName}`);
      const jsonFile = new File(Paths.document, `${LIBRARY_DIRECTORY}/${baseName}.json`);

      if (file.exists) file.delete();
      if (jsonFile.exists) jsonFile.delete();

      setSelectedFile(null);
      await listFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getFileIcon = (type: string | null) => {
    switch (type) {
      case "application/pdf": return { lib: "MaterialCommunityIcons", name: "file-pdf-box" };
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return { lib: "MaterialCommunityIcons", name: "file-word-box" };
      case "audio/mpeg": return { lib: "MaterialIcons", name: "audio-file" };
      default: return { lib: "MaterialCommunityIcons", name: "book" };
    }
  };

  const renderItem = ({ item }: { item: DownloadedFile }) => {
    const icon = getFileIcon(item.type);
    return (
      <View style={styles.fileContainer}>
        <Pressable style={styles.card} onPress={() => openFile(item.uri)}>
          <View style={styles.cardFirstRow}>
            {icon.lib === "MaterialIcons" ? (
              <MaterialIcons name={icon.name as any} size={28} color="black" />
            ) : (
              <MaterialCommunityIcons name={icon.name as any} size={28} color="black" />
            )}
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          </View>
          <View style={styles.cardSecondRow}>
            <Text style={styles.fileSize}>
              {item.size ? (item.size / (1024 * 1024)).toFixed(2) : "0.00"} MB
            </Text>
            <Text style={styles.time}>{item.downloaded.slice(0, 10)}</Text>
          </View>
        </Pressable>
        <MaterialIcons
          style={{ marginHorizontal: 12 }}
          name="delete"
          size={24}
          color="red"
          onPress={() => setSelectedFile(item)}
        />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.uri}
          ListFooterComponent={isLoading ? (
            <ActivityIndicator style={{ marginTop: 15 }} size="small" />
          ) : null}
          ListEmptyComponent={!isLoading ? (
            <View style={styles.emptyContainer}><Text>{t("No files downloaded yet!")}</Text></View>
          ) : null}
        />

        <Modal transparent visible={!!selectedFile} animationType="fade">
          <View style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("Are you sure?")}</Text>
              <View style={styles.buttonContainer}>
                <Button title={t("Cancel")} onPress={() => setSelectedFile(null)} />
                <Button 
                  title={t("Confirm")} 
                  color="red" 
                  onPress={() => selectedFile && deleteFile(selectedFile.fileName)} 
                />
              </View>
            </div>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
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
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});
