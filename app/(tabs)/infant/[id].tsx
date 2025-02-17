import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import InfantDetails from "./Components/InfantDetails";
import InfantVaccineProgress from "./Components/InfantVaccineProgress";
import InfantVaccineSched from "./Components/InfantVaccineSched";

const OneInfant = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { OneInfant, VaccineSchedule, VaccineProgress, CreateVaccineProgress } =
    useProtectedRoutesApi();
  const { id, totalPercentage } = useLocalSearchParams();
  const queryClient = useQueryClient(); // Initialize queryClient for query invalidation

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
  const { mutate: createVaccineProgress } = useMutation({
    mutationFn: () => CreateVaccineProgress(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", id] });
      queryClient.invalidateQueries({ queryKey: ["percentage"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create schedule.");
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refetch data for all queries
    await Promise.all([
      refetchInfant(),
      refetchVaccine(),
      refetchVaccineProgress(),
    ]);
    // Invalidate all queries to refresh data in the cache
    queryClient.invalidateQueries({ queryKey: ["infant", id] });
    queryClient.invalidateQueries({ queryKey: ["schedule", id] });
    queryClient.invalidateQueries({ queryKey: ["progress", id] });
    queryClient.invalidateQueries({ queryKey: ["percentage"] });
    queryClient.invalidateQueries({ queryKey: ["all_schedule"] });
    queryClient.invalidateQueries({ queryKey: ["files"] });
    setIsRefreshing(false);
    createVaccineProgress();
  };

  if (isInfantLoading || isVaccineLoading || isVaccineProgressLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Handle errors
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

        {/* Displaying the infant details */}
        <InfantDetails infant={infant} percentage={totalPercentage} />
        {/* Displaying the vaccine progress */}
        <InfantVaccineProgress
          vaccineProgress={vaccineProgress}
          id={id}
          vaccineSchedule={vaccineSchedule}
        />
        {/* Displaying the vaccine schedule */}
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
    paddingBottom: 25, // Adds spacing to prevent content from being hidden
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OneInfant;
