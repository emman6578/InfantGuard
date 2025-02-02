import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";

export default function AddChild() {
  const { CreateChildInfo, UploadChildProfileImage } = useProtectedRoutesApi();

  const queryClient = useQueryClient();
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [fullname, setFullname] = useState("Emman Mota");
  const [month, setMonth] = useState("12");
  const [day, setDay] = useState("30");
  const [year, setYear] = useState("2024");
  const [purok, setPurok] = useState("Purok 2");
  const [baranggay, setBaranggay] = useState("Calzada");
  const [municipality, setMunicipality] = useState("Guinobatan");
  const [province, setProvince] = useState("Albay");
  const [place_of_birth, setPlaceOfBirth] = useState("Guinobatan");
  const [height, setHeight] = useState("167");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("5");
  const [mothers_name, setMothersName] = useState("Rose");
  const [fathers_name, setFathersName] = useState("Henry");
  const [health_center, setHealthCenter] = useState("Guinobatan");
  const [family_no, setFamilyNo] = useState("2");

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
      // Access the ID of the newly created infant
      const newInfantId = result?.data?.id;
      console.log(newInfantId);
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      setId(newInfantId);
      Alert.alert(
        "Success",
        `Child information added successfully! ID: ${newInfantId}`
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to add child information");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (data: any) => UploadChildProfileImage(data.id, data.imageUrl),
    onSuccess: (result) => {
      // Access the ID of the newly created infant
      const imgLink = result?.data;
      console.log(imgLink);
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      Alert.alert(
        "Success",
        `Child information added successfully! ID: ${imgLink}`
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to add child information");
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
        setId(newInfantId); // Save the ID in state
        console.log(newInfantId);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Child</Text>

      <Button title="Pick Image" onPress={pickImage} />
      {image && <Text style={styles.imageText}>Selected Image: {image}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Month (MM)"
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Day (DD)"
        value={day}
        onChangeText={setDay}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Year (YYYY)"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Purok"
        value={purok}
        onChangeText={setPurok}
      />
      <TextInput
        style={styles.input}
        placeholder="Baranggay"
        value={baranggay}
        onChangeText={setBaranggay}
      />
      <TextInput
        style={styles.input}
        placeholder="Municipality"
        value={municipality}
        onChangeText={setMunicipality}
      />
      <TextInput
        style={styles.input}
        placeholder="Province"
        value={province}
        onChangeText={setProvince}
      />
      <TextInput
        style={styles.input}
        placeholder="Place of Birth"
        value={place_of_birth}
        onChangeText={setPlaceOfBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mother's Name"
        value={mothers_name}
        onChangeText={setMothersName}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Name"
        value={fathers_name}
        onChangeText={setFathersName}
      />
      <TextInput
        style={styles.input}
        placeholder="Health Center"
        value={health_center}
        onChangeText={setHealthCenter}
      />
      <TextInput
        style={styles.input}
        placeholder="Family Number"
        value={family_no}
        onChangeText={setFamilyNo}
        keyboardType="numeric"
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  imageText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
});
