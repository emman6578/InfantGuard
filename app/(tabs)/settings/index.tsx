import { useAuth } from "@/Context/AuthContext";
import { deleteToken } from "@/libraries/Secure Store/expoSecureStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  const router = useRouter();
  const { updateAuthToken } = useAuth();

  const logout = async () => {
    await deleteToken();
    await updateAuthToken(null);
    router.replace("/landingPage");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings Page</Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 20,
          backgroundColor: "red",
          borderRadius: 20,
        }}
        onPress={logout}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
function updateAuthToken(arg0: null) {
  throw new Error("Function not implemented.");
}
