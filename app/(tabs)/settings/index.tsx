import { useAuth } from "@/Context/AuthContext";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { deleteToken } from "@/libraries/Secure Store/expoSecureStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Settings() {
  const router = useRouter();
  const { updateAuthToken } = useAuth();
  const [image, setImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullname, setEditFullname] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");

  const { ParentInfo, UploadParentProfileImage, updateParent } =
    useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["parent"],
    queryFn: () => ParentInfo(),
  });

  // Handle successful data fetch with useEffect
  useEffect(() => {
    if (data) {
      setEditFullname(data.data.fullname);
      setEditContactNumber(data.data.contact_number);
    }
  }, [data]);

  const parentData = data?.data;
  const parentId = parentData?.id;

  const updateMutation = useMutation({
    mutationFn: (updateData: { fullname: string; contact_number: string }) =>
      updateParent(updateData, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      Alert.alert("Success", "Profile updated successfully!");
      setShowEditModal(false);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to update profile");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (data: any) => UploadParentProfileImage(data.id, data.imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      Alert.alert("Success", "Image uploaded successfully!");
      setImage("");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to upload image");
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmitImage = () => {
    if (image && parentId) {
      uploadMutation.mutate({
        id: parentId,
        imageUrl: image,
      });
    }
  };

  const handleUpdateProfile = () => {
    if (!editFullname || !editContactNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    updateMutation.mutate({
      fullname: editFullname,
      contact_number: editContactNumber,
    });
  };

  const logout = async () => {
    await deleteToken();
    await updateAuthToken(null);
    router.replace("/landingPage");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Profile",
          }}
        />
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: parentData?.image || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{parentData?.fullname}</Text>
          <Text style={styles.contact}>{parentData?.contact_number}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Image Update Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Profile Picture</Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>
              {image ? "Change Image" : "Select Image"}
            </Text>
          </Pressable>

          {image && (
            <>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  { backgroundColor: "#10b981" },
                ]}
                onPress={handleSubmitImage}
              >
                {uploadMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Upload Image</Text>
                )}
              </Pressable>
            </>
          )}
        </View>

        {/* Edit Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={editFullname}
                onChangeText={setEditFullname}
              />

              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={editContactNumber}
                onChangeText={setEditContactNumber}
                keyboardType="phone-pad"
              />

              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#ef4444" }]}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#3b82f6" }]}
                  onPress={handleUpdateProfile}
                >
                  {updateMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            { backgroundColor: "#ef4444", marginTop: 20 },
          ]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    color: "#1e293b",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
