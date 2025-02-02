import {
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Text,
  View,
} from "react-native";

import React, { useState } from "react";

import { Stack, useRouter } from "expo-router";
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
    console.log("Login Button Pressed");

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
    <View style={styles.container}>
      <Stack screenOptions={{ title: "Login" }} />
      <View style={styles.containerSignIn}>
        <Text style={styles.label}>Register an account...</Text>

        <TextInput
          placeholder="Fullname"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Valid Contact Number"
          value={contact_number}
          onChangeText={setContact_number}
          style={styles.input}
        />

        <View>
          <Text>Address:</Text>
        </View>

        <TextInput
          placeholder="Purok"
          value={purok}
          onChangeText={setPurok}
          style={styles.input}
        />

        <TextInput
          placeholder="Baranggay"
          value={baranggay}
          onChangeText={setBaranggay}
          style={styles.input}
        />

        <TextInput
          placeholder="Municipality"
          value={municipality}
          onChangeText={setMunicipality}
          style={styles.input}
        />

        <TextInput
          placeholder="Province"
          value={province}
          onChangeText={setProvince}
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  containerSignIn: { backgroundColor: "white", padding: 10, borderRadius: 15 },
  label: {
    color: "black",
    fontSize: 24,
    marginVertical: 5,
  },
  error: {
    marginVertical: 5,
    color: "red",
  },
  input: {
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    fontSize: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#050A12",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Register;
