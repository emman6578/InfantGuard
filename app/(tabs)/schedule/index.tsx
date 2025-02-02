import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { getNotifToken } from "@/libraries/Secure Store/expoSecureStore";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Schedule = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { VaccineScheduleAll } = useProtectedRoutesApi();

  const {
    data: vaccineData,
    isLoading: isVaccineLoading,
    error: vaccineError,
    refetch, // Add refetch function
  } = useQuery({
    queryKey: ["all_schedule"],
    queryFn: () => VaccineScheduleAll(),
  });

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch(); // Refetch the query
    setIsRefreshing(false);
  };

  if (isVaccineLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (vaccineError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {vaccineError?.message}</Text>
      </View>
    );
  }

  const schedule = vaccineData?.data || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Next Vaccine Due</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {schedule.map((entry: any, index: any) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardHeader}>{entry.infantName}</Text>
            <Text style={styles.cardSubHeader}>{entry.date}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Vaccine: </Text>
                {entry.vaccineName}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Dose: </Text>
                {entry.dose}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#007BFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#007BFF",
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  cardSubHeader: {
    fontSize: 16,
    color: "#777777",
    marginBottom: 10,
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333333",
  },
});

export default Schedule;
