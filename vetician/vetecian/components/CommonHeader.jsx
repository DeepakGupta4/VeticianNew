import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function CommonHeader({ title, showBack = true }) {
  return (
    <View style={{ backgroundColor: "#4CAF50", padding: 16, paddingTop: 40 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ color: "#fff", fontSize: 24 }}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
