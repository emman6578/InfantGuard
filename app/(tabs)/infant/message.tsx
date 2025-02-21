import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { Ionicons } from "@expo/vector-icons";

const Message = () => {
  const { conversationId } = useLocalSearchParams();
  const router = useRouter();
  const { readMsg, createMsg } = useProtectedRoutesApi();
  const [newMessage, setNewMessage] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => readMsg(conversationId as string),
    refetchInterval: 500,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ text }: { text: string }) => createMsg(text),
    onSuccess: () => {
      setNewMessage("");
      refetch();
    },
    onError: (err) => {
      console.error("Error sending message:", err);
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate({
      text: newMessage,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text>Error loading messages.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Assuming the API returns an object with a messages array
  const messages = data?.data?.messages || [];

  const renderItem = ({ item }: any) => {
    const isParent = item.sender.role === "Parent";
    const timeSent = new Date(item.created).toLocaleTimeString();

    return (
      <View
        style={[
          styles.messageBubble,
          isParent ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={[styles.messageText, isParent && styles.messageTextRight]}>
          {item.text}
        </Text>
        <Text style={styles.timeText}>{timeSent}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          style={styles.messagesList}
        />

        {/* Message Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#e1e1e1",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  messageTextRight: {
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Message;
