import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ServiceItem from './ServiceItem';
import { COLORS2 } from './colors';

const services = [
  { icon: 'content-cut',   title: 'Grooming',    description: 'Discounted sessions' },
  { icon: 'dog-side',      title: 'Training',    description: 'Expert-led programs' },
  { icon: 'eye',           title: 'Pet Watching',description: 'Real-time monitoring' },
  { icon: 'weather-sunny', title: 'Daycare',     description: 'Safe daily care' },
  { icon: 'home-heart',    title: 'Hostel',      description: 'Comfortable stays' },
  { icon: 'stethoscope',   title: 'Vet Consult', description: 'Priority booking' },
];

export default function ServicesIncluded() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Included Services</Text>
      <Text style={styles.sectionSub}>All services powered by your membership</Text>
      <View style={styles.grid}>
        {services.map((s, i) => (
          <ServiceItem key={i} icon={s.icon} title={s.title} description={s.description} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS2.subtext,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
