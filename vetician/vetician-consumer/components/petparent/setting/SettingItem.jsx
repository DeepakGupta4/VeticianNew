import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const SettingItem = ({
  icon, iconColor, label, subtitle,
  onPress, isLast = false, rightEl, danger = false,
}) => {
  const bg = useRef(new Animated.Value(0)).current;
  const onIn  = () => Animated.timing(bg, { toValue: 1, duration: 80,  useNativeDriver: false }).start();
  const onOut = () => Animated.timing(bg, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  const bgColor = bg.interpolate({ inputRange: [0, 1], outputRange: ['rgba(85,139,47,0)', 'rgba(85,139,47,0.06)'] });

  return (
    <Animated.View style={[styles.wrapper, !isLast && styles.border, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
      >
        <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={danger ? '#C62828' : (iconColor || COLORS2.primary)}
          />
        </View>
        <View style={styles.labelBlock}>
          <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightEl !== undefined ? rightEl : (
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS2.subtext} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  border: { borderBottomWidth: 1, borderBottomColor: COLORS2.border },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS2.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBoxDanger: { backgroundColor: '#FFEBEE' },
  labelBlock: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS2.text },
  labelDanger: { color: '#C62828' },
  subtitle: { fontSize: 12, color: COLORS2.subtext, marginTop: 1 },
});

export default SettingItem;
