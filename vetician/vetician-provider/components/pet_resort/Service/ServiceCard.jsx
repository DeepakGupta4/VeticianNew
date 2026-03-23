import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const icons = {
  boarding: "home",
  grooming: "cut",
  vet: "medical",
  training: "school",
  daycare: "paw",
  transport: "car",
};

export default function ServiceCard({ id, title, description, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 1.06, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={() => onPress(id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale }] },
          selected && styles.selectedCard,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icons[id]} size={24} color="#4f9dd9" />
        </View>

        <View style={styles.textArea}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#4f9dd9",
  },

  iconContainer: {
    backgroundColor: "#eef5ff",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textArea: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a2b49",
  },

  description: {
    fontSize: 12,
    color: "#6b7a90",
    marginTop: 3,
  },
});