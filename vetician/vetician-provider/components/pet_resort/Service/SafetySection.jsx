import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SafetyCard from "./SafetyCard";

export default function SafetySection() {
  const safetyData = [
    {
      title: "Fire Safety Certified",
      description: "Sprinklers, smoke alarms & fire exits checked monthly.",
      icon: "local-fire-department",
      iconLib: "MaterialIcons",
      color: "#f97316",
      bg: "#fff7ed"
    },
    {
      title: "Separate Pet Areas",
      description: "Small & large pets are housed in dedicated secure zones.",
      icon: "grid",
      iconLib: "Ionicons",
      color: "#3b82f6",
      bg: "#eff6ff"
    },
    {
      title: "Isolation Room",
      description: "Comfortable isolation space for ill or anxious pets.",
      icon: "bed",
      iconLib: "FontAwesome5",
      color: "#a855f7",
      bg: "#f5f3ff"
    },
    {
      title: "24/7 Trained Staff",
      description: "Certified pet care experts on every shift, round the clock.",
      icon: "people",
      iconLib: "Ionicons",
      color: "#22c55e",
      bg: "#ecfdf5"
    },
    {
      title: "Hospital Tie-up",
      description: "Partner hospital within 5 minutes for any emergency.",
      icon: "favorite",
      iconLib: "MaterialIcons",
      color: "#ef4444",
      bg: "#fef2f2"
    },
    {
      title: "Fully Insured Facility",
      description: "All pets are covered under our comprehensive insurance.",
      icon: "shield-checkmark",
      iconLib: "Ionicons",
      color: "#14b8a6",
      bg: "#f0fdfa"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Safety & Transparency</Text>

      <Text style={styles.subtitle}>
        We believe trust is earned through transparency. Here's how we keep
        your pet safe.
      </Text>

      <View style={styles.grid}>
        {safetyData.map((item, index) => (
          <SafetyCard key={index} {...item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8fafc"
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#0f172a"
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20
  },

  grid: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between"
  }
});