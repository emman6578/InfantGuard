import {
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "@/libraries/API/auth/auth";

const Register = () => {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [contact_number, setContact_number] = useState("");
  const [purok, setPurok] = useState("");
  const [baranggay, setBaranggay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");

  const onRegister = async () => {
    try {
      await register({
        fullname,
        email,
        contact_number,
        address: { purok, baranggay, municipality, province },
      });
      router.push({ pathname: "/landingPage", params: { email } });
      Alert.alert("Registration Successful");
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      <Stack screenOptions={{ title: "Register" }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("../../public/app-logo.jpeg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>
          Register to manage your child's vaccination schedule
        </Text>

        <TextInput
          placeholder="Fullname"
          placeholderTextColor="#94a3b8"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Valid Contact Number"
          placeholderTextColor="#94a3b8"
          value={contact_number}
          onChangeText={setContact_number}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Purok"
          placeholderTextColor="#94a3b8"
          value={purok}
          onChangeText={setPurok}
          style={styles.input}
        />

        <TextInput
          placeholder="Baranggay"
          placeholderTextColor="#94a3b8"
          value={baranggay}
          onChangeText={setBaranggay}
          style={styles.input}
        />

        <TextInput
          placeholder="Municipality"
          placeholderTextColor="#94a3b8"
          value={municipality}
          onChangeText={setMunicipality}
          style={styles.input}
        />

        <TextInput
          placeholder="Province"
          placeholderTextColor="#94a3b8"
          value={province}
          onChangeText={setProvince}
          style={styles.input}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
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

export default Register;
