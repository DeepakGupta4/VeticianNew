import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ServiceItem({ title }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="checkmark-circle" size={22} color="#18bfa3" />
        <Text style={styles.text}>{title}</Text>
      </View>

      <Ionicons name="checkmark-circle-outline" size={22} color="#18bfa3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e7f5f3",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  text: {
    fontSize: 15,
  },
});