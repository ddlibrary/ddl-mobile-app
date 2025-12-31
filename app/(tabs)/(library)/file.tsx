import {useLocalSearchParams, useNavigation} from "expo-router";
import Api from "@/constants/Api"
import WebView from "react-native-webview";
import React, {useLayoutEffect} from "react";
import {ActivityIndicator, View} from "react-native";

export default function FileViewScreen () {
  const navigation = useNavigation();
  const {id, title} = useLocalSearchParams();
  const uri = Api.fileApi + id;

  const isLoading = () => {
    return (
      <View
        style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
      >
        <ActivityIndicator animating size={"large"}/>
      </View>
    )
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [navigation, title]);

  return <WebView
    startInLoadingState={true}
    source={{ uri: `https://docs.google.com/gview?embedded=true&url=${uri}` }}
    style={{ flex: 1 }}
    renderLoading={isLoading}
  />;
}

