import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const data = [
  {
    icon: "shield-checkmark",
    title: "Certified & Licensed",
    desc: "All staff are professionally trained and certified in pet care",
    color: "#4f9dd9",
  },
  {
    icon: "location",
    title: "Prime Location",
    desc: "Convenient pickup and drop-off services",
    color: "#f59e0b",
  },
  {
    icon: "call",
    title: "24/7 Support",
    desc: "Round-the-clock monitoring and emergency help",
    color: "#4f9dd9",
  },
];

export default function WhyChooseUs() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Why Choose PawResort?</Text>

      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#fff" />
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  desc: {
    textAlign: "center",
    color: "#6b7a90",
    marginTop: 6,
  },
});