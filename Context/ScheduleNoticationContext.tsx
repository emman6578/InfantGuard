import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface ProtectedRoutesType {
  ScheduleNotification: () => Promise<any>;
}

const ScheduleNotificationContext = createContext<
  ProtectedRoutesType | undefined
>(undefined);

export const ScheduleNotificationContextProvider = ({
  children,
}: PropsWithChildren) => {
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

  const schedule = vaccineData?.data || [];

  const addTimeToDate = (dateString: string, timeString: string) => {
    const combinedString = `${dateString}T${timeString}:00`;
    const newDate = new Date(combinedString);

    if (isNaN(newDate.getTime())) {
      console.error("Invalid date or time format.");
      return null;
    }

    return newDate;
  };

  // Function to create a valid key for SecureStore
  const getSecureStoreKey = (notificationDate: Date) => {
    // Convert date to ISO string and remove non-alphanumeric characters
    const isoString = notificationDate
      .toISOString()
      .replace(/[^a-zA-Z0-9-_\.]/g, "");
    return isoString;
  };

  // Check if the notification has already been scheduled securely
  const checkNotificationScheduled = async (notificationDate: Date) => {
    const key = getSecureStoreKey(notificationDate);
    const scheduledDate = await SecureStore.getItemAsync(key);

    // If the date has been scheduled, return true
    return scheduledDate !== null;
  };

  // Mark the notification as scheduled securely
  const setNotificationScheduled = async (notificationDate: Date) => {
    const key = getSecureStoreKey(notificationDate);
    // Store the notification date securely so it doesn't get scheduled again
    await SecureStore.setItemAsync(key, "scheduled");
  };

  const ScheduleNotification = async () => {
    schedule.forEach(async (entry: any) => {
      try {
        const time = "08:00";
        const notificationDate = addTimeToDate(entry.date, time);

        if (notificationDate && notificationDate > new Date()) {
          // Check if the notification for this date has already been scheduled
          const alreadyScheduled = await checkNotificationScheduled(
            notificationDate
          );

          if (!alreadyScheduled) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Vaccine Reminder for ${entry.infantName}`,
                body: `Vaccine: ${entry.vaccineName}, Dose: ${entry.dose}, Date: ${entry.date}`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: notificationDate,
              },
            });

            // Mark the notification as scheduled securely
            await setNotificationScheduled(notificationDate);

            console.log(`Notification scheduled for ${notificationDate}`);
          } else {
            console.log(
              `Notification already scheduled for ${notificationDate}`
            );
          }
        } else {
          console.log(
            `Skipped scheduling. Date ${notificationDate} is invalid or in the past.`
          );
        }
      } catch (error) {
        console.error("Error scheduling notification:", error);
      }
    });
  };

  useEffect(() => {
    ScheduleNotification();
  }, [vaccineData]); // Empty dependency array ensures this runs only once

  return (
    <ScheduleNotificationContext.Provider
      value={{
        ScheduleNotification,
      }}
    >
      {children}
    </ScheduleNotificationContext.Provider>
  );
};

export const useScheduleNotification = (): ProtectedRoutesType => {
  const context = useContext(ScheduleNotificationContext);
  if (context === undefined) {
    throw new Error("Getting error");
  }
  return context;
};
