// OneInfant.tsx

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import InfantDetails from "./Components/InfantDetails";
import InfantVaccineProgress from "./Components/InfantVaccineProgress";
import InfantVaccineSched from "./Components/InfantVaccineSched";

const OneInfant = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { OneInfant, VaccineSchedule, VaccineProgress } =
    useProtectedRoutesApi();
  const { id, totalPercentage } = useLocalSearchParams();

  // Query for infant details
  const {
    data: infantData,
    isLoading: isInfantLoading,
    refetch: refetchInfant,
  } = useQuery({
    queryKey: ["infant", id],
    queryFn: () => OneInfant(id as string),
  });

  // Query for vaccine schedule
  const {
    data: vaccineData,
    isLoading: isVaccineLoading,
    refetch: refetchVaccine,
  } = useQuery({
    queryKey: ["schedule", id],
    queryFn: () => VaccineSchedule(id as string),
  });

  // Query for vaccine progress
  const {
    data: vaccineProgressData,
    isLoading: isVaccineProgressLoading,
    refetch: refetchVaccineProgress,
  } = useQuery({
    queryKey: ["progress", id],
    queryFn: () => VaccineProgress(id as string),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchInfant(),
      refetchVaccine(),
      refetchVaccineProgress(),
    ]);
    setIsRefreshing(false);
  };

  if (isInfantLoading || isVaccineLoading || isVaccineProgressLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const infant = infantData?.data;
  const vaccineSchedule =
    vaccineData?.data[0].Infant[0]?.Vaccination_Schedule || {};
  const vaccineProgress = vaccineProgressData?.data || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Stack.Screen options={{ headerShown: false }} />
        {/* InfantDetails now includes the edit functionality */}
        <InfantDetails infant={infant} percentage={totalPercentage} />
        <InfantVaccineProgress
          vaccineProgress={vaccineProgress}
          id={id}
          vaccineSchedule={vaccineSchedule}
        />
        <InfantVaccineSched vaccineSchedule={vaccineSchedule} id={id} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 25,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OneInfant;
