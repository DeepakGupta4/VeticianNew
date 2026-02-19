import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Stethoscope, Edit } from 'lucide-react-native';

const MOCK_PATIENT = {
  name: 'Bruno',
  species: 'Dog',
  breed: 'Labrador',
  gender: 'Male',
  age: 4,
  color: 'Brown',
  weight: 24,
  height: 60,
  petPhoto: 'https://place-puppy.com/300x300',
  allergies: 'Dust allergy',
  chronicDiseases: 'None',
  surgeries: 'Leg surgery | 05-08-2024 | City Vet Hospital',
  lastVetVisit: '2024-10-15',
  nextVetVisit: '2025-02-01',
  notes: 'Very active and friendly',
};

export default function PatientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const patient = MOCK_PATIENT; // later replace with API call

  function InfoCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
}

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: patient.petPhoto }} style={styles.photo} />
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.sub}>
          {patient.species} • {patient.breed} • {patient.gender}
        </Text>
        <Text style={styles.age}>{patient.age} years old</Text>
      </View>

      {/* Info Cards */}
      <InfoCard title="Basic Details">
        <InfoRow label="Color" value={patient.color} />
        <InfoRow label="Weight" value={`${patient.weight} kg`} />
        <InfoRow label="Height" value={`${patient.height} cm`} />
      </InfoCard>

      <InfoCard title="Medical History">
        <InfoRow label="Allergies" value={patient.allergies} />
        <InfoRow label="Chronic Diseases" value={patient.chronicDiseases} />
      </InfoCard>

      <InfoCard title="Surgeries">
        <Text style={styles.text}>
          {patient.surgeries || 'No surgeries recorded'}
        </Text>
      </InfoCard>

      <InfoCard title="Vet Visits">
        <InfoRow label="Last Visit" value={patient.lastVetVisit} />
        <InfoRow label="Next Visit" value={patient.nextVetVisit} />
      </InfoCard>

      <InfoCard title="Notes">
        <Text style={styles.text}>{patient.notes}</Text>
      </InfoCard>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/appointment?patientId=${id}`)}
        >
          <Calendar size={18} color="#fff" />
          <Text style={styles.btnText}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => router.push(`/edit_patient/${id}`)}
        >
          <Edit size={18} color="#fff" />
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  sub: {
    color: '#6B7280',
    marginTop: 4,
  },
  age: {
    color: '#374151',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 14,
    borderRadius: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#6B7280',
  },
  value: {
    fontWeight: '500',
  },
  text: {
    color: '#374151',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  editBtn: {
    backgroundColor: '#22C55E',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
