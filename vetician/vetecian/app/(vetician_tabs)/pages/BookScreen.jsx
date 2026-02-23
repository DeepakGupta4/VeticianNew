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

  const confirmBooking = () => {
    const booking = {
      _id: Date.now().toString(),
      petId: selectedPet._id,
      petName: selectedPet.name,
      service: selectedService,
      clinicId: selectedClinic?.clinicId || null,
      clinicName: selectedClinic?.clinicName || "Home Service",
      doctorName: selectedClinic?.doctor || "Service Provider",
      date: selectedDate,
      time: selectedSlot,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    dispatch(addBooking(booking));
    console.log("BOOKING DATA:", booking);

    Alert.alert(
      "Appointment Booked ✅",
      `${booking.petName} | ${booking.service}\n${booking.clinicName}\n${booking.date} at ${booking.time}`
    );

    router.push('pages/MyBookings');
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
              const slots = clinic.timings?.split(',').map(t => t.trim()) || ["10:00 AM", "2:00 PM", "5:00 PM"];
              
              return (
                <Option
                  key={clinic.clinicId}
                  label={`${clinic.clinicName} • ${vet?.name || 'Doctor'}`}
                  active={selectedClinic?.clinicId === clinic.clinicId}
                  onPress={() => {
                    setSelectedClinic({ ...clinic, doctor: vet?.name, slots });
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
