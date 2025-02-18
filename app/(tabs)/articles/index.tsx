import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { Stack } from "expo-router";

const articles = [
  {
    id: "1",
    title: "Importance of Vaccination for Filipino Infants",
    info: "Vaccination is critical for protecting infants from life-threatening diseases. Immunization reduces child mortality and boosts overall public health in the Philippines.",
    reference:
      "WHO: Vaccines and Immunization (https://www.who.int/news-room/fact-sheets/detail/vaccines-and-immunization)",
    url: "https://www.who.int/news-room/fact-sheets/detail/vaccines-and-immunization",
  },
  {
    id: "2",
    title: "Vaccines Available for Filipino Children: A Comprehensive Guide",
    info: "This guide details the vaccines available for Filipino children including the immunization schedule and benefits of each vaccine.",
    reference:
      "UNICEF Philippines: Immunization (https://www.unicef.org/philippines/what-we-do/immunization)",
    url: "https://www.unicef.org/philippines/what-we-do/immunization",
  },
  {
    id: "3",
    title: "Guiding Parents on Infant Vaccination: What You Need to Know",
    info: "This article offers comprehensive guidance for parents on infant vaccination, covering safety, the immunization schedule, and best practices to ensure a healthy start.",
    reference:
      "Department of Health Philippines – Immunization Program (https://doh.gov.ph/immunization)",
    url: "https://doh.gov.ph/immunization",
  },
  {
    id: "4",
    title: "Benefits of Timely Vaccination: Protecting Your Child's Health",
    info: "Timely vaccination is essential for preventing the spread of dangerous diseases. Learn how following the recommended schedule can safeguard your child's health.",
    reference:
      "Department of Health Philippines – Immunization (https://doh.gov.ph/immunization)",
    url: "https://doh.gov.ph/immunization",
  },
  {
    id: "5",
    title: "Vaccination: A Key Step in Preventing Childhood Diseases",
    info: "Vaccination is one of the most effective ways to prevent life-threatening illnesses in children. Discover how vaccines work to keep your child safe.",
    reference:
      "WHO: Vaccines and Immunization (https://www.who.int/news-room/fact-sheets/detail/vaccines-and-immunization)",
    url: "https://www.who.int/news-room/fact-sheets/detail/vaccines-and-immunization",
  },
  {
    id: "6",
    title: "How Vaccination Safeguards Your Child's Future",
    info: "Vaccines not only protect your child individually but also contribute to community (herd) immunity, ensuring a healthier future for everyone.",
    reference:
      "UNICEF Philippines – Immunization (https://www.unicef.org/philippines/what-we-do/immunization)",
    url: "https://www.unicef.org/philippines/what-we-do/immunization",
  },
];

export default function Articles() {
  const handlePress = (url: any) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Articles",
        }}
      />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => handlePress(item.url)}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>{item.info}</Text>
              <Text style={styles.reference}>References: {item.reference}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  info: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  reference: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#777",
  },
});
