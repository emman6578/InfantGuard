import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const InfantDetails = ({ infant, percentage }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../public/babybg.png")} // Adjust the path to match your folder structure
        style={{
          width: "100%", // Full width of the screen
          justifyContent: "center", // Center text vertically
          alignItems: "center", // Center text horizontally
          paddingVertical: 50,
        }}
        resizeMode="cover"
      ></ImageBackground>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{infant?.fullname}</Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#ccc",
                marginBottom: 5,
                width: "100%",
              }}
            />
            <View style={styles.infoColumns}>
              {/* Left Column: Birthday and Height */}
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Entypo
                    name="cake"
                    size={20}
                    color="red"
                    style={[styles.icon, { marginLeft: -5 }]}
                  />
                  <Text style={[styles.infoText, { marginLeft: -5 }]}>
                    {infant?.birthday.month}/{infant?.birthday.day}/
                    {infant?.birthday.year}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5
                    name="ruler-vertical"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>{infant?.height} cm</Text>
                </View>
              </View>

              {/* Right Column: Gender and Weight */}
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  {infant?.gender === "Male" ? (
                    <MaterialIcons
                      name="man"
                      size={20}
                      color="blue"
                      style={styles.icon}
                    />
                  ) : (
                    <MaterialIcons
                      name="woman"
                      size={20}
                      color="pink"
                      style={styles.icon}
                    />
                  )}
                  <Text style={styles.infoText}>{infant?.gender}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5
                    name="weight"
                    size={20}
                    color="black"
                    style={styles.icon}
                  />
                  <Text style={styles.infoText}>{infant?.weight} kg</Text>
                </View>
              </View>
            </View>

            <Text style={styles.info}>Vaccine Progress: {percentage}%</Text>
          </View>
          {/* Image on the right */}
          {infant?.image && (
            <Image source={{ uri: infant?.image }} style={styles.image} />
          )}
        </View>

        {/* Button to open modal */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>View Full Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for full profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Full Profile</Text>
              <Text style={styles.modalInfo}>Height: {infant?.height} cm</Text>
              <Text style={styles.modalInfo}>Gender: {infant?.gender}</Text>
              <Text style={styles.modalInfo}>Weight: {infant?.weight} kg</Text>
              <Text style={styles.modalInfo}>
                Mother's Name: {infant?.mothers_name}
              </Text>
              <Text style={styles.modalInfo}>
                Father's Name: {infant?.fathers_name}
              </Text>
              <Text style={styles.modalInfo}>
                Health Center: {infant?.health_center}
              </Text>
              <Text style={styles.modalInfo}>
                Family No: {infant?.family_no}
              </Text>
              <Text style={styles.modalInfo}>
                Place of Birth: {infant?.place_of_birth}
              </Text>
            </ScrollView>

            {/* Close button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    marginRight: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInfo: {
    fontSize: 16,
    marginBottom: 10,
  },

  infoColumns: {
    flexDirection: "row", // Align two columns side by side
    marginBottom: 20, // Add spacing below the section
  },
  column: {
    flex: 1, // Allow columns to take equal width
    marginLeft: 5,
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center align vertically
    marginBottom: 3, // Add spacing between rows
  },
  icon: {
    marginRight: 10, // Add space between the icon and the text
  },
  infoText: {
    fontSize: 12,
    color: "#333",
  },
});

export default InfantDetails;
