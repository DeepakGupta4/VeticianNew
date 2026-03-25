// components/appointments/ServiceSelector.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { SERVICES } from './data';

/**
 * ServiceSelector
 * Props:
 *   selected — service id string | null
 *   onSelect — (id: string) => void
 */
export default function ServiceSelector({ selected, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Select Service</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SERVICES.map((service) => {
          const isSelected = selected === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(service.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <MaterialIcons
                  name={service.icon}
                  size={22}
                  color={isSelected ? '#FFFFFF' : COLORS2.primary}
                />
              </View>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                {service.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize:      13,
    fontWeight:    '600',
    color:         COLORS2.subtext,
    marginBottom:  12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap:           10,
    paddingBottom:  2,
  },
  card: {
    alignItems:      'center',
    backgroundColor: COLORS2.card,
    borderRadius:    14,
    padding:         14,
    width:           90,
    borderWidth:     1.5,
    borderColor:     COLORS2.border,
    gap:             8,
  },
  cardSelected: {
    borderColor:     COLORS2.primary,
    backgroundColor: COLORS2.accent,
  },
  iconWrap: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  iconWrapSelected: {
    backgroundColor: COLORS2.primary,
  },
  cardLabel: {
    fontSize:   11,
    fontWeight: '600',
    color:      COLORS2.subtext,
    textAlign:  'center',
  },
  cardLabelSelected: {
    color: COLORS2.primary,
  },
});
