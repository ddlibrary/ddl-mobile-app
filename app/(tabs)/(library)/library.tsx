import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  View,
  Pressable,
  Text, RefreshControl, TextInput, Platform
} from 'react-native';
import i18n, {t} from "i18next";
import React, {useEffect, useState, useCallback} from "react";
import Api from "@/constants/Api";
import {useLocalSearchParams} from "expo-router";
import RenderCard from "@/components/LibraryCards";
import {Ionicons} from "@expo/vector-icons";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function LibraryScreen() {
  const { type, catId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [waitTime, setWaitTime] = useState(0);

  const isRTL = i18n.language !== "en";

  const fetchData = useCallback(async (url: string, append = false) => {
    try {
      const retries = 5;
      
      for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          setData(prev => append ? [...prev, ...json] : json);
          return;
        } 
        
        if (response.status === 429) {
          const wait = 5000;
          setWaitTime(wait);
          await new Promise((resolve) => setTimeout(resolve, wait));
        } else {
          break;
        }
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, []);

  const getData = useCallback((text = searchQuery, nextOffset = 0) => {
    const isSearch = !!text;
    const baseUrl = Api.resourcesApi + i18n.language + "/" + nextOffset;
    const queryParams = isSearch 
      ? `?search=${encodeURIComponent(text)}`
      : `?${type ? `${type}=${catId}` : ""}`;
    
    fetchData(baseUrl + queryParams, nextOffset > 0);
  }, [catId, type, searchQuery, fetchData]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    setSearchQuery("");
    setOffset(0);
    getData("", 0);
  }, [catId, getData]);

  useEffect(() => {
    if (waitTime <= 0) return;
    const interval = setInterval(() => {
      setWaitTime((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [waitTime]);

  const refreshData = () => {
    setError(null);
    setIsLoading(true);
    setOffset(0);
    setSearchQuery("");
    getData("", 0);
  };

  const getMoreData = () => {
    const nextOffset = offset + 32;
    setOffset(nextOffset);
    setIsMoreLoading(true);
    getData(searchQuery, nextOffset);
  };

  const renderFooter = () => {
    if (isMoreLoading) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!searchQuery && data.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Pressable onPress={getMoreData}>
            <Text style={styles.linkText}>{t("Load more")}</Text>
          </Pressable>
        </View>
      );
    }
    return null;
  };

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>
          {waitTime > 0 ? t("server_busy_retrying", { waitTime: waitTime / 1000 }) : t("loading_with_periods")}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.parentContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.searchBar, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color="#888" 
            style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} 
          />
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            placeholder={t("search_our_library_with_periods")}
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              setOffset(0);
              setIsLoading(true);
              getData(searchQuery, 0);
            }}
            clearButtonMode="always"
            autoCapitalize="none"
          />
        </View>

        <FlatList
          style={styles.container}
          data={data}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <RenderCard item={item} />}
          numColumns={2}
          ListFooterComponent={renderFooter}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} />}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContent}>
                <Text>{t("No match found.")}</Text>
              </View>
            ) : null
          }
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 45,
    marginVertical: 8,
    ...(Platform.OS === "ios" && { marginHorizontal: 5 }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
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
    fontSize: 10,
  },
  cardImage: {
    height: 100,
    width: 100,
    resizeMode: "stretch",
  },
  footerContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  linkText: {
    color: "#23b3ff",
    textDecorationLine: "underline",
    fontSize: 12,
  },
  emptyContent: {
    alignItems: "center",
    marginVertical: 10,
  }
});
