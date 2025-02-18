import { View, Text, StyleSheet } from "react-native";
import React from "react";

const InfantVaccineSched = ({ vaccineSchedule, id }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Vaccine Schedule</Text>

      {vaccineSchedule.firstDose?.length ||
      vaccineSchedule.secondDose?.length ||
      vaccineSchedule.thirdDose?.length ? (
        <>
          {/* First Dose */}
          <View style={styles.doseContainer}>
            <Text style={styles.doseTitle}>First Dose</Text>
            {vaccineSchedule.firstDose?.map((dose: any) => (
              <View key={dose.id} style={styles.vaccineItem}>
                <Text style={styles.vaccineInfo}>Date: {dose.date}</Text>
                <Text style={styles.vaccineInfo}>
                  Vaccine(s):{" "}
                  {dose.vaccine_names
                    .map((vaccine: any) => vaccine.name)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>

          {/* Second Dose */}
          <View style={styles.doseContainer}>
            <Text style={styles.doseTitle}>Second Dose</Text>
            {vaccineSchedule.secondDose?.map((dose: any) => (
              <View key={dose.id} style={styles.vaccineItem}>
                <Text style={styles.vaccineInfo}>Date: {dose.date}</Text>
                <Text style={styles.vaccineInfo}>
                  Vaccine(s):{" "}
                  {dose.vaccine_names
                    .map((vaccine: any) => vaccine.name)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>

          {/* Third Dose */}
          <View style={styles.doseContainer}>
            <Text style={styles.doseTitle}>Third Dose</Text>
            {vaccineSchedule.thirdDose?.map((dose: any) => (
              <View key={dose.id} style={styles.vaccineItem}>
                <Text style={styles.vaccineInfo}>Date: {dose.date}</Text>
                <Text style={styles.vaccineInfo}>
                  Vaccine(s):{" "}
                  {dose.vaccine_names
                    .map((vaccine: any) => vaccine.name)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        // No schedule found
        <View style={styles.noScheduleContainer}>
          <Text style={styles.noScheduleText}>No vaccine schedule found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  doseContainer: {
    marginTop: 15,
  },
  doseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vaccineItem: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  vaccineInfo: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
  },
});

export default InfantVaccineSched;
