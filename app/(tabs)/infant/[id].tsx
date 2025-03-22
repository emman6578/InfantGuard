// OneInfant.tsx

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import InfantDetails from "./Components/InfantDetails";
import InfantVaccineProgress from "./Components/InfantVaccineProgress";
import InfantVaccineSched from "./Components/InfantVaccineSched";

const OneInfant = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    OneInfant,
    VaccineSchedule,
    VaccineProgress,
    CreateVaccineProgress,
    CreateVaccineSchedule,
  } = useProtectedRoutesApi();
  const { id, totalPercentage } = useLocalSearchParams();
  const queryClient = useQueryClient();

  // Fetch infant details
  const {
    data: infantData,
    isLoading: isInfantLoading,
    error: infantError,
    refetch: refetchInfant,
  } = useQuery({
    queryKey: ["infant", id],
    queryFn: () => OneInfant(id as string),
  });

  // Fetch vaccine schedule
  const {
    data: vaccineData,
    isLoading: isVaccineLoading,
    error: vaccineError,
    refetch: refetchVaccine,
  } = useQuery({
    queryKey: ["schedule", id],
    queryFn: () => VaccineSchedule(id as string),
  });

  const {
    data: vaccineProgressData,
    isLoading: isVaccineProgressLoading,
    error: vaccineProgressError,
    refetch: refetchVaccineProgress,
  } = useQuery({
    queryKey: ["progress", id],
    queryFn: () => VaccineProgress(id as string),
  });

  // Mutation for creating a vaccine progress
  const createVaccineProgressMutation = useMutation({
    mutationFn: () => CreateVaccineProgress(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", id] });
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
    },
    onError: (error: any) => {},
  });

  // Mutation for creating a vaccine schedule
  const createVaccineScheduleMutation = useMutation({
    mutationFn: () => CreateVaccineSchedule(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", id] });
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
      // Trigger progress creation after schedule is created
      createVaccineProgressMutation.mutate();
    },
    onError: (error: any) => {},
  });

  // Automatically create schedule and progress on mount if needed
  useEffect(() => {
    createVaccineScheduleMutation.mutate();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchInfant(),
      refetchVaccine(),
      refetchVaccineProgress(),
    ]);
    createVaccineProgressMutation.mutate();
    queryClient.invalidateQueries({ queryKey: ["infant", id] });
    queryClient.invalidateQueries({ queryKey: ["schedule", id] });
    queryClient.invalidateQueries({ queryKey: ["progress", id] });
    queryClient.invalidateQueries({ queryKey: ["percentage"] });
    queryClient.invalidateQueries({ queryKey: ["all_schedule"] });
    queryClient.invalidateQueries({ queryKey: ["files"] });
    queryClient.invalidateQueries({ queryKey: ["percentage"] });
    setIsRefreshing(false);
  };

  // Combine all loading states
  const isLoading =
    isInfantLoading ||
    isVaccineLoading ||
    isVaccineProgressLoading ||
    createVaccineScheduleMutation.isPending ||
    createVaccineProgressMutation.isPending;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Creating Schedules and Calculating Progress</Text>
      </View>
    );
  }

  if (infantError || vaccineError || vaccineProgressError) {
    return (
      <View style={styles.center}>
        <Text>Error: {infantError?.message || vaccineError?.message}</Text>
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
