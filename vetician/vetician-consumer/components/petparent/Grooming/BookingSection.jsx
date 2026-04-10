import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const BookingSection = ({ selectedPet, selectedGroomer }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [homeService, setHomeService] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleBookAppointment = async () => {
    console.log('🔘 Book button clicked');
    console.log('Selected Pet:', selectedPet);
    
    if (!selectedPet) {
      Alert.alert('Pet Required', 'Please select a pet for grooming');
      return;
    }

    try {
      setLoading(true);
      console.log('⏳ Loading started');

      const userId = await AsyncStorage.getItem('userId');
      console.log('👤 User ID from storage:', userId ? 'Found' : 'Not found');
      
      if (!userId) {
        console.log('❌ No user ID');
        Alert.alert('Error', 'Please login to book an appointment');
        setLoading(false);
        return;
      }

      const bookingPayload = {
        userId: userId,
        petId: selectedPet.id,
        groomerId: selectedGroomer?.id || null,
        appointmentDate: date.toISOString(),
        appointmentTime: formatTime(time),
        serviceType: homeService ? 'home' : 'salon',
        services: ['Full Grooming'],
        addons: [],
        totalAmount: 0,
        specialInstructions: ''
      };

      console.log('📅 Booking payload:', JSON.stringify(bookingPayload, null, 2));
      console.log('🎯 Selected Groomer ID:', selectedGroomer?.id);
      console.log('🎯 Selected Groomer Full Object:', JSON.stringify(selectedGroomer, null, 2));
      console.log('🌐 API URL:', `${API_URL}/grooming/bookings`);

      const response = await fetch(`${API_URL}/grooming/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        console.log('✅ Booking created successfully');
        setBookingData(data.booking);
        setConfirmed(true);
        Alert.alert('Success! 🎉', 'Your grooming appointment has been booked successfully');
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'Unable to book appointment. Please try again.');
    } finally {
      setLoading(false);
      console.log('⏹️ Loading stopped');
    }
  };

  if (confirmed && bookingData) {
    return (
      <View style={styles.confirmed}>
        <View style={styles.confIcon}>
          <Icon name="check-decagram" size={36} color={COLORS.white} />
        </View>
        <Text style={styles.confTitle}>Booking Confirmed!</Text>
        <Text style={styles.confDetail}>
          {formatDate(date)} · {formatTime(time)}{'\n'}
          {homeService ? 'Home Service' : 'Salon Visit'}{'\n'}
          {selectedPet ? `${selectedPet.name} · ${selectedPet.breed}` : ''}
        </Text>
        <View style={styles.bookingIdBox}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingIdText}>{bookingData._id?.slice(-8).toUpperCase()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.confBtn} 
          onPress={() => {
            setConfirmed(false);
            setBookingData(null);
            setDate(new Date());
            setTime(new Date());
          }}
        >
          <Icon name="calendar-plus" size={15} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.confBtnText}>Book Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Icon name="calendar-check-outline" size={19} color={COLORS.primary} />
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      {/* Date Picker */}
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity 
        style={styles.dateTimeButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="calendar" size={20} color={COLORS.primary} />
        <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
        <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      <Text style={styles.label}>Select Time</Text>
      <TouchableOpacity 
        style={styles.dateTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Icon name="clock-outline" size={20} color={COLORS.primary} />
        <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
        <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}

      {/* Home Service Toggle */}
      <View style={styles.homeRow}>
        <View style={styles.homeLabelRow}>
          <Icon name="home-outline" size={17} color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.homeTitle}>Home Service</Text>
            <Text style={styles.homeSub}>Groomer visits your home</Text>
          </View>
        </View>
        <Switch
          value={homeService}
          onValueChange={setHomeService}
          trackColor={{ false: '#ccc', true: COLORS.secondary }}
          thumbColor={COLORS.white}
        />
      </View>

      {/* Selected Pet Info */}
      {selectedPet && (
        <View style={styles.petInfoBox}>
          <Icon name="paw" size={16} color={COLORS.primary} />
          <Text style={styles.petInfoText}>
            {selectedPet.name} · {selectedPet.breed}
          </Text>
        </View>
      )}

      {/* Book Button */}
      <TouchableOpacity 
        style={[styles.cta, loading && styles.ctaDisabled]} 
        onPress={handleBookAppointment}
        activeOpacity={0.88}
        disabled={loading}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.ctaText}>Booking...</Text>
          </>
        ) : (
          <>
            <Icon name="calendar-star" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.ctaText}>Book Grooming Appointment</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  title: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: COLORS.textPrimary, 
    marginLeft: 8 
  },
  label: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: COLORS.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 0.6, 
    marginBottom: 8,
    marginTop: 12
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  dateTimeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 10
  },
  homeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#f5faf0', 
    borderRadius: 12, 
    padding: 13, 
    marginTop: 16,
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  homeLabelRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  homeTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: COLORS.textPrimary 
  },
  homeSub: { 
    fontSize: 11, 
    color: COLORS.textMuted, 
    marginTop: 2 
  },
  petInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16
  },
  petInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8
  },
  cta: { 
    backgroundColor: COLORS.secondary, 
    borderRadius: RADIUS.btn, 
    paddingVertical: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  ctaDisabled: {
    opacity: 0.6
  },
  ctaText: { 
    color: COLORS.white, 
    fontWeight: '800', 
    fontSize: 14, 
    letterSpacing: 0.2 
  },
  confirmed: { 
    backgroundColor: COLORS.primary, 
    borderRadius: RADIUS.card, 
    padding: 28, 
    alignItems: 'center', 
    marginBottom: 24 
  },
  confIcon: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: 'rgba(255,255,255,0.18)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 14 
  },
  confTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: COLORS.white, 
    marginBottom: 6 
  },
  confDetail: { 
    fontSize: 12.5, 
    color: 'rgba(255,255,255,0.8)', 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 16 
  },
  bookingIdBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20
  },
  bookingIdLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 2
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1
  },
  confBtn: { 
    backgroundColor: COLORS.white, 
    borderRadius: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  confBtnText: { 
    color: COLORS.primary, 
    fontWeight: '800', 
    fontSize: 13 
  },
});

export default BookingSection;
