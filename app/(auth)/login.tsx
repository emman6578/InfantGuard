import {
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "@/libraries/API/auth/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    // Set loading state to true when the login starts
    setIsLoading(true);
    try {
      await login({ email });
      router.push({ pathname: "/authenticate", params: { email } });
    } catch (error: any) {
      Alert.alert("Error: " + error.message);
    } finally {
      // Reset loading state regardless of the outcome
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      <Stack screenOptions={{ title: "Login" }} />

      <View style={styles.content}>
        <Image
          source={require("../../public/app-logo.jpeg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to manage your child's vaccination schedule
        </Text>

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.disabledButton, // optional: visually indicate a disabled state
          ]}
          onPress={onLogin}
          disabled={isLoading} // disable button while loading
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Continue"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 32,
    alignItems: "center",
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
    marginBottom: 24,
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
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7, // Visual feedback to indicate the button is disabled
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
  signupText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 16,
  },
  signupLink: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});

export default Login;
