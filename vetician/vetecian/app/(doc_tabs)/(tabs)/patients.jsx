import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const MOCK_PATIENTS = [
  {
    id: '1',
    name: 'Bruno',
    species: 'Dog',
    breed: 'Labrador',
    gender: 'Male',
    age: 4,
    photo: 'https://place-puppy.com/200x200',
    isActive: true,
  },
  {
    id: '2',
    name: 'Kitty',
    species: 'Cat',
    breed: 'Persian',
    gender: 'Female',
    age: 2,
    photo: 'https://placekitten.com/200/200',
    isActive: true,
  },
];

export default function PatientsScreen() {
  const router = useRouter();

  const renderPatient = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/patient_detail/${item.id}`)}
    >
      <Image source={{ uri: item.photo }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subText}>
          {item.species} • {item.breed}
        </Text>
        <Text style={styles.subText}>
          {item.gender} • {item.age} yrs
        </Text>
      </View>

      <View
        style={[
          styles.status,
          { backgroundColor: item.isActive ? '#22C55E' : '#9CA3AF' },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patients</Text>

      <FlatList
        data={MOCK_PATIENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
