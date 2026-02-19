import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../../../firebase.config";
import { useSelector, useDispatch } from "react-redux";
import { getPetsByUserId } from "../../../store/slices/authSlice";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";

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
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getPetsByUserId()).finally(() => setLoading(false));
    }, [])
  );

  const confirmBooking = () => {
    const booking = {
      pet: selectedPet.name,
      service: selectedService,
      clinic: selectedClinic.name,
      doctor: selectedClinic.doctor,
      date: selectedDate,
      time: selectedSlot,
      status: "Confirmed",
    };

    console.log("BOOKING DATA:", booking);

    Alert.alert(
      "Appointment Booked ✅",
      `${booking.pet} | ${booking.service}\n${booking.clinic}\n${booking.date} at ${booking.time}`
    );

    // reset (optional)
    setSelectedPet(null);
    setSelectedService(null);
    setSelectedClinic(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F6F7FB", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Book Appointment
      </Text>

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
              onPress={() => setSelectedService(service)}
            />
          ))}
        </Section>
      )}

      {/* CLINIC */}
      {selectedService && (
        <Section title="Select Clinic">
          {clinics.map((clinic) => (
            <Option
              key={clinic.id}
              label={`${clinic.name} • ${clinic.doctor}`}
              active={selectedClinic?.id === clinic.id}
              onPress={() => {
                setSelectedClinic(clinic);
                router.push('/pages/ClinicListScreen');
              }}
            />
          ))}
        </Section>
      )}

      {/* DATE */}
      {selectedClinic && (
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
          {selectedClinic.slots.map((slot) => (
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
