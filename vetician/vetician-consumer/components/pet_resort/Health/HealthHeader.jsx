import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HealthHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="heart-outline" size={22} color="white" />
        <Text style={styles.small}> HEALTH DASHBOARD</Text>
      </View>

      <Text style={styles.title}>Your Pet's Health Hub</Text>

      <Text style={styles.subtitle}>
        Complete health tracking, medical records, and wellness monitoring all
        in one place
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#5C9BD5",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  small: {
    color: "white",
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
  },

  subtitle: {
    marginTop: 8,
    color: "#E5EEF8",
    lineHeight: 20,
  },
});