import { View, Text, StyleSheet, Image } from "react-native";
import PriceItem from "./PriceItem";
import ActionButton from "./ActionButton";

export default function GroomingCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Spa & Grooming</Text>

        <Text style={styles.desc}>
          Treat your pet to our premium grooming services performed by
          certified groomers.
        </Text>

        <PriceItem title="Full Bath & Dry" price="25" />
        <PriceItem title="Nail Trim & Filing" price="12" />
        <PriceItem title="Luxury Spa Package" price="55" />

        <ActionButton
          title="Add Grooming to Stay"
          color="#ff5c8a"
          onPress={() => alert("Grooming Added")}
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
});