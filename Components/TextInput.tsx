import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

type FlexibleTextInputProps = {
  placeholder?: string; // Placeholder text
  value?: string; // Value of the input
  onChangeText?: (text: string) => void; // Callback for text change
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"; // Keyboard type
  secureTextEntry?: boolean; // For password input
  style?: object; // Custom styles
  label?: string; // Optional label
  errorMessage?: string; // Optional error message
  multiline?: boolean; // For multi-line inputs
  maxLength?: number; // Maximum input length
  editable?: boolean; // Whether the input is editable
};

const CustomTextInput: React.FC<FlexibleTextInputProps> = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  style,
  label,
  errorMessage,
  multiline = false,
  maxLength,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Render label if provided */}
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]} // Combine default and custom styles
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
        editable={editable}
        placeholderTextColor="#999" // Optional: Customize placeholder color
      />
      {/* Render error message if provided */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
});

export default CustomTextInput;
