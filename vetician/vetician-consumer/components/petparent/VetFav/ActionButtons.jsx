import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 as C } from './colors';

/**
 * ActionButtons Component
 * Grid of action buttons shown on the VetDetailsScreen hero section.
 *
 * Props:
 *  - onCall   {function}  Initiate call
 *  - onBook   {function}  Open booking screen
 *  - onChat   {function}  Open chat screen
 *  - onRemove {function}  Remove from favorites
 */
export default function ActionButtons({ onCall, onBook, onChat, onRemove }) {
  const buttons = [
    {
      label: 'Call',
      icon: 'phone-outline',
      action: onCall,
      variant: 'default',
    },
    {
      label: 'Book',
      icon: 'calendar-check-outline',
      action: onBook,
      variant: 'default',
    },
    {
      label: 'Chat',
      icon: 'chat-outline',
      action: onChat,
      variant: 'default',
    },
    {
      label: 'Remove',
      icon: 'trash-can-outline',
      action: onRemove,
      variant: 'danger',
    },
  ];

  return (
    <View style={s.row}>
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.label}
          style={[s.btn, btn.variant === 'danger' && s.dangerBtn]}
          onPress={btn.action}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={btn.icon}
            size={20}
            color={btn.variant === 'danger' ? '#E53935' : C.primary}
          />
          <Text
            style={[
              s.label,
              btn.variant === 'danger' && s.dangerLabel,
            ]}
          >
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8F0E1',
    backgroundColor: '#FFFFFF',
  },
  dangerBtn: {
    borderColor: '#E8F0E1',
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D3A1F',
  },
  dangerLabel: {
    color: '#E53935',
  },
});
