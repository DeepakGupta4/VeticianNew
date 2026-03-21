import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function SafetyCard({ title, description, icon, iconLib, color, bg }) {

  const renderIcon = () => {
    const size = 28;

    if (iconLib === "MaterialIcons") {
      return <MaterialIcons name={icon} size={size} color={color} />;
    }

    if (iconLib === "FontAwesome5") {
      return <FontAwesome5 name={icon} size={size} color={color} />;
    }

    if (iconLib === "Ionicons") {
      return <Ionicons name={icon} size={size} color={color} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        {renderIcon()}
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4
  },

  description: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18
  }
});