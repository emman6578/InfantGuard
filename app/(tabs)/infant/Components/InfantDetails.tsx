import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/libraries/API/config/config";

const InfantDetails = ({ infant, percentage }: any) => {
  const queryClient = useQueryClient();
  const { GetFilesFromServer, updateInfant } = useProtectedRoutesApi();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // For downloading vaccination form
  const { data, isLoading: filesLoading } = useQuery({
    queryKey: ["files"],
    queryFn: GetFilesFromServer,
  });

  // Filter to only show the file matching the infant ID (ex: "id.pdf")
  const filteredFiles = data?.files.filter(
    (file: string) => file === `${infant.id}.pdf`
  );

  const handleDownload = () => {
    const downloadUrl = `${API_URL}/admin/download/${infant.id}.pdf`;
    Linking.openURL(downloadUrl).catch((err) =>
      console.error("Failed to open URL: ", err)
    );
  };

  // -------------------- Edit Functionality --------------------
  // Form fields for editing (initialized when edit modal opens)
  const [editFullname, setEditFullname] = useState("");
  const [editPlaceOfBirth, setEditPlaceOfBirth] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editHealthCenter, setEditHealthCenter] = useState("");
  const [editFamilyNo, setEditFamilyNo] = useState("");

  // When the edit modal opens, prefill fields with current infant data
  useEffect(() => {
    if (editModalVisible && infant) {
      setEditFullname(infant.fullname || "");
      setEditPlaceOfBirth(infant.place_of_birth || "");
      setEditHeight(infant.height ? infant.height.toString() : "");
      setEditGender(infant.gender || "");
      setEditWeight(infant.weight ? infant.weight.toString() : "");
      setEditHealthCenter(infant.health_center || "");
      // Convert family_no to a string for the TextInput
      setEditFamilyNo(infant.family_no ? infant.family_no.toString() : "");
    }
  }, [editModalVisible, infant]);

  // Mutation for updating infant details
  const updateInfantMutation = useMutation({
    mutationFn: (data: any) => updateInfant(data, infant.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infant", infant.id] });
      queryClient.invalidateQueries({ queryKey: ["schedule", infant.id] });
      queryClient.invalidateQueries({ queryKey: ["progress", infant.id] });
      Alert.alert("Success", "Infant details updated successfully.");
      setEditModalVisible(false);
      // Optionally, you can trigger a refetch of the infant data here.
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to update infant details.");
    },
  });

  const handleUpdateInfant = () => {
    const data: any = {};
    if (editFullname) data.fullname = editFullname;
    if (editPlaceOfBirth) data.place_of_birth = editPlaceOfBirth;
    if (editHeight && !isNaN(parseFloat(editHeight)))
      data.height = parseFloat(editHeight);
    if (editGender) data.gender = editGender;
    if (editWeight && !isNaN(parseFloat(editWeight)))
      data.weight = parseFloat(editWeight);
    if (editHealthCenter) data.health_center = editHealthCenter;
    // Convert Family No to a number (if provided and valid)
    if (editFamilyNo && !isNaN(parseInt(editFamilyNo)))
      data.family_no = parseInt(editFamilyNo);

    // Remove any keys with empty values
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    });

    if (Object.keys(data).length === 0) {
      Alert.alert("Error", "Please provide at least one value to update.");
      return;
    }

    updateInfantMutation.mutate(data);
  };
  // -------------------------------------------------------------

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../public/babybg.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{infant?.fullname}</Text>
            <View style={styles.separator} />
            <View style={styles.infoColumns}>
              {/* Left Column: Birthday and Height */}
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Entypo
                    name="cake"
                    size={20}
                    color="red"
                    style={[styles.icon, { marginLeft: -5 }]}
                  />
                  <Text style={[styles.infoText, { marginLeft: -5 }]}>
                    {infant?.birthday.month}/{infant?.birthday.day}/
                    {infant?.birthday.year}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5
                    name="ruler-vertical"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>{infant?.height} cm</Text>
                </View>
              </View>

              {/* Right Column: Gender and Weight */}
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  {infant?.gender === "Male" ? (
                    <MaterialIcons
                      name="man"
                      size={20}
                      color="blue"
                      style={styles.icon}
                    />
                  ) : (
                    <MaterialIcons
                      name="woman"
                      size={20}
                      color="pink"
                      style={styles.icon}
                    />
                  )}
                  <Text style={styles.infoText}>{infant?.gender}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5
                    name="weight"
                    size={20}
                    color="black"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>{infant?.weight} kg</Text>
                </View>
              </View>
            </View>

            <Text style={styles.info}>Vaccine Progress: {percentage}%</Text>
          </View>

          {infant?.image && (
            <Image source={{ uri: infant?.image }} style={styles.image} />
          )}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setProfileModalVisible(true)}
        >
          <Text style={styles.buttonText}>View Full Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilesModalVisible(true)}
        >
          <Text style={styles.buttonText}>Check Vaccination Form</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Full Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Full Profile</Text>
              <Text style={styles.modalInfo}>Height: {infant?.height} cm</Text>
              <Text style={styles.modalInfo}>Gender: {infant?.gender}</Text>
              <Text style={styles.modalInfo}>Weight: {infant?.weight} kg</Text>
              <Text style={styles.modalInfo}>
                Mother's Name: {infant?.mothers_name}
              </Text>
              <Text style={styles.modalInfo}>
                Father's Name: {infant?.fathers_name}
              </Text>
              <Text style={styles.modalInfo}>
                Health Center: {infant?.health_center}
              </Text>
              <Text style={styles.modalInfo}>
                Family No: {infant?.family_no}
              </Text>
              <Text style={styles.modalInfo}>
                Place of Birth: {infant?.place_of_birth}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Vaccination Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filesModalVisible}
        onRequestClose={() => setFilesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Vaccination Form</Text>
              {filteredFiles && filteredFiles.length > 0 ? (
                <>
                  <Text style={styles.modalInfo}>
                    Vaccine form is ready to download.
                  </Text>
                  <TouchableOpacity
                    style={styles.DLBtn}
                    onPress={handleDownload}
                  >
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.modalInfo}>
                  Vaccine form is not ready for download. Please wait for admin
                  to update.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setFilesModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      {editModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.editModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.editModalTitle}>Edit Infant Details</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.editModalContent}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    placeholder="Enter full name"
                    value={editFullname}
                    onChangeText={setEditFullname}
                    style={styles.input}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Place of Birth</Text>
                  <TextInput
                    placeholder="Enter place of birth"
                    value={editPlaceOfBirth}
                    onChangeText={setEditPlaceOfBirth}
                    style={styles.input}
                  />
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, styles.halfInput]}>
                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput
                      placeholder="Height"
                      value={editHeight}
                      onChangeText={setEditHeight}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.formGroup, styles.halfInput]}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput
                      placeholder="Weight"
                      value={editWeight}
                      onChangeText={setEditWeight}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* Gender Picker */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={editGender}
                      onValueChange={(itemValue) => setEditGender(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Health Center</Text>
                  <TextInput
                    placeholder="Health Center"
                    value={editHealthCenter}
                    onChangeText={setEditHealthCenter}
                    style={styles.input}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Family No</Text>
                  <TextInput
                    placeholder="Family Number"
                    value={editFamilyNo}
                    onChangeText={setEditFamilyNo}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateInfant}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: {
    flex: 1,
    padding: 15,
    marginTop: 5,
  },
  bgImage: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    marginRight: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
    width: "100%",
  },
  infoColumns: {
    flexDirection: "row",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginLeft: 5,
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#333",
  },
  info: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  // Buttons
  button: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#28a745",
  },
  DLBtn: {
    marginTop: 15,
    backgroundColor: "rgb(255, 38, 0)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal (Profile & Files)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  // Edit Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  editModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    maxHeight: "90%",
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "700",
    color: "#888",
  },
  editModalContent: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  // Picker Styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default InfantDetails;
