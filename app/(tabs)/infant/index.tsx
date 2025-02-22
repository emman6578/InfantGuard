import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomProgressBar from "./Components/CustomProgressBar";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Index() {
  const { GetTotalPercentageProgressVaccine, ParentInfo } =
    useProtectedRoutesApi();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Listener for notifications received while the app is in the foreground
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotificationCount((prevCount) => prevCount + 1);
      });

    // Listener for notifications received when the app is in the background or closed
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotificationCount((prevCount) => prevCount + 1);
      });

    // Cleanup listeners on unmount
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const {
    data: percentage,
    isLoading: isPercentageLoading,
    isError: isPercentageError,
    error: percentageError,
  } = useQuery({
    queryKey: ["percentage"],
    queryFn: GetTotalPercentageProgressVaccine,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["parent"],
    queryFn: () => ParentInfo(),
  });

  const handlePressAdd = () => {
    router.push("/infant/addChild");
  };

  if (isPercentageLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isPercentageError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {percentageError.message}</Text>
      </View>
    );
  }

  const infants = percentage?.data?.infants || [];
  const parentData = data?.data;

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../public/app-logo.jpeg")}
          style={styles.logoImg}
        />

        <View>
          <Text style={styles.title}>InfantGuard</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handlePressAdd}>
            <Feather name="user-plus" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/infant/notifications");
              setNotificationCount(0);
            }}
          >
            {notificationCount > 0 && (
              <Text
                style={{
                  position: "absolute",
                  left: 30,
                  padding: 3,
                  backgroundColor: "red",
                  borderRadius: 50,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {notificationCount}
              </Text>
            )}
            <FontAwesome6 name="bell" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/infant/conversation");
            }}
          >
            <MaterialIcons name="message" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.randomTextContainer}>
        <Text style={styles.randomText}>Welcome {parentData?.fullname}</Text>
        <Text style={[styles.randomText, { fontSize: 16, fontWeight: "300" }]}>
          What we can do for you today?
        </Text>
      </View>

      {/* Infant List */}
      <View style={styles.container}>
        {infants.length !== 0 ? (
          <Text style={styles.infantsTitle}>Babies Vaccination Progress:</Text>
        ) : (
          <Text></Text>
        )}

        {infants.length === 0 ? (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "lightblue",
              borderRadius: 20,
            }}
            onPress={() => {
              router.push("/infant/addChild");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "gray",
              }}
            >
              Add Infant Details
            </Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={infants}
            keyExtractor={(item) => item.fullname}
            renderItem={({ item }) => (
              <Link
                href={{
                  // @ts-ignore
                  pathname: `/infant/${item.id}`,
                  params: { totalPercentage: item.totalPercentage },
                }}
                asChild
              >
                <TouchableOpacity style={styles.card}>
                  <Image source={{ uri: item?.image }} style={styles.image} />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{item.fullname}</Text>
                    <View style={styles.underline} />
                    <Text style={styles.vaccinePercentage}>
                      Vaccine Progress: {item.totalPercentage}%
                    </Text>
                    <CustomProgressBar
                      progress={item.totalPercentage}
                      width={200}
                      height={10}
                      color="green"
                      backgroundColor="lightgray"
                      label="Loading"
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e90ff", // Blue color
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Black shadow with opacity
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 2, // Shadow radius
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50", // Use a fresh color for the logo
  },
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "#333", // Adjust text color for better readability
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  randomTextContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  randomText: {
    fontSize: 25,
    color: "#333",
    fontWeight: "900",
    textAlign: "center",
  },
  infantsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50", // Title color for consistency
  },
  noInfantsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make the image circular
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  vaccinePercentage: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  underline: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  logoImg: {
    width: 70,
    height: 70,
  },
});
