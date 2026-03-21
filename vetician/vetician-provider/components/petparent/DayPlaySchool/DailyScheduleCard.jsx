import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

const SCHEDULE = [
  { time: '9:00 AM',  event: 'Check-in & Welcome' },
  { time: '10:00 AM', event: 'Group Play Session' },
  { time: '12:00 PM', event: 'Lunch & Rest' },
  { time: '2:00 PM',  event: 'Outdoor Activities' },
  { time: '4:00 PM',  event: 'Light Snacks & Play' },
  { time: '6:00 PM',  event: 'Pick-up Time' },
];

export default function DailyScheduleCard({ delay = 200 }) {
  return (
    <FadeInCard delay={delay} style={styles.card}>
      <Text style={styles.title}>Typical Day Schedule</Text>
      {SCHEDULE.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {i < SCHEDULE.length - 1 && <View style={styles.line} />}
          </View>
          <View style={[styles.content, i === SCHEDULE.length - 1 && { paddingBottom: 0 }]}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.event}>{item.event}</Text>
          </View>
        </View>
      ))}
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  timeline: {
    alignItems: 'center',
    width: 18,
    marginRight: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS2.secondary,
    marginTop: 3,
    flexShrink: 0,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS2.border,
    marginTop: 3,
    minHeight: 18,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  time: {
    fontSize: 11.5,
    color: COLORS2.primary,
    fontWeight: '700',
    marginBottom: 1,
  },
  event: {
    fontSize: 13,
    color: COLORS2.text,
    lineHeight: 18,
  },
});
