import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import CircularProgressBar from "./CustomCircularBar";
import VaccineProgressModal from "../modal/vaccine-progress-modal";

const InfantVaccineProgress = ({ vaccineProgress }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  const handleVaccinePress = (vaccine: any) => {
    setSelectedVaccine(vaccine);
    setModalVisible(true);
  };

  // Helper function to calculate progress based on updated dose fields.
  const calculateProgress = (schedule: any, frequency: number) => {
    let updatedCount = 0;
    // Always check the first dose.
    if (schedule.UpdateFirstDose) {
      updatedCount++;
    }
    // If more than one dose is expected, check the second.
    if (frequency >= 2 && schedule.UpdateSecondDose) {
      updatedCount++;
    }
    // If three doses are expected, check the third.
    if (frequency >= 3 && schedule.UpdateThirdDose) {
      updatedCount++;
    }
    return (updatedCount / frequency) * 100;
  };

  // console.log(JSON.stringify(vaccineProgress));

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Vaccine Progress</Text>
      {vaccineProgress[0].Vaccination_Schedule[0]?.Vaccination.length > 0 ? (
        vaccineProgress.map((vaccine: any) => (
          <View key={vaccine.id} style={styles.vaccineItem1}>
            <Pressable
              onPress={() => handleVaccinePress(vaccine)}
              style={({ pressed }) => [
                styles.vaccineHeader,
                pressed && styles.pressedItem,
              ]}
            >
              <Text style={styles.vaccineName}>{vaccine.vaccine_name}</Text>
              {vaccine.Vaccination_Schedule.map((schedule: any) => (
                <View
                  key={schedule.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 25,
                  }}
                >
                  <View style={{ position: "absolute", right: 10 }}>
                    <CircularProgressBar
                      progress={calculateProgress(
                        schedule,
                        Number(vaccine.frequency)
                      )}
                      size={35}
                      strokeWidth={4}
                      backgroundColor="lightgray"
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

      <VaccineProgressModal
        selectedVaccine={selectedVaccine}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
    backgroundColor: "#e6e6e6",
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleItem: {
    marginBottom: 5,
    paddingLeft: 5,
  },
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
