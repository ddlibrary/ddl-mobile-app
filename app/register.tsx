import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import {useTranslation} from "react-i18next";
import {Link, router} from "expo-router";
import * as Linking from "expo-linking";
import React, {useState} from "react";
import {useSession} from "@/context/AuthContext";
import Api from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";

export default function RegisterScreen() {
  const {t, i18n} = useTranslation();
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

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&.]).{8,}$/.test(password);
  };

  const submitForm = () => {
    let formData = new FormData();
    if (email === "" || password === "") {
      setError(t("All fields are required"));
      return;
    }
    if (validateEmail(email))
      formData.append("email", email);
    else {
      setError(t("Invalid email format"))
      return;
    }
    if (validatePassword(password))
      formData.append("password", password);
    else {
      setError("Password must be at least 8 characters long, contain a number, and a special character (!@#$%^&.)");
      return;
    }
    console.log("All checks passed")
    fetch(Api.SignUpUrl, {
      method: "POST",
      body: formData,
      headers: new Headers({
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      }),
    })
    .then((data) => data.json())
    .then(async (res) => {
      if (res.message) setError(res.message);
      else if (res.email) setError(res.email);
      else if (res.user) {
        signIn(res.token);
        console.log(res.user);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("user", res.user);
        Alert.alert(t("Welcome!"), t("Your account has been created successfully."), [
          {
            text: t("Activate your account now"),
            onPress: () => {
              Linking.openURL(Api.mainUrl + i18n.language + "/email/verify");
              router.replace("./(tabs)");
            },
          },
          {
            text: t("Later"),
            onPress: () => router.replace("./(tabs)"),
            style: 'cancel',
          },
        ]);

      }
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaProvider>
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
              {t("Create an account on DDL")}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t("Email")}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    textAlign: i18n.language !== "en" ? "right" : "left",
                  }
                ]}
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
            </View>
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
              title={t("Register")}
              color={"#ffa800"}
              onPress={() => submitForm()}
            />
            <Text style={{ marginTop: 20 }}>{t("Already have an account?")}</Text>
            <Link replace href={"./login"} style={{ fontWeight: "bold" }}>{t("Sign In")}</Link>
            <View style={{ flex : 1 }} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
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
