import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/context/useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "@/constants/Api";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: "null",
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          // since registration also signs in a user, we are using login.tsx and register.tsx for the sign in logic
          // ideally, it should happen here
          setSession(token);
        },
        signOut: async () => {
          let token = await SecureStore.getItemAsync("session");
          if (token) {
            fetch(Api.LogoutUrl, {
              method: "POST",
              headers: new Headers({
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + token,
              }),
            })
            .then((data) => data.json())
            .then(async (res) => {
              if (res.message) {
                await AsyncStorage.removeItem("email");
                await AsyncStorage.removeItem("password");
                setSession(null);
              }
            });
          }
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
