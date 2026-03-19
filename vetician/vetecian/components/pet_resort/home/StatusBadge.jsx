import { View, Text, StyleSheet } from "react-native";

export default function StatusBadge() {
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>Now Accepting Bookings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
    marginRight: 6,
  },
  text: {
    color: "white",
  },
});