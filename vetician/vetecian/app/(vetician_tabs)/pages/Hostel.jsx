import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Switch, Alert
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// Note: DatePicker ke liye 'react-native-modal-datetime-picker' ya 'expo-date-picker' use karein
// Abhi ke liye maine placeholder logic diya hai

export default function BoardingFormScreen() {
  const [petName, setPetName] = useState('');
  const [checkInDate, setCheckInDate] = useState('Select Date');
  const [checkOutDate, setCheckOutDate] = useState('Select Date');
  const [isAggressive, setIsAggressive] = useState(false);
  const [medicine, setMedicine] = useState('');
  const [diet, setDiet] = useState('');

  const handleBooking = () => {
    if(!petName || checkInDate === 'Select Date') {
      Alert.alert("Error", "Please fill pet name and dates!");
      return;
    }
    Alert.alert("Form Submitted", "Your pet's boarding details have been saved.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Boarding Details Form</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION 1: DATES SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Choose Boarding Dates</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity style={styles.dateInputBox}>
              <Text style={styles.label}>Check-in Date</Text>
              <View style={styles.inputWithIcon}>
                <MaterialCommunityIcons name="calendar-import" size={20} color="#24A1DE" />
                <Text style={styles.dateValue}>{checkInDate}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateInputBox}>
              <Text style={styles.label}>Check-out Date</Text>
              <View style={styles.inputWithIcon}>
                <MaterialCommunityIcons name="calendar-export" size={20} color="#24A1DE" />
                <Text style={styles.dateValue}>{checkOutDate}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: PET INFO & HABITS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Pet Habits & Nature</Text>
          <Text style={styles.label}>Pet Name</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="e.g. Milo" 
            value={petName}
            onChangeText={setPetName}
          />

          <View style={styles.switchRow}>
            <View style={{flex: 1}}>
              <Text style={styles.boldLabel}>Friendly with other pets?</Text>
              <Text style={styles.subLabel}>Helps us decide play-group</Text>
            </View>
            <Switch 
              value={!isAggressive} 
              onValueChange={(val) => setIsAggressive(!val)}
              trackColor={{ false: "#ddd", true: "#24A1DE" }}
            />
          </View>

          <Text style={styles.label}>Any specific behavioral habits?</Text>
          <TextInput 
            style={[styles.textInput, styles.textArea]} 
            placeholder="e.g. Scared of thunder, likes belly rubs..." 
            multiline
            numberOfLines={3}
          />
        </View>

        {/* SECTION 3: MEDICINE & DIET */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Health & Nutrition</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="pill" size={18} color="#FF5252" />
              <Text style={[styles.label, {marginLeft: 5}]}>Medicine Details (if any)</Text>
            </View>
            <TextInput 
              style={[styles.textInput, styles.textArea]} 
              placeholder="Dosage, Timing, Medicine Name..." 
              value={medicine}
              onChangeText={setMedicine}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FontAwesome5 name="dog" size={16} color="#FBC02D" />
              <Text style={[styles.label, {marginLeft: 8}]}>Dietary Requirements</Text>
            </View>
            <TextInput 
              style={[styles.textInput, styles.textArea]} 
              placeholder="e.g. Only dry food, twice a day, allergic to chicken..." 
              value={diet}
              onChangeText={setDiet}
              multiline
            />
          </View>
        </View>

        {/* Emergency Info */}
        <View style={styles.emergencyNote}>
          <MaterialIcons name="info" size={20} color="#666" />
          <Text style={styles.emergencyText}>
            Our in-house vet will monitor your pet 24/7. In case of emergency, we will contact you immediately.
          </Text>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleBooking}>
          <Text style={styles.submitBtnText}>Confirm Boarding Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  header: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, 
    backgroundColor: '#fff', elevation: 2 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, color: '#333' },
  scrollContent: { padding: 16 },
  
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#24A1DE', marginBottom: 15 },
  
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  boldLabel: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  subLabel: { fontSize: 12, color: '#999' },
  
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInputBox: { width: '48%', backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  dateValue: { marginLeft: 8, color: '#333', fontWeight: 'bold' },

  textInput: { 
    backgroundColor: '#F9F9F9', borderRadius: 8, padding: 12, 
    borderWidth: 1, borderColor: '#eee', fontSize: 15, color: '#333', marginBottom: 15 
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  switchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginBottom: 20 },
  inputGroup: { marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },

  emergencyNote: { 
    flexDirection: 'row', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 10, 
    marginBottom: 20, alignItems: 'center' 
  },
  emergencyText: { flex: 1, marginLeft: 10, fontSize: 12, color: '#555', lineHeight: 18 },

  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  submitBtn: { backgroundColor: '#24A1DE', padding: 16, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
