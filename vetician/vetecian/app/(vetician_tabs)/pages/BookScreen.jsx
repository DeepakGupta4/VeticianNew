import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getPetsByUserId, getAllVerifiedClinics, addBooking } from "../../../store/slices/authSlice";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import CommonHeader from "../../../components/CommonHeader";
import AsyncStorage from '@react-native-async-storage/async-storage';

const services = [
  "Video Consultation",
  "Doorstep Service",
  "Pet Watching",
  "Book a Hostel",
  "Day/Play School",
  "Pet Training",
  "Pet Grooming",
  "Find Clinics",
  "Health Tips",
];

const clinics = [
  {
    id: 1,
    name: "Happy Paws Clinic",
    doctor: "Dr. Sharma",
    slots: ["10:00 AM", "11:00 AM", "4:00 PM"],
  },
  {
    id: 2,
    name: "PetCare Hospital",
    doctor: "Dr. Verma",
    slots: ["9:30 AM", "1:00 PM", "5:30 PM"],
  },
];

export default function BookScreen() {
  const dispatch = useDispatch();
  const reduxPets = useSelector(state => state.auth?.userPets?.data || []);
  const verifiedClinics = useSelector(state => state.auth?.verifiedClinics?.data || []);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      Promise.all([
        dispatch(getPetsByUserId()),
        dispatch(getAllVerifiedClinics())
      ]).finally(() => setLoading(false));
    }, [])
  );

  const confirmBooking = async () => {
    try {
      setLoading(true);
      
      // Map service to bookingType
      const bookingTypeMap = {
        'Video Consultation': 'video',
        'Doorstep Service': 'in-clinic',
        'Pet Watching': 'in-clinic',
        'Book a Hostel': 'in-clinic',
        'Day/Play School': 'in-clinic',
        'Pet Training': 'in-clinic',
        'Pet Grooming': 'in-clinic',
        'Find Clinics': 'in-clinic',
        'Health Tips': 'in-clinic'
      };
      
      // Create appointment date with selected time
      const appointmentDate = new Date();
      if (selectedDate === 'Tomorrow') {
        appointmentDate.setDate(appointmentDate.getDate() + 1);
      }
      
      // Parse selected time slot (e.g., "10:00 AM" or "10:00 AM - 11:00 AM")
      const timeStr = selectedSlot.split(' - ')[0]; // Get start time
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      appointmentDate.setHours(hour, parseInt(minutes), 0, 0);
      
      const bookingData = {
        clinicId: selectedClinic?.clinicId || null,
        veterinarianId: selectedClinic?.vetId || null,
        petName: selectedPet.name,
        petType: selectedPet.species || 'Dog',
        breed: selectedPet.breed || selectedPet.species || 'Mixed',
        illness: 'General checkup',
        date: appointmentDate.toISOString(),
        bookingType: bookingTypeMap[selectedService] || 'in-clinic',
        contactInfo: '1234567890',
        petPic: selectedPet.petPhoto || selectedPet.image || '🐾',
      };

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api'}/auth/petparent/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Appointment Booked ✅",
          `${selectedPet.name} | ${selectedService}\n${selectedClinic?.clinicName || 'Service'}\n${selectedDate} at ${selectedSlot}`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(vetician_tabs)/pages/MyBookings');
              }
            }
          ]
        );
      } else {
        console.error('Booking error:', result);
        Alert.alert('Error', result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <CommonHeader title="Book Appointment" />
      <ScrollView style={{ flex: 1, padding: 16 }}>

      {/* PET */}
      <Section title="Select Pet">
        {reduxPets.length === 0 ? (
          <Text style={{ color: "#666", textAlign: "center", padding: 20 }}>
            No pets added yet. Add a pet to book an appointment.
          </Text>
        ) : (
          reduxPets.map((pet) => (
            <Option
              key={pet._id}
              label={`${pet.name} (${pet.breed || pet.species || "Pet"})`}
              active={selectedPet?._id === pet._id}
              onPress={() => setSelectedPet(pet)}
            />
          ))
        )}
      </Section>

      {/* SERVICE */}
      {selectedPet && (
        <Section title="Select Service">
          {services.map((service) => (
            <Option
              key={service}
              label={service}
              active={selectedService === service}
              onPress={() => {
                setSelectedService(service);
                setSelectedClinic(null);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
            />
          ))}
        </Section>
      )}

      {/* CLINIC - Only for Video Consultation */}
      {selectedService === "Video Consultation" && (
        <Section title="Select Clinic">
          {verifiedClinics.length === 0 ? (
            <Text style={{ color: "#666", textAlign: "center", padding: 20 }}>
              No clinics available. Please try again later.
            </Text>
          ) : (
            verifiedClinics.map((item) => {
              const clinic = item.clinicDetails;
              const vet = item.veterinarianDetails;
              
              // Handle timings - can be object or string
              let slots = ["10:00 AM", "2:00 PM", "5:00 PM"]; // default
              if (clinic.timings) {
                if (typeof clinic.timings === 'string') {
                  slots = clinic.timings.split(',').map(t => t.trim());
                } else if (typeof clinic.timings === 'object') {
                  // Extract time slots from object format
                  slots = Object.values(clinic.timings)
                    .filter(t => t && t.start && t.end)
                    .map(t => `${t.start} - ${t.end}`);
                }
              }
              
              return (
                <Option
                  key={clinic.clinicId}
                  label={`${clinic.clinicName} • ${vet?.name || 'Doctor'}`}
                  active={selectedClinic?.clinicId === clinic.clinicId}
                  onPress={() => {
                    setSelectedClinic({ 
                      ...clinic, 
                      doctor: vet?.name, 
                      slots,
                      vetId: vet?.vetId,
                      clinicId: clinic.clinicId
                    });
                  }}
                />
              );
            })
          )}
        </Section>
      )}

      {/* OTHER SERVICES - Direct to date/time */}
      {selectedService && selectedService !== "Video Consultation" && selectedService !== "Find Clinics" && (
        <View style={{ backgroundColor: "#E3F2FD", padding: 16, borderRadius: 12, marginBottom: 20 }}>
          <Text style={{ color: "#1976D2", fontSize: 14, fontWeight: "600" }}>
            ℹ️ {selectedService === "Doorstep Service" ? "Our vet will visit your home" : 
               selectedService === "Book a Hostel" ? "Select boarding facility for overnight stay" :
               selectedService === "Day/Play School" ? "Select daycare center for daily activities" :
               selectedService === "Pet Watching" ? "Pet sitter will come to your home" :
               selectedService === "Pet Training" ? "Professional trainer will visit" :
               selectedService === "Pet Grooming" ? "Grooming service at your location" :
               "Service will be provided at your location"}
          </Text>
        </View>
      )}

      {/* DATE */}
      {(selectedClinic || (selectedService && selectedService !== "Video Consultation" && selectedService !== "Find Clinics")) && (
        <Section title="Select Date">
          <Option
            label="Today"
            active={selectedDate === "Today"}
            onPress={() => setSelectedDate("Today")}
          />
          <Option
            label="Tomorrow"
            active={selectedDate === "Tomorrow"}
            onPress={() => setSelectedDate("Tomorrow")}
          />
        </Section>
      )}

      {/* TIME SLOT */}
      {selectedDate && (
        <Section title="Select Time Slot">
          {(selectedClinic?.slots || ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"]).map((slot) => (
            <Option
              key={slot}
              label={slot}
              active={selectedSlot === slot}
              onPress={() => setSelectedSlot(slot)}
            />
          ))}
        </Section>
      )}

      {/* CONFIRM */}
      {selectedSlot && (
        <TouchableOpacity
          onPress={confirmBooking}
          style={{
            backgroundColor: "#4CAF50",
            padding: 16,
            borderRadius: 12,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Confirm Appointment
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </View>
  );
}

/* ------------------ COMPONENTS ------------------ */

const Section = ({ title, children }) => (
  <View style={{ marginBottom: 20 }}>
    <Text
      style={{
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
      }}
    >
      {title}
    </Text>
    {children}
  </View>
);

const Option = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      padding: 14,
      borderRadius: 12,
      backgroundColor: active ? "#4CAF50" : "#fff",
      marginBottom: 10,
      borderWidth: 1,
      borderColor: active ? "#4CAF50" : "#ddd",
    }}
  >
    <Text style={{ color: active ? "#fff" : "#000" }}>{label}</Text>
  </TouchableOpacity>
);
