import React from "react";
import { View, StyleSheet } from "react-native";
import ServiceCard from "./ServiceCard";

const services = [
  {
    id: "boarding",
    title: "Luxury Boarding",
    description: "Comfortable stay with premium care",
  },
  {
    id: "grooming",
    title: "Professional Grooming",
    description: "Keep your pet looking pawsome",
  },
  {
    id: "vet",
    title: "Veterinary Care",
    description: "Health care from expert vets",
  },
  {
    id: "training",
    title: "Training Programs",
    description: "Build better behavior habits",
  },
  {
    id: "daycare",
    title: "Daycare & Play",
    description: "Fun social activities daily",
  },
  {
    id: "transport",
    title: "Pet Transport",
    description: "Safe door-to-door service",
  },
];

export default function ServiceGrid({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          selected={selected === service.id}
          onPress={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});