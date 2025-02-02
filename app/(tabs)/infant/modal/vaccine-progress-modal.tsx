import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";

//TODO: REMOVE THE UPDATE BUTTON

const VaccineProgressModal = ({
  selectedVaccine,
  modalVisible,
  setModalVisible,
}: any) => {
  const { UpdateVaccineProgress } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      doseType,
      status,
    }: {
      id: string;
      doseType: string;
      status: string;
    }) => UpdateVaccineProgress(id, doseType, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.message || "Failed to update vaccine progress."
      );
    },
  });

  const handleUpdate = (id: string, doseType: string, status: string) => {
    updateMutation.mutate({ id, doseType, status });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedVaccine && (
              <View>
                <Text style={styles.modalTitle}>Vaccine Progress Details</Text>
                {selectedVaccine.Vaccination_Schedule.map((schedule: any) => {
                  const firstDose =
                    schedule.firstDose &&
                    schedule.Vaccination[0]?.firstDoseStatus &&
                    schedule.firstDose !== "N/A" &&
                    schedule.Vaccination[0]?.firstDoseStatus !== "N/A";

                  const secondDose =
                    schedule.secondDose &&
                    schedule.Vaccination[0]?.secondDoseStatus &&
                    schedule.secondDose !== "N/A" &&
                    schedule.Vaccination[0]?.secondDoseStatus !== "N/A";

                  const thirdDose =
                    schedule.thirdDose &&
                    schedule.Vaccination[0]?.thirdDoseStatus &&
                    schedule.thirdDose !== "N/A" &&
                    schedule.Vaccination[0]?.thirdDoseStatus !== "N/A";

                  return (
                    <View key={schedule.id} style={styles.scheduleItem}>
                      {firstDose && (
                        <View style={styles.doseContainer}>
                          {schedule.Vaccination[0]?.firstDoseStatus ===
                            "NOT_DONE" && (
                            <TouchableOpacity
                              style={styles.updateButton}
                              onPress={() => {
                                handleUpdate(
                                  selectedVaccine.id,
                                  "firstDoseStatus",
                                  "DONE"
                                );
                                setModalVisible(false);
                              }}
                            >
                              <Text>Update</Text>
                            </TouchableOpacity>
                          )}
                          <Text style={styles.info}>
                            First Dose: {schedule.firstDose} (
                            {schedule.Vaccination[0]?.firstDoseStatus})
                          </Text>
                        </View>
                      )}

                      {secondDose && (
                        <View style={styles.doseContainer}>
                          {/* Only show update button if first dose is Done */}
                          {schedule.Vaccination[0]?.secondDoseStatus ===
                            "NOT_DONE" && (
                            <TouchableOpacity
                              style={styles.updateButton}
                              onPress={() => {
                                handleUpdate(
                                  selectedVaccine.id,
                                  "secondDoseStatus",
                                  "DONE"
                                );
                                setModalVisible(false);
                              }}
                            >
                              <Text>Update</Text>
                            </TouchableOpacity>
                          )}
                          <Text style={styles.info}>
                            Second Dose: {schedule.secondDose} (
                            {schedule.Vaccination[0]?.secondDoseStatus})
                          </Text>
                        </View>
                      )}

                      {thirdDose && (
                        <View style={styles.doseContainer}>
                          {/* Only show update button if second dose is Done */}
                          {schedule.Vaccination[0]?.thirdDoseStatus ===
                            "NOT_DONE" && (
                            <TouchableOpacity
                              style={styles.updateButton}
                              onPress={() => {
                                handleUpdate(
                                  selectedVaccine.id,
                                  "thirdDoseStatus",
                                  "DONE"
                                );
                                setModalVisible(false);
                              }}
                            >
                              <Text>Update</Text>
                            </TouchableOpacity>
                          )}
                          <Text style={styles.info}>
                            Third Dose: {schedule.thirdDose} (
                            {schedule.Vaccination[0]?.thirdDoseStatus})
                          </Text>
                        </View>
                      )}

                      <Text style={styles.info}>
                        Progress: {schedule.Vaccination[0]?.percentage || 0}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Keep the styles object exactly as you provided
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scheduleItem: {
    marginBottom: 15,
    paddingLeft: 5,
  },
  doseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  updateButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    minWidth: 60,
    alignItems: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 2,
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

export default VaccineProgressModal;
