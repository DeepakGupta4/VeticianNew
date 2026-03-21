import { View, Text, StyleSheet } from "react-native";

const features = [
  "24/7 Monitoring",
  "Vet Supervised",
  "Insured Facility",
  "Verified Staff",
];

export default function FeatureBadges() {
  return (
    <View style={styles.container}>
      {features.map((item, index) => (
        <View key={index} style={styles.badge}>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
    gap: 10,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});