import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HeaderHero() {
  return (
    <LinearGradient
      colors={["#4f9dd9", "#6bb2f2"]}
      style={styles.container}
    >
      <Text style={styles.title}>Our Premium Services</Text>

      <Text style={styles.subtitle}>
        Comprehensive care solutions designed with your pet's happiness in mind
      </Text>

      <View style={styles.badges}>
        <Text style={styles.badge}>Licensed & Insured</Text>
        <Text style={styles.badge}>24/7 Live Cameras</Text>
        <Text style={styles.badge}>Always Available</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    color: "#e8f3ff",
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 5,
    color: "#fff",
    fontSize: 13,
  },
});