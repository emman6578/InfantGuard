import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import NotificationProvider from "@/Providers/NotificationProvider";
import { ScheduleNotificationContextProvider } from "@/Context/ScheduleNoticationContext";

export default function TabLayout() {
  return (
    <NotificationProvider>
      <ScheduleNotificationContextProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#ffd33d",
            tabBarStyle: {
              backgroundColor: "#25292e",
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />

          <Tabs.Screen
            name="infant"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <AntDesign name="home" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="schedule"
            options={{
              title: "Vaccine Schedule",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="schedule" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="articles"
            options={{
              title: "Articles",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="article" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="settings"
            options={{
              title: "Setting",
              tabBarIcon: ({ color }) => (
                <Octicons name="gear" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </ScheduleNotificationContextProvider>
    </NotificationProvider>
  );
}
