import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function PetSurgeriesScreen({ onSave }) {
  const [surgeries, setSurgeries] = useState([]);
  const [form, setForm] = useState({
    name: '',
    date: '',
    hospital: '',
    notes: '',
  });

  const addSurgery = () => {
    if (!form.name || !form.date) return;

    setSurgeries([...surgeries, form]);
    setForm({ name: '', date: '', hospital: '', notes: '' });
  };

  const removeSurgery = (index) => {
    const updated = surgeries.filter((_, i) => i !== index);
    setSurgeries(updated);
  };

  // 🔁 Convert array → string (for backend)
  const formatForBackend = () => {
    return surgeries
      .map(
        (s, i) =>
          `${i + 1}. ${s.name} | ${s.date} | ${s.hospital || 'N/A'} | ${
            s.notes || ''
          }`
      )
      .join('\n');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Surgeries History</Text>

      {/* Surgery Form */}
      <View style={styles.card}>
        <TextInput
          placeholder="Surgery Name *"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <TextInput
          placeholder="Surgery Date (DD-MM-YYYY) *"
          style={styles.input}
          value={form.date}
          onChangeText={(text) => setForm({ ...form, date: text })}
        />

        <TextInput
          placeholder="Vet / Hospital"
          style={styles.input}
          value={form.hospital}
          onChangeText={(text) => setForm({ ...form, hospital: text })}
        />

        <TextInput
          placeholder="Notes"
          style={[styles.input, styles.textArea]}
          multiline
          value={form.notes}
          onChangeText={(text) => setForm({ ...form, notes: text })}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addSurgery}>
          <Text style={styles.btnText}>+ Add Surgery</Text>
        </TouchableOpacity>
      </View>

      {/* Surgery List */}
      <FlatList
        data={surgeries}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.surgeryItem}>
            <View>
              <Text style={styles.surgeryName}>{item.name}</Text>
              <Text style={styles.surgeryText}>{item.date}</Text>
              {item.hospital ? (
                <Text style={styles.surgeryText}>{item.hospital}</Text>
              ) : null}
            </View>

            <TouchableOpacity onPress={() => removeSurgery(index)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Save */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => onSave(formatForBackend())}
      >
        <Text style={styles.btnText}>Save Surgeries</Text>
      </TouchableOpacity>
    </View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F7F8FA',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  addBtn: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  surgeryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 8,
  },
  surgeryName: {
    fontWeight: '600',
  },
  surgeryText: {
    color: '#555',
    fontSize: 12,
  },
  remove: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

