import React, { useState, useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";

export default function AddChild() {
  const { CreateChildInfo, UploadChildProfileImage, ParentInfo } =
    useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["parent"],
    queryFn: () => ParentInfo(),
  });

  // Form state values
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [fullname, setFullname] = useState("");
  // Instead of text inputs for month, day, year, we will use pickers
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [place_of_birth, setPlaceOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [mothers_name, setMothersName] = useState("");
  const [fathers_name, setFathersName] = useState("");
  const [health_center, setHealthCenter] = useState("");
  // Family number will now be a picker with values 1-10
  const [family_no, setFamilyNo] = useState("");

  // Set Mother's Name from parent data when available
  useEffect(() => {
    if (data && data.data && data.data.fullname) {
      setMothersName(data.data.fullname);
    }
  }, [data]);

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

  // Mutation for creating child info (updated to remove address params)
  const mutation = useMutation({
    mutationFn: (data: any) =>
      CreateChildInfo(
        data.fullname,
        data.birthday.month,
        data.birthday.day,
        data.birthday.year,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      Alert.alert("Success", "Image uploaded successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to upload image");
    },
  });

  const handleSubmit = () => {
    if (!fullname || !month || !day || !year) {
      Alert.alert("Error", "Please fill out all required fields");
      return;
    }

    // Create a date object from the inputs (note: month is zero-indexed)
    const birthdayDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10)
    );
    const currentDate = new Date();

    // Check if the birthday is in the future
    if (birthdayDate > currentDate) {
      Alert.alert("Error", "Birthday cannot be a future date");
      return;
    }

    const dataToSubmit = {
      fullname: fullname,
      birthday: {
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        year: parseInt(year, 10),
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

    mutation.mutate(dataToSubmit, {
      onSuccess: (result) => {
        const newInfantId = result?.data?.id;
        setId(newInfantId);
        if (image) {
          uploadMutation.mutate({
            id: newInfantId,
            imageUrl: image,
          });
        }
        router.replace("/");
      },
    });
  };

  return (
    <LinearGradient colors={["#ffffff", "#f7fdff"]} style={styles.container}>
      {/* Navigation header */}
      <Stack screenOptions={{ title: "Add Child" }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Optional header image */}
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

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Form Fields */}

        {/* Full Name - Allows only letters and spaces */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#94a3b8"
          value={fullname}
          onChangeText={(text) => setFullname(text.replace(/[^a-zA-Z\s]/g, ""))}
        />

        {/* Birthday Pickers */}
        <View style={styles.row}>
          {/* Month Picker: 1-12 */}
          <View style={styles.halfInput}>
            <Picker
              selectedValue={month}
              onValueChange={(value) => setMonth(value)}
              style={styles.picker}
            >
              <Picker.Item label="Month" value="" />
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <Picker.Item key={num} label={`${num}`} value={`${num}`} />
              ))}
            </Picker>
          </View>

          {/* Day Picker: 1-31 */}
          <View style={styles.halfInput}>
            <Picker
              selectedValue={day}
              onValueChange={(value) => setDay(value)}
              style={styles.picker}
            >
              <Picker.Item label="Day" value="" />
              {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                <Picker.Item key={num} label={`${num}`} value={`${num}`} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Year Picker: 2000-2025 */}
        <View style={styles.input}>
          <Picker
            selectedValue={year}
            onValueChange={(value) => setYear(value)}
            style={styles.picker}
          >
            <Picker.Item label="Year" value="" />
            {Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i).map(
              (num) => (
                <Picker.Item key={num} label={`${num}`} value={`${num}`} />
              )
            )}
          </Picker>
        </View>

        {/* Place of Birth - Allows only letters and spaces */}
        <TextInput
          style={styles.input}
          placeholder="Place of Birth"
          placeholderTextColor="#94a3b8"
          value={place_of_birth}
          onChangeText={(text) =>
            setPlaceOfBirth(text.replace(/[^a-zA-Z\s]/g, ""))
          }
        />

        {/* Height (cm) - Only numbers with up to 2 decimal places */}
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor="#94a3b8"
          value={height}
          onChangeText={(text) => {
            if (text === "" || /^\d*\.?\d{0,2}$/.test(text)) {
              setHeight(text);
            }
          }}
          keyboardType="numeric"
        />

        {/* Gender Picker */}
        <View style={styles.input}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        {/* Weight (kg) - Only numbers with up to 2 decimal places */}
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#94a3b8"
          value={weight}
          onChangeText={(text) => {
            if (text === "" || /^\d*\.?\d{0,2}$/.test(text)) {
              setWeight(text);
            }
          }}
          keyboardType="numeric"
        />

        {/* Mother's Name (Disabled & Defaulted) */}
        <TextInput
          style={styles.input}
          placeholder="Mother's Name"
          placeholderTextColor="#94a3b8"
          value={mothers_name}
          editable={false}
        />

        {/* Father's Name - Allows only letters and spaces */}
        <TextInput
          style={styles.input}
          placeholder="Father's Name"
          placeholderTextColor="#94a3b8"
          value={fathers_name}
          onChangeText={(text) =>
            setFathersName(text.replace(/[^a-zA-Z\s]/g, ""))
          }
        />

        {/* Health Center - Allows only letters and spaces */}
        <TextInput
          style={styles.input}
          placeholder="Health Center"
          placeholderTextColor="#94a3b8"
          value={health_center}
          onChangeText={(text) =>
            setHealthCenter(text.replace(/[^a-zA-Z\s]/g, ""))
          }
        />

        {/* Family Number Picker: 1-10 */}
        <View style={styles.input}>
          <Picker
            selectedValue={family_no}
            onValueChange={(value) => setFamilyNo(value)}
            style={styles.picker}
          >
            <Picker.Item label="Family Number" value="" />
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <Picker.Item key={num} label={`${num}`} value={`${num}`} />
            ))}
          </Picker>
        </View>

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
    backgroundColor: "#e3f2fd",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a365d",
    marginBottom: 8,
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
    justifyContent: "center",
  },
  halfInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginRight: 8,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  picker: {
    width: "100%",
    height: 56,
    color: "#1a365d",
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
