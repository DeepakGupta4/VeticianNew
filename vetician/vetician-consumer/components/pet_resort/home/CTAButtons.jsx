import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function CTAButtons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.primary}
        onPress={() => router.push("/services")}
      >
        <Text style={styles.primaryText}>Book a Stay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondary}
        onPress={() => router.push("/livecam")}
      >
        <Text style={styles.secondaryText}>View Live Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 15,
    marginTop: 20,
  },
  primary: {
    backgroundColor: "#4da6ff",
    padding: 14,
    borderRadius: 10,
  },
  primaryText: {
    color: "white",
  },
  secondary: {
    borderWidth: 1,
    borderColor: "white",
    padding: 14,
    borderRadius: 10,
  },
  secondaryText: {
    color: "white",
  },
});