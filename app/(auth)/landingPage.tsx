import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const LandingPage = () => {
  const router = useRouter();

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <Image
          source={require("../../public/app-logo.jpeg")}
          style={styles.logo}
        />

        {/* Hero Text */}
        <Text style={styles.title}>Safeguarding Your Little One's Future</Text>
        <Text style={styles.subtitle}>
          Track immunizations, receive reminders, and ensure your baby's health
          journey stays on schedule with our intuitive platform.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonTextPrimary}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.buttonTextSecondary}>Create Account</Text>
          </Pressable>
        </View>

        {/* Additional Info */}
        <Text style={styles.securityText}>
          🔒 Protected and Secured OTP (One-Time-Password)
        </Text>
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
    borderRadius: 24,
    marginBottom: 40,
    backgroundColor: "#e3f2fd", // Fallback color
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a365d",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 16,
    fontFamily: "Inter_700Bold", // Use your preferred font family
  },
  subtitle: {
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonTextPrimary: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: "#1e40af",
    fontWeight: "600",
    fontSize: 16,
  },
  securityText: {
    marginTop: 32,
    color: "#718096",
    fontSize: 12,
    letterSpacing: 0.4,
  },
});

export default LandingPage;
