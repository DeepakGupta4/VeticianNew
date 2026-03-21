import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐾 Pet Resort   </Text>

      <View style={styles.menu}>
        {/* <TouchableOpacity onPress={() => router.push("/services")}>
          <Text style={styles.link}>Services</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => router.push("/livecam")}>
          <Text style={styles.link}>Live Cam</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/grooming")}>
          <Text style={styles.link}>Grooming</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bookBtn}>
        <Text style={{ color: "white" }}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingLeft:2,
    paddingTop:30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menu: {
    flexDirection: "row",
    gap: 15,
    
  },
  link: {
    fontSize: 14,
    
  },
  bookBtn: {
    backgroundColor: "#4da6ff",
    padding: 10,
    
    borderRadius: 8,
  },
});