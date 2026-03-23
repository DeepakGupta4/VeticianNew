import { View, Text, StyleSheet, Image } from "react-native";
import ServiceItem from "./ServiceItem";
import ActionButton from "./ActionButton";

export default function VetCareCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Veterinary Care</Text>

        <Text style={styles.desc}>
          Our licensed vets monitor every pet 24/7 with regular check-ups
          and instant emergency response.
        </Text>

        <ServiceItem title="Daily Check-up" />
        <ServiceItem title="Emergency Care Available" />
        <ServiceItem title="Medical Log Updates" />

        <View style={styles.alert}>
          <Text style={styles.alertText}>
            Emergency Hotline: 1-800-PET-SOS — Available 24/7
          </Text>
        </View>

        <ActionButton
          title="View Vet Schedule"
          color="#1cc49c"
          onPress={() => alert("Opening Vet Schedule")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
  },

  image: {
    height: 180,
    width: "100%",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f3a5f",
  },

  desc: {
    color: "#6c7a89",
    marginVertical: 10,
  },

  alert: {
    backgroundColor: "#ffe9e9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  alertText: {
    color: "#ff4d4f",
    fontSize: 13,
  },
});