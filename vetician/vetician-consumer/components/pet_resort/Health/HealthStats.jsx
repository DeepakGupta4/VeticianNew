import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HealthStats() {
  return (
    <View style={styles.container}>
      <View style={styles.cardGreen}>
        <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
        <View>
          <Text style={styles.label}>Overall Health Status</Text>
          <Text style={styles.value}>Excellent</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="pulse" size={26} color="#5C9BD5" />
        <View>
          <Text style={styles.label}>Steps Today</Text>
          <Text style={styles.big}>9,200</Text>
        </View>
      </View>

      <View style={styles.card}>
        <MaterialCommunityIcons name="scale-bathroom" size={26} color="#8B5CF6" />
        <View>
          <Text style={styles.label}>Current Weight</Text>
          <Text style={styles.big}>46.8 lbs</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="calendar-outline" size={26} color="#F97316" />
        <View>
          <Text style={styles.label}>Upcoming Appointments</Text>
          <Text style={styles.big}>3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },

  cardGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#22C55E",
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
  },

  big: {
    fontSize: 20,
    fontWeight: "700",
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
  },
});