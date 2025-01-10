import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="babies"
        options={{
          title: "Babies",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="baby" size={24} color={color} />
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
      <Tabs.Screen
        name="vaccinationArticles"
        options={{
          title: "Articles",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="article" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
