import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';  

export default function FeatureCard({ title, icon }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={28} color="#3b82f6" />
      
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },

  text: {
    marginTop: 10,
    fontWeight: "600",
  },
});