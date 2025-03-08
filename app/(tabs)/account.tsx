import {View, Text, Button, StyleSheet, Pressable, SafeAreaView, Modal, TextInput} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import {Link, Redirect, router, useFocusEffect} from "expo-router";
import {useSession} from "@/context/AuthContext";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import i18n from "i18next";
import Api from "@/constants/Api";
import {HelloWave} from "@/components/HelloWave";

export default function Page() {
  const {t} = useTranslation();
  const { signOut } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("username");
      const user_email = await AsyncStorage.getItem("email");
      if (user) setUsername(user);
      if (user_email) setEmail(user_email);
    };
    fetchUser();
  }, []);

  const deleteUser = async () => {
    let token = await SecureStore.getItemAsync("session");
    if (token) {
      fetch(Api.DeleteAccountUrl, {
        method: "POST",
        headers: new Headers({
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token,
        }),
      })
      .then((data) => data.json())
      .then((res) => {
        if (res.message) {
          console.warn(res.message);
          signOut();
          router.replace("../");
        }
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, direction: i18n.language != "en" ? "rtl" : "ltr"}}>
        <View
          style={[
            styles.infoContainer,
            {
              marginLeft: i18n.language != "en" ? 0 : 20,
              marginRight: i18n.language != "en" ? 20 : 0,
            }
          ]}>
          <MaterialIcons name="person" size={48} color="black" />
          <View style={{
            marginLeft: i18n.language != "en" ? 0 : 20,
            marginRight: i18n.language != "en" ? 20 : 0,

          }}>
            <View
              style={{
                  flexDirection: "row",
              }}>
              <Text
                style={[
                  styles.welcomeText,
                  {
                    marginLeft: i18n.language != "en" ? 5 : 0,
                    marginRight: i18n.language != "en" ? 0 : 5,
                  }
                ]}>
                {t("Hello {{username}}", { username })}
              </Text>
              <HelloWave />
            </View>
            <Text style={styles.emailText}>
              {email}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Pressable style={styles.listContainer} onPress={() => router.push("../downloads")}>
          <View style={styles.leftContainer}>
            <MaterialCommunityIcons name="download-box-outline" size={24} color="black" />
            <Text>
              {t("downloads")}
            </Text>
          </View>
          {
            i18n.language != "en" ?
              <MaterialIcons name="keyboard-arrow-left" style={{ }} size={16} color="black" /> :
              <MaterialIcons name="keyboard-arrow-right" style={{ }} size={16} color="black" />
          }
        </Pressable>
        <Pressable style={styles.listContainer} onPress={() => router.push("../languages")}>
          <View style={styles.leftContainer}>
            <MaterialIcons name="language" size={24} color="black" />
            <Text>
              {t("Languages")}
            </Text>
          </View>
          {
            i18n.language != "en" ?
            <MaterialIcons name="keyboard-arrow-left" style={{ }} size={16} color="black" /> :
            <MaterialIcons name="keyboard-arrow-right" style={{ }} size={16} color="black" />
          }
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.listContainer} onPress={() => signOut()}>
          <View style={styles.leftContainer}>
            <MaterialIcons name="logout" size={24} color="black" />
            <Text>
              {t("Logout")}
            </Text>
          </View>
          {
            i18n.language != "en" ?
              <MaterialIcons name="keyboard-arrow-left" style={{ }} size={16} color="black" /> :
              <MaterialIcons name="keyboard-arrow-right" style={{ }} size={16} color="black" />
          }
        </Pressable>
      </View>
      <View style={styles.actionContainer}>
        <Button title={t("Delete your account")} onPress={() => setModalVisible(true)} color={"#b11818"}/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("Confirm Deletion")}</Text>
              <Text style={styles.modalText}>{t("Type DELETE to confirm account deletion. This action is irreversible.")}</Text>
              {
                deleteConfirm ? <Text style={styles.modalErrorText}>{deleteConfirm}</Text> : null
              }
              <TextInput
                style={styles.input}
                placeholder={t("Type DELETE")}
                value={inputText}
                onChangeText={setInputText}
                autoCapitalize="none"
              />
              <View style={styles.buttonContainer}>
                <Button title={t("Cancel")} onPress={() => {
                  setModalVisible(false);
                  setDeleteConfirm("");
                }} />
                <Button title={t("Confirm")} color="red" onPress={() => {
                  if (inputText === "DELETE") deleteUser();
                  else {
                    setDeleteConfirm(t("Value mismatch. Please enter 'DELETE' in all caps."));
                  }
                }} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "gray",
    marginVertical: 20,
    alignSelf: "center",
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 70,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 13,
    color: "#5c5c5c",
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  modalErrorText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#b11818",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
})
