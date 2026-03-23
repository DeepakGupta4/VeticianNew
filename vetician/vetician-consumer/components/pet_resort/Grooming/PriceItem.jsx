import { View, Text, StyleSheet } from "react-native";

export default function PriceItem({ title, price }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.price}>${price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6e9ef",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 15,
  },

  price: {
    color: "#ff3f7f",
    fontWeight: "600",
  },
});