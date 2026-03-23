import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SafetySection from "../../../components/pet_resort/Service/SafetySection";
import HeaderHero from "../../../components/pet_resort/Service/HeaderHero";
import ServiceGrid from "../../../components/pet_resort/Service/ServiceGrid";
import ServiceDetail from "../../../components/pet_resort/Service/ServiceDetail";
import WhyChooseUs from "../../../components/pet_resort/Service/WhyChooseUs";
export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState("daycare");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <HeaderHero />

      <ServiceGrid
        selected={selectedService}
        onSelect={(id) => setSelectedService(id)}
      />

      <ServiceDetail service={selectedService} />

      <WhyChooseUs />

      <SafetySection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
});