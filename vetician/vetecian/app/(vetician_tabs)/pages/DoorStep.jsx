import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { getPetsByUserId, getParent } from '../../../store/slices/authSlice';
import ApiService from '../../../services/api';
import SocketService from '../../../services/socket';
import { isProfileComplete, getMissingFields } from '../../../utils/profileValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../../components/CommonHeader';

const { width } = Dimensions.get('window');

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({
      id: `${hour}:00`,
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      available: Math.random() > 0.3,
    });
    slots.push({
      id: `${hour}:30`,
      time: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`,
      available: Math.random() > 0.3,
    });
  }
  return slots;
};

const generateDates = () => {
  const dates = [];
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: i,
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[date.getDay()]}`,
    });
  }
  return dates;
};

// Booking Modal Component
const BookingModal = ({ visible, onClose, service }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => state.auth?.userPets?.data || []);
  const parentData = useSelector(state => state.auth?.parentData?.data?.parent?.[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [repeatBooking, setRepeatBooking] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [servicePartners, setServicePartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const dates = generateDates();
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (visible) {
      console.log('🔄 Modal opened, fetching pets...');
      console.log('📊 Current pets in Redux:', pets);
      dispatch(getPetsByUserId());
      fetchParavets();
      checkProfile();
    }
  }, [visible]);

  const checkProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId && !parentData) {
        await dispatch(getParent(userId)).unwrap();
      }
    } catch (error) {
      console.error('Error fetching parent data:', error);
    }
  };

  useEffect(() => {
    console.log('🐾 Pets updated:', pets.length, 'pets');
    if (pets.length > 0) {
      console.log('✅ First pet:', pets[0]);
    }
  }, [pets]);

  const fetchParavets = async () => {
    try {
      setLoadingPartners(true);
      console.log('🔍 Fetching paravets from API...');
      const response = await ApiService.getVerifiedParavets();
      console.log('✅ Paravets response:', response);
      console.log('📊 Paravets count:', response.data?.length || 0);
      setServicePartners(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching paravets:', error);
      setServicePartners([]);
    } finally {
      setLoadingPartners(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = service?.price || 0;
    const petMultiplier = selectedPets.length > 0 ? selectedPets.length : 1;
    const emergencyCharge = isEmergency ? 200 : 0;
    const discount = couponCode ? 100 : 0;
    return basePrice * petMultiplier + emergencyCharge - discount;
  };

  const handleConfirmBooking = async () => {
    console.log('🔵 Confirm Booking clicked!');
    console.log('🔵 Selected Date:', selectedDate);
    console.log('🔵 Selected Slot:', selectedSlot);
    console.log('🔵 Selected Partner:', selectedPartner);
    console.log('🔵 Selected Pets:', selectedPets);
    console.log('🔵 Is Emergency:', isEmergency);
    
    if (!selectedDate || !selectedSlot || !selectedPartner || selectedPets.length === 0) {
      console.log('❌ Missing required fields!');
      Alert.alert('Incomplete Information', 'Please select date, time slot, service partner, and at least one pet');
      return;
    }

    // Temporarily bypass profile check until backend is deployed
    console.log('⚠️ Profile check bypassed - backend deployment pending');
    // if (!isProfileComplete(parentData)) {
    //   console.log('❌ Profile incomplete!');
    //   const missingFields = getMissingFields(parentData);
    //   const missingFieldsList = missingFields.map(field => `  ${field}`).join('\n');
    //   
    //   Alert.alert(
    //     '⚠️ Complete Your Profile',
    //     `Please complete these fields to book services:\n\n${missingFieldsList}`,
    //     [
    //       { text: 'Later', style: 'cancel' },
    //       { 
    //         text: 'Complete Now', 
    //         onPress: () => {
    //           onClose();
    //           setTimeout(() => {
    //             router.push('/(vetician_tabs)/(tabs)/profile');
    //           }, 300);
    //         }
    //       }
    //     ]
    //   );
    //   return;
    // }

    try {
      const bookingData = {
        serviceType: service.title,
        petIds: selectedPets.map(p => p._id),
        servicePartnerId: selectedPartner.id,
        servicePartnerName: selectedPartner.name,
        appointmentDate: selectedDate.fullDate,
        timeSlot: selectedSlot.time,
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          landmark: 'Near Park'
        },
        isEmergency,
        repeatBooking,
        specialInstructions,
        paymentMethod,
        couponCode,
        basePrice: service.price,
        emergencyCharge: isEmergency ? 200 : 0,
        discount: couponCode ? 100 : 0,
        totalAmount: calculateTotal()
      };

      console.log('📤 Sending booking:', bookingData);
      const response = await ApiService.createDoorstepBooking(bookingData);
      console.log('✅ Booking response:', response);

      // Connect socket and emit booking created event
      SocketService.connect(user._id, 'user');

      onClose();
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your ${service.title} is confirmed!\n\nDate: ${selectedDate.label}, ${selectedDate.month} ${selectedDate.date}\nTime: ${selectedSlot.time}\nService Partner: ${selectedPartner.name}\nPets: ${selectedPets.map(p => p.name).join(', ')}\nTotal: ₹${calculateTotal()}`,
        [
          {
            text: 'View Bookings',
            onPress: () => {
              router.push('/(vetician_tabs)/(tabs)/MyBookings');
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('❌ Booking error:', error);
      Alert.alert('Error', error.message || 'Failed to create booking');
    }
  };

  const togglePetSelection = (pet) => {
    console.log('🐾 Toggling pet:', pet.name, pet._id);
    if (selectedPets.find(p => p._id === pet._id)) {
      console.log('❌ Removing pet from selection');
      setSelectedPets(selectedPets.filter(p => p._id !== pet._id));
    } else {
      console.log('✅ Adding pet to selection');
      setSelectedPets([...selectedPets, pet]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Book {service?.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Service Summary */}
          <View style={styles.serviceSummaryCard}>
            <View style={styles.serviceSummaryLeft}>
              <Text style={styles.serviceModalTitle}>{service?.title}</Text>
              <Text style={styles.serviceModalSubtitle}>{service?.subtitle}</Text>
              <Text style={styles.serviceDuration}>{service?.duration}</Text>
            </View>
            <View style={styles.serviceSummaryRight}>
              <Text style={styles.serviceModalPrice}>₹{service?.price}</Text>
              <Text style={styles.perVisit}>per visit</Text>
            </View>
          </View>

          {/* Emergency Booking */}
          <View style={styles.modalSection}>
            <View style={styles.emergencyRow}>
              <View style={styles.emergencyLeft}>
                <MaterialIcons name="emergency" size={24} color="#FF4757" />
                <View style={styles.emergencyText}>
                  <Text style={styles.emergencyTitle}>Emergency Booking</Text>
                  <Text style={styles.emergencySubtitle}>Get service within 2 hours (+₹200)</Text>
                </View>
              </View>
              <Switch
                value={isEmergency}
                onValueChange={setIsEmergency}
                trackColor={{ false: '#E0E0E0', true: '#FF4757' }}
                thumbColor={isEmergency ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Select Pets */}
          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Select Pets *</Text>
            {pets.length === 0 ? (
              <Text style={styles.noPetsText}>No pets found. Please add a pet first.</Text>
            ) : (
              <View style={styles.petsGrid}>
                {pets.map((pet) => {
                  const isSelected = selectedPets.find(p => p._id === pet._id);
                  return (
                    <TouchableOpacity
                      key={pet._id}
                      style={[
                        styles.petCard,
                        isSelected && styles.petCardSelected,
                      ]}
                      onPress={() => {
                        console.log('🐾 Pet card clicked:', pet.name);
                        togglePetSelection(pet);
                      }}
                      activeOpacity={0.7}
                    >
                      {isSelected && (
                        <View style={styles.petCheckbox}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                      )}
                      <Text style={styles.petEmoji}>{pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐱' : '🐾'}</Text>
                      <Text style={styles.petCardName}>{pet.name}</Text>
                      <Text style={styles.petCardType}>{pet.species}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Select Date */}
          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Select Date *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((date) => (
                <TouchableOpacity
                  key={date.id}
                  style={[
                    styles.dateCard,
                    selectedDate?.id === date.id && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.date}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.month}
                  </Text>
                  {date.id === 0 && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>Today</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Select Time Slot */}
          {!isEmergency && (
            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Select Time Slot *</Text>
              <View style={styles.slotsGrid}>
                {timeSlots.filter(slot => slot.available).slice(0, 12).map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      selectedSlot?.id === slot.id && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedSlot?.id === slot.id && styles.timeSlotTextSelected,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Repeat Booking */}
          <View style={styles.modalSection}>
            <View style={styles.repeatRow}>
              <View style={styles.repeatLeft}>
                <MaterialIcons name="repeat" size={20} color="#24A1DE" />
                <Text style={styles.repeatText}>Repeat Weekly</Text>
              </View>
              <Switch
                value={repeatBooking}
                onValueChange={setRepeatBooking}
                trackColor={{ false: '#E0E0E0', true: '#24A1DE' }}
                thumbColor={repeatBooking ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Select Service Partner */}
          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Select Service Partner *</Text>
            {loadingPartners ? (
              <Text style={styles.nearbyText}>Loading paravets...</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 }}>
                <MaterialIcons name="location-on" size={14} color="#10B981" />
                <Text style={styles.nearbyText}>{servicePartners.length} providers available nearby</Text>
              </View>
            )}
            
            {servicePartners.map((partner) => (
              <TouchableOpacity
                key={partner.id}
                style={[
                  styles.partnerCard,
                  selectedPartner?.id === partner.id && styles.partnerCardSelected,
                ]}
                onPress={() => setSelectedPartner(partner)}
              >
                <Image source={{ uri: partner.photo }} style={styles.partnerPhoto} />
                <View style={styles.partnerInfo}>
                  <View style={styles.partnerNameRow}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    {partner.verified && (
                      <MaterialIcons name="verified" size={16} color="#10B981" />
                    )}
                  </View>
                  <Text style={styles.partnerSpecialization}>{partner.specialization}</Text>
                  <Text style={styles.partnerExperience}>{partner.experience} experience</Text>
                  <View style={styles.partnerStats}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialIcons name="star" size={12} color="#FFA500" />
                      <Text style={styles.ratingText}>{partner.rating}</Text>
                    </View>
                    <Text style={styles.reviewsText}>({partner.reviews} reviews)</Text>
                    <Text style={styles.distanceText}>{partner.distance} away</Text>
                  </View>
                </View>
                <View style={styles.partnerRadio}>
                  {selectedPartner?.id === partner.id && (
                    <View style={styles.partnerRadioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Instructions */}
          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any specific requirements or pet behavior notes..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Coupon Code */}
          <View style={styles.modalSection}>
            <TouchableOpacity style={styles.couponRow} onPress={() => Alert.alert('Coming Soon', 'Coupon feature will be available soon!')}>
              <MaterialIcons name="local-offer" size={20} color="#10B981" />
              <Text style={styles.couponText}>Apply Coupon</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceSection}>
            <Text style={styles.priceSectionTitle}>Price Details</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Charge</Text>
              <Text style={styles.priceValue}>₹{service?.price}</Text>
            </View>

            {selectedPets.length > 1 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Additional Pets ({selectedPets.length - 1})</Text>
                <Text style={styles.priceValue}>₹{(selectedPets.length - 1) * service?.price}</Text>
              </View>
            )}

            {isEmergency && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Emergency Charge</Text>
                <Text style={styles.priceValue}>₹200</Text>
              </View>
            )}

            {couponCode && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Coupon Discount</Text>
                <Text style={styles.discountValue}>-₹100</Text>
              </View>
            )}

            <View style={styles.priceDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{calculateTotal()}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Payment Method</Text>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'online' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('online')}
            >
              <View style={styles.paymentRadio}>
                {paymentMethod === 'online' && <View style={styles.paymentRadioInner} />}
              </View>
              <MaterialIcons name="payment" size={20} color="#24A1DE" />
              <Text style={styles.paymentText}>Pay Online (Recommended)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentRadio}>
                {paymentMethod === 'cash' && <View style={styles.paymentRadioInner} />}
              </View>
              <MaterialIcons name="payments" size={20} color="#10B981" />
              <Text style={styles.paymentText}>Cash After Service</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomPrice}>₹{calculateTotal()}</Text>
            <Text style={styles.bottomPets}>{selectedPets.length} pet(s)</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Live Tracking Modal
const TrackingModal = ({ visible, onClose, booking }) => {
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'confirmed');
  const [eta, setEta] = useState(25);

  const statuses = [
    { id: 'pending', label: 'Booking Confirmed', icon: 'check-circle', color: '#10B981' },
    { id: 'confirmed', label: 'Partner Assigned', icon: 'person', color: '#24A1DE' },
    { id: 'in-progress', label: 'Service in Progress', icon: 'build', color: '#FF5722' },
    { id: 'completed', label: 'Service Completed', icon: 'done-all', color: '#4CAF50' },
  ];

  const partner = booking ? {
    name: booking.servicePartnerName || 'Service Partner',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    specialization: 'Paravet',
    rating: 4.8
  } : {
    name: 'Demo Partner',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    specialization: 'Paravet',
    rating: 4.8
  };

  useEffect(() => {
    if (booking) {
      setCurrentStatus(booking.status);
    }
  }, [booking]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.trackingContainer}>
        <View style={styles.trackingHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.trackingTitle}>Track Service</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map Placeholder */}
          <View style={styles.mapPlaceholder}>
            <MaterialIcons name="location-on" size={60} color="#24A1DE" />
            <Text style={styles.mapText}>Live Location Tracking</Text>
            <Text style={styles.etaText}>ETA: {eta} minutes</Text>
          </View>

          {/* Partner Info */}
          <View style={styles.trackingPartnerCard}>
            <Image source={{ uri: partner.photo }} style={styles.trackingPartnerPhoto} />
            <View style={styles.trackingPartnerInfo}>
              <Text style={styles.trackingPartnerName}>{partner.name}</Text>
              <Text style={styles.trackingPartnerRole}>{partner.specialization}</Text>
              <View style={styles.trackingRating}>
                <MaterialIcons name="star" size={14} color="#FFA500" />
                <Text style={styles.trackingRatingText}>{partner.rating}</Text>
              </View>
            </View>
            <View style={styles.trackingActions}>
              <TouchableOpacity style={styles.trackingActionBtn}>
                <Ionicons name="call" size={24} color="#24A1DE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.trackingActionBtn}>
                <Ionicons name="chatbubble" size={24} color="#24A1DE" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.timelineTitle}>Service Status</Text>
            {statuses.map((status, index) => {
              const isActive = statuses.findIndex(s => s.id === currentStatus) >= index;
              return (
                <View key={status.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineIcon,
                        { backgroundColor: isActive ? status.color : '#E0E0E0' },
                      ]}
                    >
                      <MaterialIcons
                        name={status.icon}
                        size={16}
                        color={isActive ? '#fff' : '#999'}
                      />
                    </View>
                    {index < statuses.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: isActive ? status.color : '#E0E0E0' },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        { color: isActive ? '#333' : '#999' },
                      ]}
                    >
                      {status.label}
                    </Text>
                    {isActive && currentStatus === status.id && (
                      <Text style={styles.timelineTime}>Just now</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* OTP Section */}
          <View style={styles.otpSection}>
            <MaterialIcons name="lock" size={24} color="#24A1DE" />
            <View style={styles.otpText}>
              <Text style={styles.otpTitle}>Service OTP: 4829</Text>
              <Text style={styles.otpSubtitle}>Share with partner to start service</Text>
            </View>
          </View>

          {/* Cancel Booking Button */}
          <TouchableOpacity 
            style={styles.cancelBookingBtn}
            onPress={() => {
              Alert.alert(
                'Cancel Booking',
                'Are you sure you want to cancel this booking?',
                [
                  { text: 'No', style: 'cancel' },
                  {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
                      onClose();
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.cancelBookingText}>Cancel Booking</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Component
const ParavetModule = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const parentData = useSelector(state => state.auth?.parentData?.data?.parent?.[0]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchParentData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId && !parentData) {
        dispatch(getParent(userId));
      }
    };
    fetchParentData();
    fetchServices();
    fetchUserBookings();
    
    // Setup refresh callback
    if (typeof window !== 'undefined') {
      window.refreshBookings = fetchUserBookings;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.refreshBookings;
      }
    };
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await ApiService.getDoorstepServices();
      setServices(response.data || []);
    } catch (error) {
      console.log('Using fallback services');
      // Fallback to default services if API fails
      setServices([
        {
          _id: '1',
          title: 'Vet Home Visit',
          subtitle: 'General checkup, injections, first aid',
          price: 599,
          duration: '45-60 min',
          icon: 'stethoscope',
          iconSet: 'FontAwesome5',
          color: '#FF6B6B',
        },
        {
          _id: '2',
          title: 'Vaccination at Home',
          subtitle: 'All vaccines administered safely',
          price: 499,
          duration: '30 min',
          icon: 'syringe',
          iconSet: 'FontAwesome5',
          color: '#4ECDC4',
        },
        {
          _id: '3',
          title: 'Pet Grooming',
          subtitle: 'Bath, haircut, nail trim',
          price: 799,
          duration: '90-120 min',
          icon: 'cut',
          iconSet: 'FontAwesome5',
          color: '#95E1D3',
        },
        {
          _id: '4',
          title: 'Pet Training Session',
          subtitle: 'Professional behavioral training',
          price: 899,
          duration: '60 min',
          icon: 'dog',
          iconSet: 'MaterialCommunityIcons',
          color: '#F38181',
        },
        {
          _id: '5',
          title: 'Physiotherapy',
          subtitle: 'Post-surgery & recovery care',
          price: 1299,
          duration: '60 min',
          icon: 'medical-bag',
          iconSet: 'MaterialCommunityIcons',
          color: '#AA96DA',
        },
        {
          _id: '6',
          title: 'Pet Walking',
          subtitle: 'Hourly or daily walks',
          price: 199,
          duration: '30 min',
          icon: 'walk',
          iconSet: 'MaterialCommunityIcons',
          color: '#FCBAD3',
        },
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await ApiService.getDoorstepBookings();
      setUserBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleServiceSelect = (service) => {
    console.log('🔵 Button clicked! Service:', service?.title);
    console.log('🔵 Parent data:', parentData);
    console.log('🔵 Is profile complete:', isProfileComplete(parentData));
    
    // Temporarily skip profile check for testing
    console.log('⚠️ Skipping profile check for testing');
    setSelectedService(service);
    setBookingModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Doorstep Service" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Pet Care at Your Doorstep</Text>
            <Text style={styles.heroSubtitle}>
              Professional veterinary services delivered to your home
            </Text>
            <View style={styles.heroFeatures}>
              <View style={styles.heroFeature}>
                <MaterialIcons name="verified-user" size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>Verified Partners</Text>
              </View>
              <View style={styles.heroFeature}>
                <MaterialIcons name="security" size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>100% Safe</Text>
              </View>
              <View style={styles.heroFeature}>
                <MaterialIcons name="access-time" size={16} color="#10B981" />
                <Text style={styles.heroFeatureText}>On-Time Service</Text>
              </View>
            </View>
          </View>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png' }}
            style={styles.heroImage}
          />
        </View>

        {/* Emergency Button */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => {
            if (!isProfileComplete(parentData)) {
              Alert.alert(
                'Complete Your Profile',
                'Please complete your profile to use emergency services.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Go to Profile', 
                    onPress: () => router.push('/(vetician_tabs)/(tabs)/profile')
                  }
                ]
              );
              return;
            }
            
            Alert.alert(
              'Emergency Service',
              'Do you need immediate veterinary assistance?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Book Now',
                  onPress: () => {
                    const emergencyService = services.find(s => s.title.includes('Vet Home Visit')) || services[0];
                    if (emergencyService) {
                      setSelectedService(emergencyService);
                      setBookingModalVisible(true);
                    }
                  }
                }
              ]
            );
          }}
        >
          <MaterialIcons name="emergency" size={24} color="#fff" />
          <View style={styles.emergencyButtonText}>
            <Text style={styles.emergencyButtonTitle}>Emergency Service</Text>
            <Text style={styles.emergencyButtonSubtitle}>Get help within 2 hours</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Text style={styles.sectionSubtitle}>Choose what your pet needs</Text>
          </View>

          {loadingServices ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#24A1DE" />
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : (
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <View
                  key={service._id || service.id}
                  style={styles.serviceCard}
                >
                  <View
                    style={[styles.serviceIconContainer, { backgroundColor: service.color + '20' }]}
                  >
                    {service.iconSet === 'FontAwesome5' ? (
                      <FontAwesome5 name={service.icon} size={28} color={service.color} />
                    ) : (
                      <MaterialCommunityIcons name={service.icon} size={28} color={service.color} />
                    )}
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle} numberOfLines={2}>
                    {service.subtitle}
                  </Text>
                  <View style={styles.serviceFooter}>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                    <Text style={styles.serviceDuration}>{service.duration}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.bookNowButton}
                    onPress={() => {
                      console.log('🟡 Book Now button pressed!');
                      handleServiceSelect(service);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bookNowText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Subscription Plans */}
        <View style={styles.subscriptionSection}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <Text style={styles.sectionSubtitle}>Save more with regular care</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
            <View style={styles.planCard}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>POPULAR</Text>
              </View>
              <Text style={styles.planName}>Weekly Grooming</Text>
              <Text style={styles.planPrice}>₹2,499<Text style={styles.planPeriod}>/month</Text></Text>
              <Text style={styles.planSavings}>Save ₹700</Text>
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>4 Grooming Sessions</Text>
                <Text style={styles.planFeature}>Free Nail Trimming</Text>
                <Text style={styles.planFeature}>Priority Booking</Text>
              </View>
              <TouchableOpacity style={styles.planButton} onPress={() => Alert.alert('Coming Soon', 'Subscription plans will be available soon!')}>
                <Text style={styles.planButtonText}>Subscribe</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.planCard}>
              <Text style={styles.planName}>Daily Walking</Text>
              <Text style={styles.planPrice}>₹3,999<Text style={styles.planPeriod}>/month</Text></Text>
              <Text style={styles.planSavings}>Save ₹1,200</Text>
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>30 Walking Sessions</Text>
                <Text style={styles.planFeature}>30 min per session</Text>
                <Text style={styles.planFeature}>Activity Reports</Text>
              </View>
              <TouchableOpacity style={styles.planButton} onPress={() => Alert.alert('Coming Soon', 'Subscription plans will be available soon!')}>
                <Text style={styles.planButtonText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Service & Book</Text>
              <Text style={styles.stepDescription}>
                Select the service you need and pick a convenient time slot
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Partner Assigned & Arrives</Text>
              <Text style={styles.stepDescription}>
                Verified professional reaches your home at scheduled time
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Service Completed & Pay</Text>
              <Text style={styles.stepDescription}>
                Pay online or cash after service completion
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Care Tips & Reminders</Text>
              <Text style={styles.stepDescription}>
                Receive follow-up care instructions and next service reminders
              </Text>
            </View>
          </View>
        </View>

        {/* Trust & Safety */}
        <View style={styles.trustSection}>
          <Text style={styles.sectionTitle}>Trust & Safety</Text>
          
          <View style={styles.trustGrid}>
            <View style={styles.trustCard}>
              <MaterialIcons name="verified" size={32} color="#10B981" />
              <Text style={styles.trustTitle}>Verified Partners</Text>
              <Text style={styles.trustDescription}>All service providers are background verified</Text>
            </View>

            <View style={styles.trustCard}>
              <MaterialIcons name="lock" size={32} color="#24A1DE" />
              <Text style={styles.trustTitle}>OTP Security</Text>
              <Text style={styles.trustDescription}>Service starts only after OTP verification</Text>
            </View>

            <View style={styles.trustCard}>
              <MaterialIcons name="sanitizer" size={32} color="#FF6B6B" />
              <Text style={styles.trustTitle}>Sanitized Tools</Text>
              <Text style={styles.trustDescription}>Partners use sanitized equipment</Text>
            </View>

            <View style={styles.trustCard}>
              <MaterialIcons name="camera-alt" size={32} color="#9C27B0" />
              <Text style={styles.trustTitle}>Before & After</Text>
              <Text style={styles.trustDescription}>Get service documentation photos</Text>
            </View>
          </View>
        </View>

        {/* Track Demo Button */}
        {userBookings.length > 0 && (
          <View style={styles.activeBookingsSection}>
            <Text style={styles.sectionTitle}>Active Bookings</Text>
            {userBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').map((booking) => (
              <TouchableOpacity
                key={booking._id}
                style={styles.activeBookingCard}
                onPress={() => {
                  setSelectedBooking(booking);
                  setTrackingModalVisible(true);
                }}
              >
                <View style={styles.bookingCardLeft}>
                  <Text style={styles.bookingServiceType}>{booking.serviceType}</Text>
                  <Text style={styles.bookingDate}>
                    {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot}
                  </Text>
                  <Text style={styles.bookingPartner}>{booking.servicePartnerName}</Text>
                </View>
                <View style={styles.bookingCardRight}>
                  <View style={[styles.statusBadge, { backgroundColor: booking.status === 'confirmed' ? '#10B981' : '#FF9800' }]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => {
            Alert.alert('Coming Soon', 'Live tracking feature will be available soon!');
          }}
        >
          <MaterialIcons name="location-on" size={20} color="#fff" />
          <Text style={styles.demoButtonText}>View Live Tracking Demo</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      {selectedService && (
        <BookingModal
          visible={bookingModalVisible}
          onClose={() => setBookingModalVisible(false)}
          service={selectedService}
        />
      )}

      <TrackingModal
        visible={trackingModalVisible}
        onClose={() => setTrackingModalVisible(false)}
        booking={selectedBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Loading Container
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#E3F2FD',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  heroFeatures: {
    gap: 8,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroFeatureText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  heroImage: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },

  // Emergency Button
  emergencyButton: {
    backgroundColor: '#FF4757',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyButtonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emergencyButtonSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },

  // Services Section
  servicesSection: {
    padding: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    height: 32,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24A1DE',
  },
  serviceDuration: {
    fontSize: 11,
    color: '#999',
  },
  bookNowButton: {
    backgroundColor: '#24A1DE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Subscription Section
  subscriptionSection: {
    padding: 16,
    paddingTop: 24,
  },
  plansScroll: {
    marginTop: 16,
  },
  planCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  planBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#24A1DE',
  },
  planPeriod: {
    fontSize: 14,
    color: '#999',
  },
  planSavings: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 13,
    color: '#666',
  },
  planButton: {
    backgroundColor: '#24A1DE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // How It Works
  howItWorksSection: {
    padding: 16,
    paddingTop: 24,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#24A1DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // Trust Section
  trustSection: {
    padding: 16,
    paddingTop: 24,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  trustCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  trustDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Demo Button
  demoButton: {
    backgroundColor: '#9C27B0',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Active Bookings
  activeBookingsSection: {
    padding: 16,
    paddingTop: 24,
  },
  activeBookingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingCardLeft: {
    flex: 1,
  },
  bookingServiceType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bookingPartner: {
    fontSize: 12,
    color: '#24A1DE',
    fontWeight: '600',
  },
  bookingCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Service Summary Card
  serviceSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceSummaryLeft: {
    flex: 1,
  },
  serviceModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceModalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#999',
  },
  serviceSummaryRight: {
    alignItems: 'flex-end',
  },
  serviceModalPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#24A1DE',
  },
  perVisit: {
    fontSize: 11,
    color: '#999',
  },

  // Modal Section
  modalSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },

  // Emergency Row
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyText: {
    marginLeft: 12,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emergencySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Pets Grid
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  noPetsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  petCard: {
    width: (width - 60) / 3,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  petCardSelected: {
    borderColor: '#24A1DE',
    backgroundColor: '#E3F2FD',
  },
  petCheckbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#24A1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  petCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  petCardType: {
    fontSize: 11,
    color: '#666',
  },

  // Date Cards
  dateCard: {
    width: 70,
    padding: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateCardSelected: {
    borderColor: '#24A1DE',
    backgroundColor: '#E3F2FD',
  },
  dateDay: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: 11,
    color: '#999',
  },
  dateTextSelected: {
    color: '#24A1DE',
  },
  todayBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  todayText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },

  // Time Slots
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  timeSlotSelected: {
    borderColor: '#24A1DE',
    backgroundColor: '#E3F2FD',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timeSlotTextSelected: {
    color: '#24A1DE',
  },

  // Repeat Row
  repeatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repeatText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Nearby Text
  nearbyText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 12,
  },

  // Partner Card
  partnerCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  partnerCardSelected: {
    borderColor: '#24A1DE',
    backgroundColor: '#E3F2FD',
  },
  partnerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  partnerSpecialization: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  partnerExperience: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  partnerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F57C00',
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 11,
    color: '#999',
  },
  distanceText: {
    fontSize: 11,
    color: '#24A1DE',
    fontWeight: '600',
  },
  partnerRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#24A1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#24A1DE',
  },

  // Text Area
  textArea: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    height: 100,
  },

  // Coupon Row
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },

  // Price Section
  priceSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  priceSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24A1DE',
  },

  // Payment Options
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    gap: 12,
  },
  paymentOptionSelected: {
    borderColor: '#24A1DE',
    backgroundColor: '#E3F2FD',
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#24A1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#24A1DE',
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomLeft: {},
  bottomPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24A1DE',
  },
  bottomPets: {
    fontSize: 12,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Tracking Modal
  trackingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Map Placeholder
  mapPlaceholder: {
    height: 250,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#24A1DE',
    marginTop: 12,
  },
  etaText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Tracking Partner Card
  trackingPartnerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  trackingPartnerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trackingPartnerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackingPartnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  trackingPartnerRole: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  trackingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trackingRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F57C00',
    marginLeft: 4,
  },
  trackingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  trackingActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Timeline
  timelineSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 6,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },

  // OTP Section
  otpSection: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  otpText: {
    marginLeft: 12,
  },
  otpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F57C00',
  },
  otpSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Cancel Booking Button
  cancelBookingBtn: {
    backgroundColor: '#FF4757',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBookingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ParavetModule;