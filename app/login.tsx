import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView, Platform
} from "react-native";
import {Link, router} from "expo-router";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {useSession} from "@/context/AuthContext";
import * as Device from 'expo-device';
import Api from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";

export default function LoginScreen() {
  const {t} = useTranslation();
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null|string>(null);

  if (isLoading) {
    return (
      <View
        style={{flex: 1, alignItems: "center", padding: 0, paddingTop: 15}}
      >
        <ActivityIndicator animating size={"large"}/>
      </View>
    )
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submitForm = () => {
    let formData = new FormData();
    let modelName = Device.modelName ? Device.modelName : "";
    if (email === "" || password === "") {
      setError(t("Email or password cannot be empty"));
      return;
    }
    if (validateEmail(email))
      formData.append("email", email);
    else {
      setError(t("Invalid email format"))
      return;
    }
    formData.append("password", password);
    formData.append("device_name", modelName);

    fetch(Api.LoginUrl, {
      method: "POST",
      body: formData,
      headers: new Headers({
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      }),
    })
    .then((data) => data.json())
    .then(async (res) => {
      if (res.message) {
        console.warn(res.message);
        setError(res.message);
      } else if (res.user) {
        signIn(res.token);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("username", res.user);
        router.replace("./(tabs)");
      }
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{flex: 1,}}>
        <Link
          href="./(tabs)"
          style={{
            textAlign: i18n.language !== "en" ? "left" : "right",
            padding: 15,
            fontWeight: "bold",
          }}
        >
          {t("Skip")}
        </Link>
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems:"center", marginTop: 100 }}>
          <Image style={styles.ddlLogo} source={require('@/assets/images/dd-library-logo-color.png')} />
          <Text
            style={{
              marginBottom: 15,
            }}
          >
            {t("Login with your DDL account")}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t("Email")}
              style={[
                styles.input,
                {
                  textAlign: i18n.language !== "en" ? "right" : "left",
                }
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text: string) => setEmail(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t("Password")}
              secureTextEntry={true}
              style={[
                styles.input,
                {
                  textAlign: i18n.language !== "en" ? "right" : "left",
                }
              ]}
              onChangeText={(text: string) => setPassword(text)}
            />
          </View >
          {error && (
            <Text
              style={{
                color: "#ff0101",
                fontWeight: "bold",
                marginBottom: 20
            }}>
              {error}
            </Text>
          )}
          <Button
            title={t("Sign In")}
            color={"#ffa800"}
            onPress={() => submitForm()}
          />
          <Text style={{ marginTop: 20 }}>{t("Don't have an account?")}</Text>
          <Link replace href={"./register"} style={{ fontWeight: "bold" }}>{t("Register")}</Link>
          <View style={{ flex : 1 }} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  ddlLogo: {
    height: 100,
    width: 250,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginHorizontal: 30,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333",
  },
});
