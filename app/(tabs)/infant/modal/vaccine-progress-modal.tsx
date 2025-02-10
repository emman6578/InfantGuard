import React from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Pressable,
} from "react-native";

const VaccineProgressModal = ({
  selectedVaccine,
  modalVisible,
  setModalVisible,
}: any) => {
  // This helper converts an ISO date string to a friendly format.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                  return (
                    <View key={schedule.id} style={styles.scheduleItem}>
                      {/* Only show First Dose if updated dose info and remark exist */}
                      {schedule.UpdateFirstDose &&
                        schedule.remark_FirstDose && (
                          <View style={styles.doseContainer}>
                            <Text style={styles.info}>
                              First Dose (Updated):{" "}
                              {formatDate(schedule.UpdateFirstDose)} (Remark:{" "}
                              {schedule.remark_FirstDose})
                            </Text>
                          </View>
                        )}

                      {/* Only show Second Dose if updated dose info and remark exist */}
                      {schedule.UpdateSecondDose &&
                        schedule.remark_SecondDose && (
                          <View style={styles.doseContainer}>
                            <Text style={styles.info}>
                              Second Dose (Updated):{" "}
                              {formatDate(schedule.UpdateSecondDose)} (Remark:{" "}
                              {schedule.remark_SecondDose})
                            </Text>
                          </View>
                        )}

                      {/* Only show Third Dose if updated dose info and remark exist */}
                      {schedule.UpdateThirdDose &&
                        schedule.remark_ThirdDose && (
                          <View style={styles.doseContainer}>
                            <Text style={styles.info}>
                              Third Dose (Updated):{" "}
                              {formatDate(schedule.UpdateThirdDose)} (Remark:{" "}
                              {schedule.remark_ThirdDose})
                            </Text>
                          </View>
                        )}

                      {/* Always show the progress information */}
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
