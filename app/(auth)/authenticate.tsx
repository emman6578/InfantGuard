import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { authenticate } from "@/libraries/API/auth/auth";
import { useAuth } from "@/Context/AuthContext";

const Authenticate = () => {
  const [code, setCode] = useState("");
  const { email } = useLocalSearchParams();
  const { updateAuthToken } = useAuth();
  const router = useRouter();

  const onConfirm = async () => {
    if (typeof email !== "string") return;

    try {
      const res = await authenticate({ email, emailToken: code });
      updateAuthToken(res.authToken);
      // Optionally, navigate to your landing/main screen after successful authentication
      router.push("/landingPage");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      <Stack screenOptions={{ title: "Confirm" }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("../../public/app-logo.jpeg")}
          style={styles.logo}
        />
        <Text style={styles.title}>Confirm Your Account</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to{" "}
          <Text style={{ fontWeight: "600" }}>{email}</Text> to confirm your
          account.
        </Text>
        <TextInput
          placeholder="Enter Code"
          placeholderTextColor="#94a3b8"
          value={code}
          onChangeText={setCode}
          style={styles.input}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onConfirm}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: "#e3f2fd", // Fallback color
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a365d",
    marginBottom: 8,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a365d",
    backgroundColor: "white",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Authenticate;
