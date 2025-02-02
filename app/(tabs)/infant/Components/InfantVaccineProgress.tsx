import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import CircularProgressBar from "./CustomCircularBar";
import VaccineProgressModal from "../modal/vaccine-progress-modal";

const InfantVaccineProgress = ({
  vaccineProgress,
  id,
  vaccineSchedule,
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null); // Store selected vaccine details

  const handleVaccinePress = (vaccine: any) => {
    setSelectedVaccine(vaccine);
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Vaccine Progress</Text>
      {vaccineProgress[0].Vaccination_Schedule[0]?.Vaccination.length > 0 ? (
        vaccineProgress.map((vaccine: any) => (
          <View key={vaccine.id} style={styles.vaccineItem1}>
            <Text> {vaccine.id}</Text>
            <Pressable
              onPress={() => handleVaccinePress(vaccine)} // Open modal when pressed
              style={({ pressed }) => [
                styles.vaccineHeader,
                pressed && styles.pressedItem,
              ]}
            >
              <Text style={styles.vaccineName}>{vaccine.vaccine_name}</Text>

              {vaccine.Vaccination_Schedule.map((vaccine: any) => (
                <View
                  key={vaccine.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 25,
                  }}
                >
                  <View style={{ position: "absolute", right: 10 }}>
                    <CircularProgressBar
                      progress={vaccine.Vaccination[0]?.percentage} // 75% progress
                      size={35} // 120px diameter
                      strokeWidth={4} // 10px thick stroke
                      color="green" // Progress stroke color
                      backgroundColor="lightgray" // Background circle color
                    />
                  </View>
                </View>
              ))}
            </Pressable>
          </View>
        ))
      ) : (
        <View style={styles.noScheduleContainer}>
          <Text style={styles.noScheduleText}>Refresh to view progress.</Text>
        </View>
      )}

      {/* Modal to show vaccine details */}

      <VaccineProgressModal
        selectedVaccine={selectedVaccine}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {vaccineProgress[0].Vaccination_Schedule[0]?.Vaccination.length > 0 ? (
        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: "white",
            borderRadius: 20,
            width: "70%",
            alignSelf: "center",
            shadowColor: "#000", // Shadow color
            shadowOpacity: 0.15, // Slightly lower opacity for a softer look
            shadowRadius: 5, // Larger radius for an even shadow spread
            elevation: 5, // Higher elevation for Android shadow
            marginTop: 20,
          }}
          onPress={() => {
            router.push("/infant/downloadVaccineProgress");
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "black", // Text color for contrast with white background
              fontWeight: "700",
            }}
          >
            Download Vaccine Progress
          </Text>
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  vaccineItem1: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  noScheduleContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  noScheduleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
  },
  vaccineHeader: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pressedItem: {
    backgroundColor: "#e6e6e6", // Light gray for feedback when pressed
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleItem: {
    marginBottom: 5,
    paddingLeft: 5,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default InfantVaccineProgress;
