import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useRouter } from "expo-router";

const AddConversation = () => {
  const { createMsg } = useProtectedRoutesApi();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  // Set up the mutation using useMutation
  const mutation = useMutation({
    mutationFn: createMsg,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      router.back();
      setText(""); // clear input on success
    },
    onError: (error: any) => {
      console.error("Error sending message:", error);
    },
  });

  // Handler for sending the message
  const handleSend = () => {
    mutation.mutate(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Conversation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={text}
        onChangeText={setText}
      />
      <Button
        title="Send"
        onPress={handleSend}
        disabled={mutation.status === "loading"}
      />
      {mutation.status === "loading" && (
        <Text style={styles.status}>Sending...</Text>
      )}
      {mutation.status === "error" && (
        <Text style={styles.error}>
          Error:{" "}
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  status: {
    marginTop: 10,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
});

export default AddConversation;
