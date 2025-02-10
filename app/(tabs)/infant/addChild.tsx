import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";

export default function AddChild() {
  const { CreateChildInfo, UploadChildProfileImage } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  // Form state values with empty default values
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [fullname, setFullname] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [purok, setPurok] = useState("");
  const [baranggay, setBaranggay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [place_of_birth, setPlaceOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [mothers_name, setMothersName] = useState("");
  const [fathers_name, setFathersName] = useState("");
  const [health_center, setHealthCenter] = useState("");
  const [family_no, setFamilyNo] = useState("");

  // Image Picker handler
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Mutation for creating child info
  const mutation = useMutation({
    mutationFn: (data: any) =>
      CreateChildInfo(
        data.fullname,
        data.birthday.month,
        data.birthday.day,
        data.birthday.year,
        data.address.purok,
        data.address.baranggay,
        data.address.municipality,
        data.address.province,
        data.place_of_birth,
        data.height,
        data.gender,
        data.weight,
        data.mothers_name,
        data.fathers_name,
        data.health_center,
        data.family_no
      ),
    onSuccess: (result) => {
      const newInfantId = result?.data?.id;
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      setId(newInfantId);
      Alert.alert(
        "Success",
        `Child information added successfully! ID: ${newInfantId}`
      );
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to add child information");
    },
  });

  // Mutation for uploading child profile image
  const uploadMutation = useMutation({
    mutationFn: (data: any) => UploadChildProfileImage(data.id, data.imageUrl),
    onSuccess: (result) => {
      const imgLink = result?.data;
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      Alert.alert("Success", `Image uploaded successfully!`);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to upload image");
    },
  });

  const handleSubmit = () => {
    if (
      !fullname ||
      !month ||
      !day ||
      !year ||
      !purok ||
      !baranggay ||
      !municipality ||
      !province
    ) {
      Alert.alert("Error", "Please fill out all required fields");
      return;
    }

    const data = {
      fullname: fullname,
      birthday: {
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        year: parseInt(year, 10),
      },
      address: {
        purok: purok,
        baranggay: baranggay,
        municipality: municipality,
        province: province,
      },
      place_of_birth: place_of_birth,
      height: parseFloat(height),
      gender: gender,
      weight: parseFloat(weight),
      mothers_name: mothers_name,
      fathers_name: fathers_name,
      health_center: health_center,
      family_no: parseInt(family_no, 10),
    };

    mutation.mutate(data, {
      onSuccess: (result) => {
        const newInfantId = result?.data?.id;
        setId(newInfantId);
        if (image) {
          uploadMutation.mutate({
            id: newInfantId,
            imageUrl: image,
          });
        }
      },
    });
  };

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      {/* Navigation header */}
      <Stack screenOptions={{ title: "Add Child" }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Optional header image can be placed here */}
        <Image
          source={require("../../../public/app-logo.jpeg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Add Child</Text>
        <Text style={styles.subtitle}>
          Enter your child's details to add them to the system
        </Text>

        {/* Image Picker Section */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>
            {image ? "Change Image" : "Pick Image"}
          </Text>
        </Pressable>

        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : null}

        {/* Form Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#94a3b8"
          value={fullname}
          onChangeText={setFullname}
        />

        <TextInput
          style={styles.input}
          placeholder="Month (MM)"
          placeholderTextColor="#94a3b8"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Day (DD)"
          placeholderTextColor="#94a3b8"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Year (YYYY)"
          placeholderTextColor="#94a3b8"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Purok"
          placeholderTextColor="#94a3b8"
          value={purok}
          onChangeText={setPurok}
        />

        <TextInput
          style={styles.input}
          placeholder="Baranggay"
          placeholderTextColor="#94a3b8"
          value={baranggay}
          onChangeText={setBaranggay}
        />

        <TextInput
          style={styles.input}
          placeholder="Municipality"
          placeholderTextColor="#94a3b8"
          value={municipality}
          onChangeText={setMunicipality}
        />

        <TextInput
          style={styles.input}
          placeholder="Province"
          placeholderTextColor="#94a3b8"
          value={province}
          onChangeText={setProvince}
        />

        <TextInput
          style={styles.input}
          placeholder="Place of Birth"
          placeholderTextColor="#94a3b8"
          value={place_of_birth}
          onChangeText={setPlaceOfBirth}
        />

        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor="#94a3b8"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          placeholderTextColor="#94a3b8"
          value={gender}
          onChangeText={setGender}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#94a3b8"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Mother's Name"
          placeholderTextColor="#94a3b8"
          value={mothers_name}
          onChangeText={setMothersName}
        />

        <TextInput
          style={styles.input}
          placeholder="Father's Name"
          placeholderTextColor="#94a3b8"
          value={fathers_name}
          onChangeText={setFathersName}
        />

        <TextInput
          style={styles.input}
          placeholder="Health Center"
          placeholderTextColor="#94a3b8"
          value={health_center}
          onChangeText={setHealthCenter}
        />

        <TextInput
          style={styles.input}
          placeholder="Family Number"
          placeholderTextColor="#94a3b8"
          value={family_no}
          onChangeText={setFamilyNo}
          keyboardType="numeric"
        />

        {/* Submit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

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
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
});
