import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HeroSection1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      

      <Text style={styles.title}>Your Pet's Second Home</Text>

      <Text style={styles.subtitle}>
        Safe. Monitored. Vet-Supervised.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/booking")}
      >
        <Text style={styles.btnText}>Book a Stay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
    marginTop:30,

  },


  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  subtitle: {
    color: "#555",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
  },
});