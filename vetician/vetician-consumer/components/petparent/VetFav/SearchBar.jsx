import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 as C, COLORS2 } from './colors';

/**
 * SearchBar Component
 *
 * Props:
 *  - value        {string}    Controlled input value
 *  - onChangeText {function}  Text change handler
 *  - placeholder  {string}    Placeholder text (optional)
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search by vet or clinic...',
}) {
  const handleClear = () => onChangeText('');

  return (
    <View style={s.wrap}>
      <View style={s.box}>
        <MaterialCommunityIcons name="magnify" size={18} color={C.subtext} />
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor="#9fad8e"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <MaterialCommunityIcons name="close-circle" size={16} color={C.subtext} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0E1',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS2.card,
    borderWidth: 1.5,
    borderColor: '#E8F0E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#2D3A1F',
    padding: 0,
  },
});
