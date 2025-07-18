import {
  SafeAreaView,
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

export default function ResourceScreen() {
  const {id, title, img: rawId} = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [waitTime, setWaitTime] = useState(0);
  const [base64Image, setBase64Image] = useState("");
  const img = String(rawId);
  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (waitTime <= 0) return;

    const interval = setInterval(() => {
      setWaitTime((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [waitTime]);

  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const base64 = new File(img).base64();
        setBase64Image(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
      }
    };
    if (Platform.OS === "ios")
      convertToBase64();
    else
      setBase64Image(img);
  }, [img]);


  const fetchData = async (url: string) => {
    try {
      setIsLoading(true);
      let delay = 1000;
      let retries = 5;
      for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          setData(json);
          return;
        } else if (response.status === 429) {
          // const retryAfter = response.headers.get("Retry-After"); // server's retry-after is unreasonably high
          const retryAfter = "5";
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
          setWaitTime(waitTime);
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
    } finally {
      setIsLoading(false);
    }
  };


  const getData = () => {
    let url = Api.resourceApi + id;
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
  else if (error) {
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
    getData();
  };

  const Authors = ({ data }: { data: { authors: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.authors?.map((author) => (
          <Text style={styles.cardText} key={author.id}>{author.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };;

  const Levels = ({ data }: { data: { levels: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.levels?.map((level) => (
          <Text style={styles.cardText} key={level.id}>{level.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };

  const Subjects = ({ data }: { data: { subjects: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.subjects?.map((subject) => (
          <Text style={styles.cardText} key={subject.id}>{subject.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };

  const LearningResourceTypes = ({ data }: { data: { LearningResourceTypes: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.LearningResourceTypes?.map((resourceType) => (
          <Text style={styles.cardText} key={resourceType.id}>{resourceType.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };

  const Publishers = ({ data }: { data: { publishers: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.publishers?.map((publisher) => (
          <Text style={styles.cardText} key={publisher.id}>{publisher.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };

  const Translations = ({ data }: { data: { translations: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.translations?.map((translation) => {
          if (!(['en', 'fa', 'ps'].includes(translation.language))) return;
          let language = '';
          switch (translation.language) {
            case 'ps': {
              language = 'پشتو';
              break;
            }
            case 'fa': {
              language = 'فارسی';
              break;
            }
            default: {
              language = 'English';
              break;
            }
          }
          return(
            <Text style={styles.cardText} key={translation.id}>
              {language}
              {'\n'}
            </Text>
          );
        })}
      </Text>
    );
  };

  const CreativeCommons = ({ data }: { data: { CreativeCommons: any[] } }) => {
    return (
      <Text
        style={{
          textAlign: i18n.language !== "en" ? "right" : "left",
        }}
      >
        {data.CreativeCommons?.map((license) => (
          <Text style={styles.cardText} key={license.id}>{license.name}{'\n'}</Text>
        ))}
      </Text>
    );
  };

  const Attachments = ({ data }: { data: { attachments: any[] } }) => {
    let fileType = "book";
    const isPdf = data.attachments?.some(attachment => attachment.file_mime === "application/pdf");
    if (isPdf) {
      fileType = "file-pdf-box";
    }
    const isDoc = data.attachments?.some(attachment => attachment.file_mime === "application/msword");
    const isDocx = data.attachments?.some(attachment => attachment.file_mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    if (isDoc || isDocx) {
      fileType = "file-word-box";
    }
    const isAudio = data.attachments?.some(attachment => attachment.file_mime === "audio/mpeg");
    if (isAudio) {
      fileType = "audio-file";
    }
    return (
      <View
        style={{
          direction: i18n.language !== "en" ? "rtl" : "ltr",
        }}
      >
        {data.attachments?.length > 0 ? (
          data.attachments.map((attachment) => (
            <View
              key={attachment.id}
              style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
            >
              {fileType === "audio-file" ? (
                <MaterialIcons name="audio-file" size={28} color="black" />
              ) : (
                <MaterialCommunityIcons name={fileType} size={28} color="black" />
              )}
              <Pressable
                style={styles.fileButton}
                key={attachment.id}
                onPress={() => {
                  router.push({
                    pathname: "./file",
                    params: {
                      id: attachment.id,
                      title: title,
                    }
                  })
                }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                  <MaterialIcons name="remove-red-eye" size={20} color="white" />
                  <Text style={{
                    marginLeft: i18n.language !== "en" ? 0 : 8,
                    marginRight: i18n.language !== "en" ? 8 : 0,
                    color: "white",
                    textAlign: i18n.language !== "en" ? "right" : "left",
                  }}>
                    {t("View")}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.fileButton}
                key={"download_" + attachment.id}
                onPress={() => {
                  router.push({
                    pathname: "../downloads",
                    params: {
                      id: attachment.id,
                      title: title,
                    }
                  })
                }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                  <MaterialIcons name="download" size={20} color="white" />
                  <Text style={{
                    marginLeft: i18n.language !== "en" ? 0 : 8,
                    marginRight: i18n.language !== "en" ? 8 : 0,
                    color: "white",
                    textAlign: i18n.language !== "en" ? "right" : "left",
                  }}>
                    {t("Download")}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={{
            alignSelf: 'flex-start',
          }}>
            <Pressable
              style={styles.fileMissingButton}
              onPress={async () => {
                await WebBrowser.openBrowserAsync(Api.mainUrl + i18n.language + "/resource/" + id);
              }}
            >
              <View style={{
                flexDirection: "row",
              }}>
                <MaterialIcons name="link" size={20} color="white" />
                <Text style={{
                  marginLeft: i18n.language !== "en" ? 0 : 8,
                  marginRight: i18n.language !== "en" ? 8 : 0,
                  color: "white",
                  textAlign: i18n.language !== "en" ? "right" : "left",
                }}>
                  {t("View this resource in your browser")}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={{...(Platform.OS === "ios" && { marginBottom: 80 })}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refreshData();
            }}
          />
        }
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: base64Image || Api.mainUrl + "storage/files/placeholder_image.png" }} style={styles.coverPhoto} resizeMode="contain" />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
              fontSize: 17,
              fontWeight: "bold",
            }
          ]}>
            {title}
          </Text>
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Author")}{'\n'}
          </Text>
          <Authors data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Resource level")}{'\n'}
          </Text>
          <Levels data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Subject area")}{'\n'}
          </Text>
          <Subjects data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Learning resource type")}{'\n'}
          </Text>
          <LearningResourceTypes data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Publisher")}{'\n'}
          </Text>
          <Publishers data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Available in the following languages")}{'\n'}
          </Text>
          <Translations data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("License")}{'\n'}
          </Text>
          <CreativeCommons data={data} />
        </View>
        <View style={styles.cardView}>
          <Text style={[
            styles.cardTitle,
            {
              textAlign: i18n.language !== "en" ? "right" : "left",
            }
          ]}>
            {t("Resource files")}{'\n'}
          </Text>
          <Attachments data={data} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    height: 250,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    padding: 5,
    marginVertical: 10,
  },
  cardView: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  coverPhoto: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardText: {
    fontSize: 13,
    color: "#555555",
  },
  fileButton: {
    backgroundColor: 'rgba(156,108,31,1)',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom:10,
  },
  fileMissingButton: {
    backgroundColor: 'rgb(138,138,138)',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom:10,
  }
});
