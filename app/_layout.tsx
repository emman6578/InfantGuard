import { AuthContextProvider } from "@/Context/AuthContext";
import { ProtectedRoutesContextProvider } from "@/libraries/API/protected/protectedRoutes";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <ProtectedRoutesContextProvider>
        <QueryClientProvider client={client}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" backgroundColor="#fff" />
        </QueryClientProvider>
      </ProtectedRoutesContextProvider>
    </AuthContextProvider>
  );
}
