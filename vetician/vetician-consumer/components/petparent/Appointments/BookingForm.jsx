// components/appointments/BookingForm.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { SERVICES, PETS } from './data';
import ServiceSelector from './ServiceSelector';
import PetSelector     from './PetSelector';
import DateTimePicker  from './DateTimePicker';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

/**
 * BookingForm
 * Handles all booking form state locally.
 * Calls onBookingConfirmed(newAppointment) when the user confirms —
 * the parent is responsible for adding it to the shared list and
 * showing the success toast.
 *
 * Props:
 *   onBookingConfirmed — (appointment: object) => void
 */
export default function BookingForm({ onBookingConfirmed }) {
  const [service, setService] = useState(null);
  const [pet,     setPet    ] = useState(null);
  const [date,    setDate   ] = useState(null);
  const [time,    setTime   ] = useState(null);
  const [notes,   setNotes  ] = useState('');
  const [loading, setLoading] = useState(false);

  const scaleAnim     = useRef(new Animated.Value(1)).current;
  const isFormComplete = !!(service && pet && date && time);

  /* ── Button press micro-animation ── */
  const handlePressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  /* ── Reset after successful booking ── */
  const resetForm = () => {
    setService(null);
    setPet(null);
    setDate(null);
    setTime(null);
    setNotes('');
  };

  /* ── Confirm booking ── */
  const handleConfirm = async () => {
    if (!isFormComplete || loading) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token) {
        Alert.alert('Error', 'Please login to book an appointment');
        setLoading(false);
        return;
      }

      const serviceObj = SERVICES.find((s) => s.id === service);
      const petObj     = PETS.find((p) => p.id === pet);

      // Combine date and time into a single Date object
      const [hours, minutes] = time.split(':');
      const appointmentDate = new Date(date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Fetch user's pets to get actual pet data
      let actualPetData = null;
      try {
        const petsResponse = await fetch(`${API_URL}/auth/pets/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const petsData = await petsResponse.json();
        if (petsData.success && petsData.pets && petsData.pets.length > 0) {
          actualPetData = petsData.pets[0]; // Use first pet for now
        }
      } catch (e) {
        console.log('Could not fetch pets:', e);
      }

      // Fetch available clinics
      let clinicId = null;
      try {
        const clinicsResponse = await fetch(`${API_URL}/auth/petparent/verified/all-clinic`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const clinicsData = await clinicsResponse.json();
        if (clinicsData.success && clinicsData.clinics && clinicsData.clinics.length > 0) {
          clinicId = clinicsData.clinics[0]._id; // Use first clinic for now
        }
      } catch (e) {
        console.log('Could not fetch clinics:', e);
      }

      if (!clinicId) {
        Alert.alert('Error', 'No clinics available. Please try again later.');
        setLoading(false);
        return;
      }

      // Prepare API payload
      const payload = {
        clinicId: clinicId,
        veterinarianId: null, // Optional - can be selected by user
        petName: actualPetData?.name || petObj.name,
        petType: actualPetData?.type || actualPetData?.species || 'Dog',
        breed: actualPetData?.breed || petObj.breed || 'Mixed',
        illness: serviceObj.label + (notes ? ` - ${notes.trim()}` : ''),
        date: appointmentDate.toISOString(),
        bookingType: serviceObj.id === 'vet' ? 'in-clinic' : 'in-clinic', // Changed to 'in-clinic'
        contactInfo: await AsyncStorage.getItem('userPhone') || 'Not provided',
        petPic: actualPetData?.profilePic || actualPetData?.petPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(actualPetData?.name || petObj.name)}&background=4CAF50&color=fff`
      };

      console.log('Booking appointment with payload:', payload);

      const response = await fetch(`${API_URL}/auth/petparent/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Booking response:', result);

      if (response.ok && result.success) {
        // Create local appointment object for UI
        const newAppointment = {
          id: result.data.appointmentDetails._id,
          service: serviceObj.label,
          serviceIcon: serviceObj.icon,
          pet: petObj.name,
          petIcon: petObj.icon,
          date,
          time,
          status: 'upcoming',
          address: result.data.clinicDetails?.clinicName || '24 Green Paws Clinic',
          assignedTo: result.data.veterinarianDetails?.name || 'Veterinarian',
          notes: notes.trim(),
        };

        onBookingConfirmed(newAppointment);
        resetForm();
        Alert.alert('Success', 'Appointment booked successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ServiceSelector selected={service} onSelect={setService} />

      <View style={styles.divider} />

      <PetSelector selected={pet} onSelect={setPet} />

      <View style={styles.divider} />

      <DateTimePicker
        selectedDate={date}
        selectedTime={time}
        onDateChange={setDate}
        onTimeChange={setTime}
      />

      <View style={styles.divider} />

      {/* Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.label}>Add Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="e.g. Allergic to certain medications..."
          placeholderTextColor={COLORS2.shadow}
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      {/* Confirm CTA */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!isFormComplete || loading) && styles.confirmBtnDisabled,
          ]}
          onPress={handleConfirm}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={!isFormComplete || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmText}>Book Appointment</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:       20,
    paddingBottom: 40,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS2.border,
    marginBottom:    22,
  },
  notesSection: {
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
  notesInput: {
    backgroundColor: COLORS2.card,
    borderRadius:    14,
    borderWidth:     1.5,
    borderColor:     COLORS2.border,
    padding:         14,
    fontSize:        14,
    color:           COLORS2.text,
    minHeight:       90,
  },
  confirmBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS2.primary,
    borderRadius:    16,
    paddingVertical: 16,
    gap:              8,
    shadowColor:     COLORS2.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    10,
    elevation:       6,
    marginTop:        8,
  },
  confirmBtnDisabled: {
    backgroundColor: COLORS2.shadow,
    shadowOpacity:   0,
    elevation:       0,
  },
  confirmText: {
    fontSize:      16,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 20,
  },
});
