import { ImageBackground, View, Text, StyleSheet } from "react-native";
import StatusBadge from "./StatusBadge";
import CTAButtons from "./CTAButtons";
import FeatureBadges from "./FeatureBadges";

export default function HeroSection() {
  return (
    <ImageBackground
      source={require("../../../assets/images/dog.jpg")}
      style={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <StatusBadge />

        <Text style={styles.title}>
          Your Pet's{"\n"}
          <Text style={styles.blue}>Second Home</Text>
        </Text>

        <Text style={styles.subtitle}>
          Safe. Monitored. Vet-Supervised.
        </Text>

        <Text style={styles.subtitle2}>
          Because every pet deserves a five-star experience.
        </Text>

        <CTAButtons />

        <FeatureBadges />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 770,
    justifyContent: "center",
  },
  overlay: {
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.4)",
    height: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  blue: {
    color: "#4da6ff",
  },
  subtitle: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  subtitle2: {
    color: "white",
    marginTop: 5,
  },
});