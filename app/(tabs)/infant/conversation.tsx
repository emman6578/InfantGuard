import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const Conversation = () => {
  const { loadConversation } = useProtectedRoutesApi();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["conversation"],
    queryFn: loadConversation,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading conversations.</Text>
      </View>
    );
  }

  const conversations = data?.data?.conversations || [];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        router.push({
          pathname: "/infant/message",
          params: { conversationId: item.id },
        });
      }}
    >
      <Text style={styles.conversationTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        {conversations.length === 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              router.push("/infant/addConversation");
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  conversationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Conversation;
