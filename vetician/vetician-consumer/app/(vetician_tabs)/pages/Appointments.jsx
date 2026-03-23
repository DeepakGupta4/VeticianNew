import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const APPOINTMENTS = [
  { id: '1', pet: 'Luna', type: 'Vet Checkup', time: 'Oct 12, 10:00 AM', icon: '🩺' },
  { id: '2', pet: 'Max', type: 'Grooming', time: 'Oct 15, 2:30 PM', icon: '✂️' },
  { id: '3', pet: 'Cooper', type: 'Vaccination', time: 'Oct 20, 09:15 AM', icon: '💉' },
];

const AppointmentPage = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: 30 }}>{item.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.petName}>{item.pet}</Text>
        <Text style={styles.details}>{item.type}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Visits</Text>
      <FlatList
        data={APPOINTMENTS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  iconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 15 },
  petName: { fontSize: 18, fontWeight: 'bold' },
  details: { color: '#666', marginVertical: 2 },
  time: { color: '#007AFF', fontWeight: '600' },
  button: { backgroundColor: '#F0F0F0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: '#555', fontWeight: 'bold' }
});

export default AppointmentPage;