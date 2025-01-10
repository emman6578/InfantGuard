import { useAuth } from "@/Context/AuthContext";
import { deleteToken } from "@/libraries/Secure Store/expoSecureStore";
import { router, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

const LogoutBtn = () => {
  const router = useRouter();
  const { updateAuthToken } = useAuth();

  const logout = async () => {
    await deleteToken();
    await updateAuthToken(null);
    router.replace("/login");
  };

  return (
    <Pressable
      style={{ padding: 10, backgroundColor: "red", borderRadius: 10 }}
      onPress={logout}
    >
      <Text>Logout Button</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default LogoutBtn;
function updateAuthToken(arg0: null) {
  throw new Error("Function not implemented.");
}
