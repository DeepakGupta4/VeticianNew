import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function SearchBar({ value, onChangeText, onClear }) {
  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons name="magnify" size={20} color={COLORS2.subtext} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search communities or breeds"
        placeholderTextColor={COLORS2.subtext}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <MaterialCommunityIcons name="close-circle" size={18} color={COLORS2.subtext} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS2.text,
    paddingVertical: 0,
  },
});
