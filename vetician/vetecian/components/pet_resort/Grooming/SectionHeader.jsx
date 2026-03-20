import { View, Text, StyleSheet } from "react-native";

export default function SectionHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grooming & Vet Care</Text>

      <Text style={styles.subtitle}>
        Pampering and professional healthcare, all under one roof.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f3a5f",
  },

  subtitle: {
    color: "#6c7a89",
    marginTop: 6,
  },
});