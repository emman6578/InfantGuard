import LogoutBtn from "@/components/logoutBtn";
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings Page</Text>
      <LogoutBtn />
    </View>
  );
}
