import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  View,
  SafeAreaView,
  Pressable,
  Text, RefreshControl, TextInput, Platform
} from 'react-native';
import i18n, {t} from "i18next";
import React, {useEffect, useState} from "react";
import Api from "@/constants/Api";
import {router,useLocalSearchParams} from "expo-router";
import RenderCard from "@/components/LibraryCards";
import {Ionicons} from "@expo/vector-icons";

export default function libraryScreen() {
  const { type, catId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    getData();
  }, [catId]);

  useEffect(() => {
    if (waitTime <= 0) return;

    const interval = setInterval(() => {
      setWaitTime((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [waitTime]);

  const fetchData = async (url: string) => {
    let accumulatedData: any[] = [];
    try {
      console.log("filter string: " + url);
      let delay = 1000;
      let retries = 5;
      for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          console.log("response received")
          accumulatedData.push(...json);
          break;
        } else if (response.status === 429) {
          // const retryAfter = response.headers.get("Retry-After"); // server's retry-after is unreasonably high
          const retryAfter = "5";
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
          setWaitTime(waitTime);
          console.warn(`429 Too Many Requests. Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          delay *= 2;
        } else {
          break;
        }
      }
    } catch (error) {
      setError(error);
      console.error("Error fetching data:", error);
      setIsLoading(false)
      setIsMoreLoading(false);
    } finally {
      setData((prevData) => [...prevData, ...accumulatedData]);
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const getData = (text = "", nextOffset = 0 ) => {
    let url =
      Api.resourcesApi + i18n.language + "/" + nextOffset + "?search=" + encodeURI(text) + (text ? "" : (type ? `&${type}=${catId}` : ""));
    fetchData(url);
  };


  if (isLoading) {
    return (
      <View
        style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
      >
        <ActivityIndicator animating size={"large"}/>
        {waitTime > 0 ?
          (<Text>{t("server_busy_retrying", {waitTime: waitTime/1000})}</Text>)
          : (<Text>{t("loading_with_periods")}</Text>)
        }
      </View>
    )
  }

  if (error) {
    setError(null);
    return (
      <View
        style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
      >
        <Text>{t("Error fetching data.")}</Text>
      </View>
    )
  }

  const refreshData = () => {
    setData([]);
    setSearchQuery("");
    setError(null);
    setIsLoading(true);
    setOffset(0);
    getData();
    router.replace("./library")
  };

  const getMoreData = () => {
    const nextOffset = offset + 32;
    setOffset(offset + 32);
    setIsMoreLoading(true);
    getData(undefined, nextOffset);
  };

  const loadMoreData = () => {
    if (isMoreLoading) {
      return (
        <View
          style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
        >
          <ActivityIndicator animating size={"small"}/>
        </View>
      );
    }
    else if (!searchQuery)
      return (
        <View style={styles.footerContainer}>
          <Pressable onPress={getMoreData}>
            <Text style={styles.linkText}>{t("Load more")}</Text>
          </Pressable>
        </View>
      );
  }

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={t("search_our_library_with_periods")}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={(event) => {
            setOffset(0);
            setIsLoading(true);
            setData([]);
            getData(event.nativeEvent.text);
            console.log("Search submitted:", searchQuery);
          }}
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        style={styles.container}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => (
          <RenderCard item={item.item} />
        )}
        numColumns={2}
        ListFooterComponent={loadMoreData}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refreshData();
            }}
          />
        }
      />
    </SafeAreaView>
  )
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
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  container: {
    marginBottom: 60,
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
  }
});
