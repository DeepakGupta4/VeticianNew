import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { Platform } from 'react-native';
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPetsByUserId, getParent } from '../../../store/slices/authSlice';
import ApiService from '../../../services/api';
import SocketService from '../../../services/socket';
import { isProfileComplete, getMissingFields } from '../../../utils/profileValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../../components/CommonHeader';
import {
  Card,
  Text,
  Button,
  Switch,
  TextInput,
  SegmentedButtons,
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
  Chip,
  Surface,
  Divider,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';

const { width } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#EF4444',
    background: '#ffffff',
  },
};

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

// Normalize nested API paravet data to flat fields used in UI
const normalizeParavet = (p) => ({
  ...p,
  name: p.personalInfo?.fullName?.value || p.name || 'Paravet',
  photo: p.documents?.profilePhoto?.url || p.photo || `https://ui-avatars.com/api/?name=Paravet&size=70&background=9B59B6&color=fff`,
  specialization: p.experience?.areasOfExpertise?.value?.join(', ') || p.specialization || 'General Care',
  city: p.personalInfo?.city?.value || p.city || '',
  verified: p.applicationStatus?.approvalStatus === 'approved',
  rating: p.rating || 4.5,
  reviews: p.reviews || 0,
  distance: p.distance || 'Nearby',
});

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
      const response = await ApiService.getVerifiedParavets();
      if (response.data && response.data.length > 0) {
        setServicePartners(response.data.map(normalizeParavet));
      } else {
        setServicePartners([]);
        Alert.alert('No Paravets Available', 'There are no verified paravets available at the moment.');
      }
    } catch (error) {
      console.error('❌ Error fetching paravets:', error);
      setServicePartners([]);
      Alert.alert('Error', 'Failed to load service partners. Please try again.');
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
    console.log('\n🎯 ========== BOOKING PROCESS START ==========');
    console.log('📊 Redux State Check:');
    console.log('  - parentData exists:', !!parentData);
    console.log('  - parentData type:', typeof parentData);
    console.log('  - parentData value:', parentData);
    console.log('  - parentData keys:', parentData ? Object.keys(parentData) : 'N/A');
    console.log('\n📋 Full parentData:', JSON.stringify(parentData, null, 2));
    
    console.log('\n📝 Booking Details:');
    console.log('  - Selected date:', selectedDate);
    console.log('  - Selected slot:', selectedSlot);
    console.log('  - Selected partner:', selectedPartner?.name);
    console.log('  - Selected pets count:', selectedPets.length);
    
    const isComplete = isProfileComplete(parentData);
    console.log('\n📋 Profile validation result:', isComplete);

    if (!isComplete) {
      const missingFields = getMissingFields(parentData);
      Alert.alert(
        'Incomplete Profile',
        `Please complete the following fields: ${missingFields.join(', ')}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Complete Profile', 
            onPress: () => {
              onClose();
              setTimeout(() => {
                router.push('/(vetician_tabs)/(tabs)/profile');
              }, 300);
            }
          }
        ]
      );
      return;
    }

    if (!selectedDate || (!isEmergency && !selectedSlot) || !selectedPartner || selectedPets.length === 0) {
      console.log('❌ Missing required fields');
      Alert.alert('Incomplete Information', 'Please fill all required fields');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('👤 User ID:', userId);
      
      const bookingData = {
        userId,
        serviceType: service.title,
        petIds: selectedPets.map(p => p._id),
        paravetId: selectedPartner.id || selectedPartner.userId || selectedPartner._id,
        paravetName: selectedPartner.name,
        appointmentDate: selectedDate.fullDate,
        timeSlot: selectedSlot.time,
        address: parentData?.address || {
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
        totalAmount: calculateTotal(),
        status: 'pending'
      };

      console.log('📤 Sending booking:', JSON.stringify(bookingData, null, 2));
      console.log('👤 Paravet User ID being sent:', selectedPartner.id || selectedPartner.userId || selectedPartner._id);
      console.log('🔍 Full selectedPartner object:', JSON.stringify(selectedPartner, null, 2));
      const response = await ApiService.createDoorstepBooking(bookingData);
      console.log('✅ Booking response:', response);

      if (response.success) {
        console.log('✅ Booking created successfully:', response.data);
        console.log('📡 Attempting to emit socket event...');
        console.log('  - Socket connected:', SocketService.socket?.connected);
        console.log('  - Paravet User ID:', selectedPartner.id || selectedPartner.userId || selectedPartner._id);
        
        SocketService.connect(userId, 'user');
        SocketService.emit('booking:created', {
          bookingId: response.data._id,
          paravetId: selectedPartner.id || selectedPartner.userId || selectedPartner._id,
          userId
        });
        console.log('✅ Socket event emitted: booking:created');

        Alert.alert(
          'Booking Request Sent! 🎉',
          `Your booking request for ${service.title} has been sent to ${selectedPartner.name}.\n\nYou will be notified once the paravet accepts your request.\n\nDate: ${selectedDate.label}, ${selectedDate.month} ${selectedDate.date}\nTime: ${selectedSlot.time}\nTotal: ₹${calculateTotal()}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onClose();
                if (typeof window !== 'undefined' && window.refreshBookings) {
                  window.refreshBookings();
                }
              },
            },
          ]
        );
      } else {
        console.log('❌ Booking failed:', response);
        Alert.alert('Error', response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      console.error('❌ Error stack:', error.stack);
      Alert.alert('Error', error.message || 'Failed to create booking');
    }
  };

  const togglePetSelection = (pet) => {
    if (selectedPets.find(p => p._id === pet._id)) {
      setSelectedPets(selectedPets.filter(p => p._id !== pet._id));
    } else {
      setSelectedPets([...selectedPets, pet]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {service?.title}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollContent}>
          {/* Service Summary Card */}
          <Card style={styles.serviceSummaryCard}>
            <Card.Content style={styles.serviceSummaryContent}>
              <View style={styles.serviceSummaryLeft}>
                <Text variant="headlineSmall" style={styles.serviceModalTitle}>
                  {service?.title}
                </Text>
                <Text variant="bodySmall" style={styles.serviceModalSubtitle}>
                  {service?.subtitle}
                </Text>
                <View style={styles.serviceDurationContainer}>
                  <MaterialIcons name="schedule" size={14} color="#7CB342" />
                  <Text variant="labelSmall" style={styles.serviceDuration}>
                    {service?.duration}
                  </Text>
                </View>
              </View>
              <View style={styles.serviceSummaryRight}>
                <Text variant="displaySmall" style={styles.serviceModalPrice}>
                  ₹{service?.price}
                </Text>
                <Text variant="labelSmall" style={styles.perVisit}>
                  per visit
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Emergency Booking */}
          <Surface style={styles.modalSection}>
            <View style={styles.emergencyRow}>
              <View style={styles.emergencyLeft}>
                <MaterialIcons name="emergency" size={24} color="#FF6B6B" />
                <View style={styles.emergencyText}>
                  <Text variant="labelLarge" style={styles.emergencyTitle}>
                    Emergency Booking
                  </Text>
                  <Text variant="labelSmall" style={styles.emergencySubtitle}>
                    Get service within 2 hours (+₹200)
                  </Text>
                </View>
              </View>
              <Switch
                value={isEmergency}
                onValueChange={setIsEmergency}
                color={theme.colors.primary}
              />
            </View>
          </Surface>

          {/* Select Pets */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Select Pets <Text style={styles.required}>*</Text>
            </Text>
            {pets.length === 0 ? (
              <Text variant="bodySmall" style={styles.noPetsText}>
                No pets found. Please add a pet first.
              </Text>
            ) : (
              <View style={styles.petsGrid}>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet._id}
                    style={[
                      styles.petCard,
                      selectedPets.find(p => p._id === pet._id) && styles.petCardSelected,
                    ]}
                    onPress={() => togglePetSelection(pet)}
                  >
                    <View style={styles.petCheckbox}>
                      {selectedPets.find(p => p._id === pet._id) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.petEmoji}>
                      {pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐱' : '🐾'}
                    </Text>
                    <Text variant="labelMedium" style={styles.petCardName}>
                      {pet.name}
                    </Text>
                    <Text variant="labelSmall" style={styles.petCardType}>
                      {pet.species}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Surface>

          {/* Select Date */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Select Date <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScrollView}>
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
                    variant="labelSmall"
                    style={[
                      styles.dateDay,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text
                    variant="headlineMedium"
                    style={[
                      styles.dateNumber,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.date}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={[
                      styles.dateMonth,
                      selectedDate?.id === date.id && styles.dateTextSelected,
                    ]}
                  >
                    {date.month}
                  </Text>
                  {date.id === 0 && (
                    <View style={styles.todayBadge}>
                      <Text variant="labelSmall" style={styles.todayText}>
                        Today
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Surface>

          {/* Select Time Slot */}
          {!isEmergency && (
            <Surface style={styles.modalSection}>
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Select Time Slot <Text style={styles.required}>*</Text>
              </Text>
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
                      variant="labelMedium"
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
            </Surface>
          )}

          {/* Repeat Booking */}
          <Surface style={styles.modalSection}>
            <View style={styles.repeatRow}>
              <View style={styles.repeatLeft}>
                <MaterialIcons name="repeat" size={20} color={theme.colors.primary} />
                <Text variant="labelLarge" style={styles.repeatText}>
                  Repeat Weekly
                </Text>
              </View>
              <Switch
                value={repeatBooking}
                onValueChange={setRepeatBooking}
                color={theme.colors.primary}
              />
            </View>
          </Surface>

          {/* Select Service Partner */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Select Service Partner <Text style={styles.required}>*</Text>
            </Text>
            {loadingPartners ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={theme.colors.primary} />
                <Text variant="labelSmall" style={styles.loadingText}>
                  Loading paravets...
                </Text>
              </View>
            ) : (
              <View style={styles.nearbyProviders}>
                <MaterialIcons name="place" size={14} color={theme.colors.primary} />
                <Text variant="labelSmall" style={styles.nearbyText}>
                  {servicePartners.length} providers available nearby
                </Text>
              </View>
            )}
            
            <View style={styles.partnersList}>
              {servicePartners.map((partner) => (
                <TouchableOpacity
                  key={partner.id}
                  onPress={() => setSelectedPartner(partner)}
                  style={styles.partnerTouchable}
                >
                  <Card
                    style={[
                      styles.partnerCard,
                      selectedPartner?.id === partner.id && styles.partnerCardSelected,
                    ]}
                  >
                    <Card.Content style={styles.partnerCardContent}>
                      <Image source={{ uri: partner.photo }} style={styles.partnerPhoto} />
                      <View style={styles.partnerInfo}>
                        <View style={styles.partnerNameRow}>
                          <Text variant="labelLarge" style={styles.partnerName}>
                            {partner.name}
                          </Text>
                          {partner.verified && (
                            <MaterialIcons name="verified" size={16} color={theme.colors.primary} />
                          )}
                        </View>
                        <Text variant="labelSmall" style={styles.partnerSpecialization}>
                          {partner.specialization}
                        </Text>
                        <Text variant="labelSmall" style={styles.partnerExperience}>
                          {typeof partner.experience === 'string' 
                            ? partner.experience 
                            : `${partner.experience?.yearsOfExpertise?.value || 0}+ years`}
                        </Text>
                        <View style={styles.partnerStats}>
                          <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={12} color="#FFA500" />
                            <Text variant="labelSmall" style={styles.ratingText}>
                              {partner.rating}
                            </Text>
                          </View>
                          <Text variant="labelSmall" style={styles.reviewsText}>
                            ({partner.reviews} reviews)
                          </Text>
                          <Text variant="labelSmall" style={styles.distanceText}>
                            • {partner.distance} away
                          </Text>
                        </View>
                      </View>
                      <View style={styles.partnerRadio}>
                        {selectedPartner?.id === partner.id && (
                          <View style={styles.partnerRadioInner} />
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </Surface>

          {/* Special Instructions */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Special Instructions
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Any specific requirements or pet behavior notes..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={4}
              activeOutlineColor={theme.colors.primary}
              style={styles.textArea}
            />
          </Surface>

          {/* Coupon Code */}
          <Surface style={styles.modalSection}>
            <TouchableOpacity style={styles.couponRow}>
              <MaterialIcons name="local-offer" size={20} color={theme.colors.primary} />
              <Text variant="labelLarge" style={styles.couponText}>
                Apply Coupon Code
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </Surface>

          {/* Price Breakdown */}
          <Card style={styles.priceCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.priceSectionTitle}>
                Price Breakdown
              </Text>
              
              <View style={styles.priceRow}>
                <Text variant="bodySmall" style={styles.priceLabel}>
                  Service Charge
                </Text>
                <Text variant="bodySmall" style={styles.priceValue}>
                  ₹{service?.price}
                </Text>
              </View>

              {selectedPets.length > 1 && (
                <View style={styles.priceRow}>
                  <Text variant="bodySmall" style={styles.priceLabel}>
                    Additional Pets ({selectedPets.length - 1})
                  </Text>
                  <Text variant="bodySmall" style={styles.priceValue}>
                    ₹{(selectedPets.length - 1) * service?.price}
                  </Text>
                </View>
              )}

              {isEmergency && (
                <View style={styles.priceRow}>
                  <Text variant="bodySmall" style={styles.priceLabel}>
                    Emergency Charge
                  </Text>
                  <Text variant="bodySmall" style={styles.priceValue}>
                    ₹200
                  </Text>
                </View>
              )}

              {couponCode && (
                <View style={styles.priceRow}>
                  <Text variant="bodySmall" style={styles.priceLabel}>
                    Coupon Discount
                  </Text>
                  <Text variant="bodySmall" style={styles.discountValue}>
                    -₹100
                  </Text>
                </View>
              )}

              <Divider style={styles.priceDivider} />

              <View style={styles.totalRow}>
                <Text variant="titleMedium" style={styles.totalLabel}>
                  Total Amount
                </Text>
                <Text variant="displaySmall" style={styles.totalValue}>
                  ₹{calculateTotal()}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Payment Method */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Payment Method
            </Text>
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
              <MaterialIcons name="payment" size={20} color={theme.colors.primary} />
              <Text variant="labelLarge" style={styles.paymentText}>
                Pay Online (Recommended)
              </Text>
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
              <MaterialIcons name="payments" size={20} color={theme.colors.primary} />
              <Text variant="labelLarge" style={styles.paymentText}>
                Cash After Service
              </Text>
            </TouchableOpacity>
          </Surface>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Bar */}
        <Surface style={styles.bottomBar}>
          <View style={styles.bottomLeft}>
            <Text variant="displaySmall" style={styles.bottomPrice}>
              ₹{calculateTotal()}
            </Text>
            <Text variant="labelSmall" style={styles.bottomPets}>
              {selectedPets.length} pet(s)
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleConfirmBooking}
            disabled={!selectedDate || (!isEmergency && !selectedSlot) || !selectedPartner || selectedPets.length === 0}
            buttonColor={theme.colors.primary}
            style={styles.confirmButton}
          >
            Confirm Booking
          </Button>
        </Surface>
      </View>
    </Modal>
  );
};

// Live Tracking Modal
const TrackingModal = ({ visible, onClose, booking }) => {
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'confirmed');
  const [eta, setEta] = useState(25);

  const statuses = [
    { id: 'pending', label: 'Booking Confirmed', icon: 'check-circle', color: theme.colors.primary },
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
      <View style={styles.trackingContainer}>
        <View style={styles.trackingHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text variant="headlineSmall" style={styles.trackingTitle}>
            Track Service
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map Placeholder */}
          <Surface style={styles.mapPlaceholder}>
            <MaterialIcons name="location-on" size={60} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.mapText}>
              Live Location Tracking
            </Text>
            <Text variant="labelSmall" style={styles.etaText}>
              ETA: {eta} minutes
            </Text>
          </Surface>

          {/* Partner Info */}
          <Card style={styles.trackingPartnerCard}>
            <Card.Content style={styles.trackingPartnerCardContent}>
              <Image source={{ uri: partner.photo }} style={styles.trackingPartnerPhoto} />
              <View style={styles.trackingPartnerInfo}>
                <Text variant="titleMedium" style={styles.trackingPartnerName}>
                  {partner.name}
                </Text>
                <Text variant="labelSmall" style={styles.trackingPartnerRole}>
                  {partner.specialization}
                </Text>
                <View style={styles.trackingRating}>
                  <MaterialIcons name="star" size={14} color="#FFA500" />
                  <Text variant="labelSmall" style={styles.trackingRatingText}>
                    {partner.rating}
                  </Text>
                </View>
              </View>
              <View style={styles.trackingActions}>
                <TouchableOpacity style={styles.trackingActionBtn}>
                  <Ionicons name="call" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.trackingActionBtn}>
                  <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          {/* Status Timeline */}
          <Card style={styles.timelineCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.timelineTitle}>
                Service Status
              </Text>
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
                        variant="labelMedium"
                        style={[
                          styles.timelineLabel,
                          { color: isActive ? '#333' : '#999' },
                        ]}
                      >
                        {status.label}
                      </Text>
                      {isActive && currentStatus === status.id && (
                        <Text variant="labelSmall" style={styles.timelineTime}>
                          Just now
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </Card.Content>
          </Card>

          {/* OTP Section */}
          <Card style={styles.otpCard}>
            <Card.Content style={styles.otpCardContent}>
              <MaterialIcons name="lock" size={24} color={theme.colors.primary} />
              <View style={styles.otpText}>
                <Text variant="labelLarge" style={styles.otpTitle}>
                  Service OTP: 4829
                </Text>
                <Text variant="labelSmall" style={styles.otpSubtitle}>
                  Share with partner to start service
                </Text>
              </View>
            </Card.Content>
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

// Main Component
const ParavetModule = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const parentData = useSelector(state => state.auth?.parentData?.data?.parent?.[0]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedParavet, setSelectedParavet] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [paravetSelectionVisible, setParavetSelectionVisible] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paravets, setParavets] = useState([]);
  const [loadingParavets, setLoadingParavets] = useState(false);
  
  useEffect(() => {
    fetchParavets();
    fetchUserBookings();
    setTimeout(() => setParavetSelectionVisible(true), 500);
    
    const setupSocketListeners = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        SocketService.connect(userId, 'user');
        
        SocketService.on('booking:statusUpdated', (data) => {
          console.log('🔔 Booking status updated:', data);
          fetchUserBookings();
          
          if (data.status === 'accepted') {
            Alert.alert(
              'Booking Accepted! 🎉',
              `${data.paravetName} has accepted your booking request for ${data.serviceType}.`,
              [{ text: 'OK' }]
            );
          } else if (data.status === 'rejected') {
            Alert.alert(
              'Booking Declined',
              `${data.paravetName} has declined your booking request. Please try booking with another paravet.`,
              [{ text: 'OK' }]
            );
          }
        });
      }
    };
    
    setupSocketListeners();
    
    if (typeof window !== 'undefined') {
      window.refreshBookings = fetchUserBookings;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.refreshBookings;
      }
      SocketService.off('booking:statusUpdated');
    };
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await ApiService.getDoorstepBookings();
      setUserBookings(response.data || []);
    } catch (error) {
      // Silently ignore — endpoint may not be deployed yet
      setUserBookings([]);
    }
  };

  const fetchParavets = async () => {
    try {
      setLoadingParavets(true);
      const response = await ApiService.getVerifiedParavets();
      setParavets((response.data || []).map(normalizeParavet));
    } catch (error) {
      console.error('Error fetching paravets:', error);
    } finally {
      setLoadingParavets(false);
    }
  };

  const handleParavetSelect = (paravet) => {
    setSelectedParavet(paravet);
    setParavetSelectionVisible(false);
  };

  const paravetServices = selectedParavet?.experience?.areasOfExpertise?.value || [];
  
  // Service image mappings
  const diagnosticSupportServices = [
    'Blood Collection',
    'Urine Sample Collection',
    'Lab Sample Handling',
    'X-ray Assistance',
    'Ultrasound Assistance',
    'ECG Assistance',
    'Basic Diagnostics',
  ];

  const woundCareServices = ['Wound Care & Dressing'];
  const preOperativeServices = ['Pre-operative Preparation'];
  const homeVaccinationServices = ['Home Vaccination'];
  const earCleaningServices = ['Ear Cleaning'];
  const vitalSignsServices = ['Vital Signs Monitoring'];
  const vaccinationSupportServices = ['Vaccination Support'];

  const serviceImages = {
    diagnosticSupport: 'https://plus.unsplash.com/premium_photo-1663047756170-0bec0113645e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fERpYWdub3N0aWMlMjBTdXBwb3J0JTIwcGV0fGVufDB8fDB8fHww',
    woundCare: 'https://plus.unsplash.com/premium_photo-1663040486740-60e41b8fd1e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V291bmQlMjBDYXJlJTIwJTI2JTIwRHJlc3NpbmclMjBwZXRzfGVufDB8fDB8fHww',
    preOperative: 'https://images.unsplash.com/photo-1710322928695-c7fb49886cb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFByZS1vcGVyYXRpdmUlMjBQcmVwYXJhdGlvbiUyMHBldHN8ZW58MHx8MHx8fDA%3D',
    homeVaccination: 'https://plus.unsplash.com/premium_photo-1726768886710-92e78c6272df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SG9tZSUyMFZhY2NpbmF0aW9uJTIwcGV0c3xlbnwwfHwwfHx8MA%3D%3D',
    earCleaning: 'https://plus.unsplash.com/premium_photo-1663011219208-418276022b35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8RWFyJTIwQ2xlYW5pbmclM0QlMjBwZXR8ZW58MHx8MHx8fDA%3D',
    vitalSigns: 'https://images.unsplash.com/photo-1625321171045-1fea4ac688e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Vml0YWwlMjBTaWducyUyME1vbml0b3JpbiUyMHBldHxlbnwwfHwwfHx8MA%3D%3D',
    vaccinationSupport: 'https://media.istockphoto.com/id/885592010/photo/young-male-maine-coon-cat-taking-a-vaccine.jpg?s=2048x2048&w=is&k=20&c=M5uHwfLaAtlhr0Bg2uk0hV5BuieGwGkQyHWdTOXaesk=',
  };
  
  const serviceMapping = {
    'Vet Home Visit': { id: '1', icon: 'stethoscope', iconSet: 'FontAwesome5', color: '#FF6B6B', subtitle: 'General checkup, injections, first aid', price: 599, duration: '45-60 min' },
    'Vaccination at Home': { id: '2', icon: 'syringe', iconSet: 'FontAwesome5', color: '#4ECDC4', subtitle: 'All vaccines administered safely', price: 499, duration: '30 min' },
    'Pet Grooming': { id: '3', icon: 'cut', iconSet: 'FontAwesome5', color: '#95E1D3', subtitle: 'Bath, haircut, nail trim', price: 799, duration: '90-120 min' },
    'Pet Training Session': { id: '4', icon: 'dog', iconSet: 'MaterialCommunityIcons', color: '#F38181', subtitle: 'Professional behavioral training', price: 899, duration: '60 min' },
    'Physiotherapy': { id: '5', icon: 'medical-bag', iconSet: 'MaterialCommunityIcons', color: '#AA96DA', subtitle: 'Post-surgery & recovery care', price: 1299, duration: '60 min' },
    'Pet Walking': { id: '6', icon: 'walk', iconSet: 'MaterialCommunityIcons', color: '#FCBAD3', subtitle: 'Hourly or daily walks', price: 199, duration: '30 min' },
    'Wound Care & Dressing': { id: '7', icon: 'bandage', iconSet: 'FontAwesome5', color: '#FF6B6B', subtitle: 'Professional wound care and dressing', price: 699, duration: '30-45 min' },
    'Blood Collection': { id: '8', icon: 'syringe', iconSet: 'FontAwesome5', color: '#E74C3C', subtitle: 'Safe blood sample collection', price: 399, duration: '15-20 min' },
    'Pre-operative Preparation': { id: '9', icon: 'hospital', iconSet: 'FontAwesome5', color: '#9B59B6', subtitle: 'Pre-surgery preparation and care', price: 899, duration: '45-60 min' },
  };
  
  const availableServices = paravetServices.length > 0 
    ? paravetServices.map((serviceName, index) => {
        const mapped = serviceMapping[serviceName];
        if (mapped) {
          return { ...mapped, title: serviceName };
        }
        return {
          id: `custom-${index}`,
          title: serviceName,
          icon: 'medical-services',
          iconSet: 'MaterialIcons',
          color: theme.colors.primary,
          subtitle: 'Professional pet care service',
          price: 599,
          duration: '30-60 min'
        };
      })
    : [];

  const handleServiceSelect = (service) => {
    if (!selectedParavet) {
      Alert.alert('Select Paravet', 'Please select a paravet first');
      setParavetSelectionVisible(true);
      return;
    }
    setSelectedService(service);
    setBookingModalVisible(true);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <CommonHeader title="Doorstep Service" />
        <View style={{ flex: 1 }}>
        
        {/* Paravet Selection Modal */}
        <Modal visible={paravetSelectionVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setParavetSelectionVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Select Paravet
              </Text>
              <View style={{ width: 28 }} />
            </View>
            
            <ScrollView style={styles.modalScrollContent}>
              <Text variant="labelLarge" style={styles.sectionSubtitle}>
                Choose a paravet to see their services
              </Text>
              
              {loadingParavets ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator animating={true} color={theme.colors.primary} />
                  <Text variant="labelSmall" style={styles.loadingText}>
                    Loading paravets...
                  </Text>
                </View>
              ) : paravets.length === 0 ? (
                <View style={styles.noServicesContainer}>
                  <MaterialIcons name="info-outline" size={48} color="#999" />
                  <Text variant="titleMedium" style={styles.noServicesText}>
                    No paravets available
                  </Text>
                </View>
              ) : (
                paravets.map((paravet) => (
                  <Card
                    key={paravet._id || paravet.id}
                    style={styles.paravetSelectionCard}
                    onPress={() => handleParavetSelect(paravet)}
                  >
                    <Card.Content style={styles.paravetSelectionCardContent}>
                      <Image source={{ uri: paravet.photo }} style={styles.paravetSelectionPhoto} />
                      <View style={styles.paravetSelectionInfo}>
                        <Text variant="labelLarge" style={styles.paravetSelectionName}>
                          {paravet.name}
                        </Text>
                        <Text variant="labelSmall" style={styles.paravetSelectionSpecialization}>
                          {paravet.specialization}
                        </Text>
                        <Text variant="labelSmall" style={styles.paravetSelectionExperience}>
                          {paravet.experience?.areasOfExpertise?.value?.length || 0} service(s) available
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                    </Card.Content>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {/* Selected Paravet Banner */}
          {selectedParavet && (
            <Card style={styles.selectedParavetBanner} onPress={() => setParavetSelectionVisible(true)}>
              <Card.Content style={styles.selectedParavetContent}>
                <Image source={{ uri: selectedParavet.photo }} style={styles.bannerPhoto} />
                <View style={styles.bannerTextContainer}>
                  <Text variant="titleMedium" style={styles.bannerName}>
                    {selectedParavet.name}
                  </Text>
                  <Text variant="labelSmall" style={styles.bannerSubtext}>
                    {paravetServices.length} services available
                  </Text>
                </View>
                <Text variant="labelMedium" style={styles.changeText}>
                  Change
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Hero Section with Image */}
          <View style={styles.heroSection}>
            <Card style={styles.heroCard}>
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1556866261-8763a7662333?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRvZ3N8ZW58MHx8MHx8fDA%3D' }}
                  style={styles.heroImage}
                />
                <View style={styles.heroOverlay} />
              </View>
              <Card.Content style={styles.heroCardContent}>
                <Text variant="displaySmall" style={styles.heroTitle}>
                  Pet Care at Your Doorstep
                </Text>
                <Text variant="bodySmall" style={styles.heroSubtitle}>
                  Professional veterinary services delivered to your home
                </Text>
                <View style={styles.heroFeatures}>
                  <View style={styles.heroFeature}>
                    <MaterialIcons name="verified-user" size={16} color={theme.colors.primary} />
                    <Text variant="labelSmall" style={styles.heroFeatureText}>
                      Verified Partners
                    </Text>
                  </View>
                  <View style={styles.heroFeature}>
                    <MaterialIcons name="security" size={16} color={theme.colors.primary} />
                    <Text variant="labelSmall" style={styles.heroFeatureText}>
                      100% Safe
                    </Text>
                  </View>
                  <View style={styles.heroFeature}>
                    <MaterialIcons name="access-time" size={16} color={theme.colors.primary} />
                    <Text variant="labelSmall" style={styles.heroFeatureText}>
                      On-Time Service
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Emergency Button */}
          <Button
            mode="contained"
            buttonColor={theme.colors.primary}
            style={styles.emergencyButton}
            icon="alert-circle-outline"
            labelStyle={styles.emergencyButtonLabel}
          >
            Emergency Service - Get help within 2 hours
          </Button>

          {/* Services Grid */}
          <View style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                Our Services
              </Text>
              <Text variant="labelSmall" style={styles.sectionSubtitle}>
                Choose what your pet needs
              </Text>
            </View>

            <View style={styles.servicesGrid}>
              {availableServices.length > 0 ? (
                availableServices.map((service) => {
                  const isDiagnosticSupport = diagnosticSupportServices.includes(service.title);
                  const isWoundCare = woundCareServices.includes(service.title);
                  const isPreOperative = preOperativeServices.includes(service.title);
                  const isHomeVaccination = homeVaccinationServices.includes(service.title);
                  const isEarCleaning = earCleaningServices.includes(service.title);
                  const isVitalSigns = vitalSignsServices.includes(service.title);
                  const isVaccinationSupport = vaccinationSupportServices.includes(service.title);
                  const serviceImage = isDiagnosticSupport ? serviceImages.diagnosticSupport : isWoundCare ? serviceImages.woundCare : isPreOperative ? serviceImages.preOperative : isHomeVaccination ? serviceImages.homeVaccination : isEarCleaning ? serviceImages.earCleaning : isVitalSigns ? serviceImages.vitalSigns : isVaccinationSupport ? serviceImages.vaccinationSupport : null;
                  
                  return (
                    <TouchableOpacity
                      key={service.id}
                      onPress={() => handleServiceSelect(service)}
                      activeOpacity={0.85}
                    >
                      <Card style={styles.serviceCard}>
                        {/* Service Image */}
                        <View style={styles.serviceImageSection}>
                          {serviceImage ? (
                            <Image
                              source={{ uri: serviceImage }}
                              style={styles.serviceMainImage}
                            />
                          ) : (
                            <View style={[styles.serviceImageFallback, { backgroundColor: service.color }]}>
                              {service.iconSet === 'FontAwesome5' ? (
                                <FontAwesome5
                                  name={service.icon}
                                  size={32}
                                  color="#fff"
                                />
                              ) : service.iconSet === 'MaterialIcons' ? (
                                <MaterialIcons
                                  name={service.icon}
                                  size={32}
                                  color="#fff"
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name={service.icon}
                                  size={32}
                                  color="#fff"
                                />
                              )}
                            </View>
                          )}
                          <View style={styles.imageOverlay} />
                        </View>

                        {/* Service Content */}
                        <Card.Content style={styles.serviceContentSection}>
                          <Text 
                            variant="titleSmall" 
                            style={styles.serviceTitle}
                            numberOfLines={2}
                          >
                            {service.title}
                          </Text>
                          
                          <Text
                            variant="labelSmall"
                            style={styles.serviceSubtitle}
                            numberOfLines={2}
                          >
                            {service.subtitle}
                          </Text>

                          {/* Price and Duration */}
                          <View style={styles.serviceMeta}>
                            <View style={styles.priceSection}>
                              <Text variant="labelSmall" style={styles.metaLabel}>
                                Price
                              </Text>
                              <Text variant="titleSmall" style={styles.servicePrice}>
                                ₹{service.price}
                              </Text>
                            </View>
                            <Divider style={styles.metaDivider} />
                            <View style={styles.durationSection}>
                              <Text variant="labelSmall" style={styles.metaLabel}>
                                Duration
                              </Text>
                              <Text variant="labelSmall" style={styles.serviceDurationText}>
                                {service.duration}
                              </Text>
                            </View>
                          </View>

                          {/* Book Now Button */}
                          <Button
                            mode="contained"
                            buttonColor={theme.colors.primary}
                            style={styles.bookButton}
                            labelStyle={styles.bookButtonLabel}
                          >
                            Book Now
                          </Button>
                        </Card.Content>
                      </Card>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.noServicesContainer}>
                  <MaterialIcons name="info-outline" size={48} color="#999" />
                  <Text variant="titleMedium" style={styles.noServicesText}>
                    No services available
                  </Text>
                  <Text variant="labelSmall" style={styles.noServicesSubtext}>
                    Please select a different paravet or contact support
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Subscription Plans */}
          <View style={styles.subscriptionSection}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Subscription Plans
            </Text>
            <Text variant="labelSmall" style={styles.sectionSubtitle}>
              Save more with regular care
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
              <Card style={styles.planCard}>
                <Card.Content style={styles.planCardContent}>
                  <Chip
                    label="POPULAR"
                    style={styles.planBadge}
                    textStyle={styles.planBadgeText}
                  />
                  <Text variant="titleMedium" style={styles.planName}>
                    Weekly Grooming
                  </Text>
                  <Text variant="displaySmall" style={styles.planPrice}>
                    ₹2,499
                    <Text variant="labelSmall" style={styles.planPeriod}>
                      /month
                    </Text>
                  </Text>
                  <Text variant="labelMedium" style={styles.planSavings}>
                    Save ₹700
                  </Text>
                  <View style={styles.planFeatures}>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • 4 Grooming Sessions
                    </Text>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • Free Nail Trimming
                    </Text>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • Priority Booking
                    </Text>
                  </View>
                  <Button
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    style={styles.planButton}
                    labelStyle={styles.planButtonLabel}
                  >
                    Subscribe
                  </Button>
                </Card.Content>
              </Card>

              <Card style={styles.planCard}>
                <Card.Content style={styles.planCardContent}>
                  <Text variant="titleMedium" style={styles.planName}>
                    Daily Walking
                  </Text>
                  <Text variant="displaySmall" style={styles.planPrice}>
                    ₹3,999
                    <Text variant="labelSmall" style={styles.planPeriod}>
                      /month
                    </Text>
                  </Text>
                  <Text variant="labelMedium" style={styles.planSavings}>
                    Save ₹1,200
                  </Text>
                  <View style={styles.planFeatures}>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • 30 Walking Sessions
                    </Text>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • 30 min per session
                    </Text>
                    <Text variant="labelSmall" style={styles.planFeature}>
                      • Activity Reports
                    </Text>
                  </View>
                  <Button
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    style={styles.planButton}
                    labelStyle={styles.planButtonLabel}
                  >
                    Subscribe
                  </Button>
                </Card.Content>
              </Card>
            </ScrollView>
          </View>

          {/* How It Works */}
          <View style={styles.howItWorksSection}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              How It Works
            </Text>
            
            {[
              {
                number: '1',
                title: 'Choose Service & Book',
                description: 'Select the service you need and pick a convenient time slot'
              },
              {
                number: '2',
                title: 'Partner Assigned & Arrives',
                description: 'Verified professional reaches your home at scheduled time'
              },
              {
                number: '3',
                title: 'Service Completed & Pay',
                description: 'Pay online or cash after service completion'
              },
              {
                number: '4',
                title: 'Get Care Tips & Reminders',
                description: 'Receive follow-up care instructions and next service reminders'
              }
            ].map((step) => (
              <Card key={step.number} style={styles.stepCard}>
                <Card.Content style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text variant="titleLarge" style={styles.stepNumberText}>
                      {step.number}
                    </Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text variant="titleSmall" style={styles.stepTitle}>
                      {step.title}
                    </Text>
                    <Text variant="labelSmall" style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Trust & Safety */}
          <View style={styles.trustSection}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Trust & Safety
            </Text>
            
            <View style={styles.trustGrid}>
              {[
                {
                  icon: 'verified',
                  title: 'Verified Partners',
                  description: 'All service providers are background verified'
                },
                {
                  icon: 'lock',
                  title: 'OTP Security',
                  description: 'Service starts only after OTP verification'
                },
                {
                  icon: 'sanitizer',
                  title: 'Sanitized Tools',
                  description: 'Partners use sanitized equipment'
                },
                {
                  icon: 'camera-alt',
                  title: 'Before & After',
                  description: 'Get service documentation photos'
                }
              ].map((item) => (
                <Card key={item.icon} style={styles.trustCard}>
                  <Card.Content style={styles.trustCardContent}>
                    <MaterialIcons name={item.icon} size={32} color={theme.colors.primary} />
                    <Text variant="labelLarge" style={styles.trustTitle}>
                      {item.title}
                    </Text>
                    <Text variant="labelSmall" style={styles.trustDescription}>
                      {item.description}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>

          {/* Active Bookings */}
          {userBookings.length > 0 && (
            <View style={styles.activeBookingsSection}>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                Active Bookings
              </Text>
              {userBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').map((booking) => (
                <Card
                  key={booking._id}
                  style={styles.activeBookingCard}
                  onPress={() => {
                    setSelectedBooking(booking);
                    setTrackingModalVisible(true);
                  }}
                >
                  <Card.Content style={styles.activeBookingCardContent}>
                    <View style={styles.bookingCardLeft}>
                      <Text variant="titleMedium" style={styles.bookingServiceType}>
                        {booking.serviceType}
                      </Text>
                      <Text variant="labelSmall" style={styles.bookingDate}>
                        {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot}
                      </Text>
                      <Text variant="labelSmall" style={[styles.bookingPartner, { color: theme.colors.primary }]}>
                        {booking.servicePartnerName}
                      </Text>
                    </View>
                    <View style={styles.bookingCardRight}>
                      <Chip
                        label={booking.status}
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: booking.status === 'confirmed' ? theme.colors.primary : '#FF9800'
                          }
                        ]}
                        textStyle={styles.statusText}
                      />
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {/* Demo Button */}
          <Button
            mode="contained"
            icon="map-marker-outline"
            buttonColor={theme.colors.primary}
            style={styles.demoButton}
            labelStyle={styles.demoButtonLabel}
            onPress={() => {
              setSelectedBooking(null);
              setTrackingModalVisible(true);
            }}
          >
            View Live Tracking Demo
          </Button>

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
      </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  modalScrollContent: {
    paddingVertical: 8,
  },

  // Service Summary Card
  serviceSummaryCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  serviceSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceSummaryLeft: {
    flex: 1,
  },
  serviceModalTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  serviceModalSubtitle: {
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  serviceDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  serviceDuration: {
    color: '#999',
    fontWeight: '500',
  },
  serviceSummaryRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  serviceModalPrice: {
    fontWeight: '800',
    color: '#7CB342',
  },
  perVisit: {
    color: '#999',
    marginTop: 4,
  },

  // Modal Section
  modalSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionLabel: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  required: {
    color: '#FF6B6B',
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
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emergencySubtitle: {
    color: '#666',
    marginTop: 4,
  },

  // Pets Grid
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  noPetsText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24,
  },
  petCard: {
    width: (width - 60) / 3,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  petCardSelected: {
    borderColor: '#7CB342',
    backgroundColor: '#F1F8E9',
  },
  petCheckbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7CB342',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  petCardName: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  petCardType: {
    color: '#666',
    fontSize: 12,
  },

  // Date Cards
  dateScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dateCard: {
    width: 70,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateCardSelected: {
    borderColor: '#7CB342',
    backgroundColor: '#F1F8E9',
  },
  dateDay: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  dateNumber: {
    color: '#1a1a1a',
    marginVertical: 4,
    fontWeight: '700',
  },
  dateMonth: {
    color: '#999',
    fontSize: 11,
  },
  dateTextSelected: {
    color: '#7CB342',
    fontWeight: '600',
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
    fontSize: 10,
    fontWeight: '600',
  },

  // Time Slots
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  timeSlotSelected: {
    borderColor: '#7CB342',
    backgroundColor: '#F1F8E9',
  },
  timeSlotText: {
    fontWeight: '600',
    color: '#1a1a1a',
    fontSize: 13,
  },
  timeSlotTextSelected: {
    color: '#7CB342',
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
    gap: 10,
  },
  repeatText: {
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },

  // Nearby Providers
  nearbyProviders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  nearbyText: {
    color: '#7CB342',
    fontWeight: '600',
  },

  // Partners List
  partnersList: {
    gap: 10,
  },
  partnerTouchable: {
    marginBottom: 0,
  },

  // Partner Card
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  partnerCardSelected: {
    backgroundColor: '#F1F8E9',
    borderColor: '#7CB342',
    borderWidth: 2,
  },
  partnerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  partnerName: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  partnerSpecialization: {
    color: '#666',
    marginBottom: 2,
  },
  partnerExperience: {
    color: '#999',
    marginBottom: 6,
    fontSize: 12,
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
    fontWeight: '700',
    color: '#F57C00',
    marginLeft: 2,
  },
  reviewsText: {
    color: '#999',
    fontSize: 12,
  },
  distanceText: {
    color: '#7CB342',
    fontWeight: '600',
    fontSize: 12,
  },
  partnerRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7CB342',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  partnerRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7CB342',
  },

  // Text Area
  textArea: {
    backgroundColor: '#F8F9FA',
    height: 100,
    marginBottom: 0,
  },

  // Coupon Row
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  couponText: {
    flex: 1,
    fontWeight: '600',
    color: '#7CB342',
  },

  // Price Card
  priceCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  priceSectionTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    color: '#666',
    fontWeight: '500',
  },
  priceValue: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  discountValue: {
    fontWeight: '600',
    color: '#10B981',
  },
  priceDivider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontWeight: '800',
    color: '#7CB342',
  },

  // Payment Options
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginBottom: 10,
    gap: 12,
  },
  paymentOptionSelected: {
    borderColor: '#7CB342',
    backgroundColor: '#F1F8E9',
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7CB342',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7CB342',
  },
  paymentText: {
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 8,
  },
  bottomLeft: {
    justifyContent: 'center',
  },
  bottomPrice: {
    fontWeight: '800',
    color: '#7CB342',
  },
  bottomPets: {
    color: '#666',
    marginTop: 2,
  },
  confirmButton: {
    minWidth: 140,
    borderRadius: 10,
  },

  // Tracking
  trackingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  trackingTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },

  // Map Placeholder
  mapPlaceholder: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    paddingVertical: 24,
  },
  mapText: {
    color: '#7CB342',
    marginTop: 12,
  },
  etaText: {
    color: '#666',
    marginTop: 6,
  },

  // Tracking Partner Card
  trackingPartnerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  trackingPartnerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
    color: '#1a1a1a',
  },
  trackingPartnerRole: {
    color: '#666',
    marginTop: 2,
  },
  trackingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trackingRatingText: {
    fontWeight: '700',
    color: '#F57C00',
    marginLeft: 4,
  },
  trackingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  trackingActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Timeline Card
  timelineCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  timelineTitle: {
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
    fontWeight: '600',
  },
  timelineTime: {
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600',
  },

  // OTP Card
  otpCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
  },
  otpCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpText: {
    marginLeft: 12,
  },
  otpTitle: {
    fontWeight: '700',
    color: '#F57C00',
  },
  otpSubtitle: {
    color: '#666',
    marginTop: 2,
  },

  // Selected Paravet Banner
  selectedParavetBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  selectedParavetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  bannerName: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  bannerSubtext: {
    color: '#666',
    marginTop: 2,
  },
  changeText: {
    fontWeight: '600',
    color: '#7CB342',
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImageContainer: {
    height: 180,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heroCardContent: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  heroTitle: {
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 32,
  },
  heroSubtitle: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  heroFeatures: {
    gap: 10,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroFeatureText: {
    color: '#7CB342',
    fontWeight: '600',
    fontSize: 13,
  },

  // Emergency Button
  emergencyButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  emergencyButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 2,
  },

  // Services Section
  servicesSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 13,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceImageSection: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  serviceMainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  serviceContentSection: {
    padding: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  priceSection: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    color: '#999',
    fontSize: 10,
    marginBottom: 2,
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  durationSection: {
    flex: 1,
    alignItems: 'center',
  },
  serviceDurationText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
  },
  bookButton: {
    width: '100%',
    borderRadius: 10,
  },
  bookButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  serviceCardContent: {
    alignItems: 'center',
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
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  serviceSubtitle: {
    color: '#666',
    marginBottom: 12,
    height: 32,
    textAlign: 'center',
    fontSize: 12,
  },
  serviceFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicePrice: {
    fontWeight: '800',
    color: '#7CB342',
  },
  serviceDuration: {
    color: '#999',
    fontSize: 12,
  },
  bookNowButton: {
    width: '100%',
    borderRadius: 10,
  },
  bookNowButtonLabel: {
    fontSize: 13,
  },

  // No Services Container
  noServicesContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noServicesText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  noServicesSubtext: {
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },

  // Subscription Section
  subscriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  plansScroll: {
    marginTop: 16,
  },
  planCard: {
    width: 260,
    marginRight: 12,
    borderRadius: 16,
  },
  planCardContent: {
    alignItems: 'flex-start',
  },
  planBadge: {
    backgroundColor: '#FF6B6B',
    marginBottom: 12,
  },
  planBadgeText: {
    color: '#fff',
    fontWeight: '700',
  },
  planName: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planPrice: {
    fontWeight: '800',
    color: '#7CB342',
  },
  planPeriod: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  planSavings: {
    color: '#10B981',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  planFeature: {
    color: '#666',
    fontSize: 12,
  },
  planButton: {
    width: '100%',
    borderRadius: 10,
  },
  planButtonLabel: {
    fontSize: 14,
  },

  // How It Works
  howItWorksSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  stepCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  stepCardContent: {
    flexDirection: 'row',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7CB342',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stepDescription: {
    color: '#666',
    lineHeight: 18,
    fontSize: 13,
  },

  // Trust Section
  trustSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  trustCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
  },
  trustCardContent: {
    alignItems: 'center',
  },
  trustTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 13,
  },
  trustDescription: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 12,
  },

  // Demo Button
  demoButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  demoButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 2,
  },

  // Active Bookings
  activeBookingsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  activeBookingCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  activeBookingCardContent: {
    flexDirection: 'row',
  },
  bookingCardLeft: {
    flex: 1,
  },
  bookingServiceType: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  bookingDate: {
    color: '#666',
    marginBottom: 4,
    fontSize: 12,
  },
  bookingPartner: {
    fontWeight: '600',
    fontSize: 12,
  },
  bookingCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#fff',
  },

  // Paravet Selection
  paravetSelectionCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  paravetSelectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paravetSelectionPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  paravetSelectionInfo: {
    flex: 1,
  },
  paravetSelectionName: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  paravetSelectionSpecialization: {
    color: '#666',
    marginTop: 2,
  },
  paravetSelectionExperience: {
    color: '#999',
    marginTop: 4,
    fontSize: 12,
  },
});

export default ParavetModule;