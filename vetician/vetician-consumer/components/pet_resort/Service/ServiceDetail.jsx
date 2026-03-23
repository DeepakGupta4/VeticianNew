import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const packages = [
  { id: "basic", name: "Basic Grooming", price: "$30" },
  { id: "standard", name: "Full Groom", price: "$50" },
  { id: "premium", name: "Luxury Spa", price: "$80" },
];
export default function ServiceDetail() {
  const features = [
    "Size-appropriate play groups",
    "Indoor & outdoor areas",
    "Trained supervisors",
    "Enrichment activities",
    "Rest periods included",
    "Photo updates throughout day",
  ];
 const [selectedPackage, setSelectedPackage] = useState("standard");
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9ncyUyMGFuZCUyMGNhdHN8ZW58MHx8MHx8fDA%3D",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Daycare & Play</Text>
        <Text style={styles.subtitle}>Socialize and exercise</Text>

        <Text style={styles.description}>
          Supervised play groups matched by size and temperament.
          Indoor and outdoor play areas with enrichment activities
          all day long.
        </Text>

        <Text style={styles.featureTitle}>What's Included:</Text>

        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}

        <Text style={styles.section}>Choose Package:</Text>
        {packages.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setSelectedPackage(p.id)}
            style={[
              styles.package,
              selectedPackage === p.id && styles.packageActive,
            ]}
          >
            <Text>{p.name}</Text>
            <Text>{p.price}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Book This Service</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    elevation: 6,
  },

  image: {
    height: 200,
    width: "100%",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a2b49",
  },

  subtitle: {
    color: "#4f9dd9",
    marginTop: 4,
    fontSize: 14,
  },

  description: {
    marginTop: 10,
    color: "#6b7a90",
    lineHeight: 20,
  },

  featureTitle: {
    marginTop: 16,
    fontWeight: "700",
    fontSize: 16,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  featureText: {
    marginLeft: 8,
    color: "#444",
  },
  desc: {
    marginTop: 6,
    color: "#666",
  },
  section: {
    marginTop: 20,
    fontWeight: "700",
  },
  package: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  packageActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eaf3ff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4f9dd9",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});