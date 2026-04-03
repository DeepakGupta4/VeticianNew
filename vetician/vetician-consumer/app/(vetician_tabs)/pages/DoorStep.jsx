import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
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
    background: '#F5F7FA',
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

// Booking Modal Component
const BookingModal = ({ visible, onClose, service, preSelectedPartner }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => state.auth?.userPets?.data || []);
  const parentData = useSelector(state => state.auth?.parentData?.data?.parent?.[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(preSelectedPartner || null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [repeatBooking, setRepeatBooking] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [servicePartners, setServicePartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const dates = generateDates();
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (visible) {
      if (preSelectedPartner) setSelectedPartner(preSelectedPartner);
      dispatch(getPetsByUserId());
      fetchParavets();
      checkProfile();
    }
  }, [visible]);

  useEffect(() => {
    if (parentData?.address) {
      const addr = typeof parentData.address === 'string'
        ? parentData.address
        : [parentData.address.street, parentData.address.city, parentData.address.state].filter(Boolean).join(', ');
      setDeliveryAddress(addr);
    }
  }, [parentData]);

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
      
      if (response.data && response.data.length > 0) {
        console.log('👤 First paravet:', response.data[0]);
        setServicePartners(response.data);
      } else {
        console.log('⚠️ No paravets found in response');
        setServicePartners([]);
        Alert.alert('No Paravets Available', 'There are no verified paravets available at the moment. Please try again later.');
      }
    } catch (error) {
      console.error('❌ Error fetching paravets:', error);
      console.error('❌ Error details:', error.message);
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
    const isComplete = isProfileComplete(parentData);

    if (!deliveryAddress.trim()) {
      Alert.alert('Address Required', 'Please enter your delivery address to proceed.');
      return;
    }

    if (!isComplete) {
      const missing = getMissingFields(parentData).filter(f => f !== 'Address');
      if (missing.length > 0) {
        Alert.alert(
          'Incomplete Profile',
          `Please complete: ${missing.join(', ')}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Complete Profile',
              onPress: () => {
                onClose();
                setTimeout(() => router.push('/(vetician_tabs)/(tabs)/profile'), 300);
              }
            }
          ]
        );
        return;
      }
    }

    if (!selectedDate || (!isEmergency && !selectedSlot) || !selectedPartner || selectedPets.length === 0) {
      Alert.alert('Incomplete Information', 'Please fill all required fields');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');

      const bookingData = {
        userId,
        serviceType: service.title,
        petIds: selectedPets.map(p => p._id),
        paravetId: selectedPartner._id || selectedPartner.id || selectedPartner.userId,
        paravetName: selectedPartner.name,
        appointmentDate: selectedDate.fullDate,
        timeSlot: isEmergency ? 'Emergency' : selectedSlot?.time,
        address: deliveryAddress,
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

      const response = await ApiService.createDoorstepBooking(bookingData);

      if (response.success) {
        SocketService.emit('booking:created', {
          bookingId: response.data._id,
          paravetId: selectedPartner._id || selectedPartner.id || selectedPartner.userId,
          userId
        });

        Alert.alert(
          'Booking Request Sent! 🎉',
          `Your booking for ${service.title} has been sent to ${selectedPartner.name}.\n\nDate: ${selectedDate.label}, ${selectedDate.month} ${selectedDate.date}\nTime: ${isEmergency ? 'Emergency' : selectedSlot?.time}\nTotal: ₹${calculateTotal()}`,
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to create booking');
      }
    } catch (error) {
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
      <SafeAreaView style={styles.modalContainer}>
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
                  key={partner._id || partner.id}
                  onPress={() => setSelectedPartner(partner)}
                  style={styles.partnerTouchable}
                >
                  <Card
                    style={[
                      styles.partnerCard,
                      (selectedPartner?._id || selectedPartner?.id) === (partner._id || partner.id) && styles.partnerCardSelected,
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
                        {(selectedPartner?._id || selectedPartner?.id) === (partner._id || partner.id) && (
                          <View style={styles.partnerRadioInner} />
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </Surface>

          {/* Delivery Address */}
          <Surface style={styles.modalSection}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Delivery Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your full address..."
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
              activeOutlineColor={theme.colors.primary}
              style={styles.textArea}
            />
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
      </SafeAreaView>
    </Modal>
  );
};

// Booking Detail Modal (status-based)
const BookingDetailModal = ({ visible, onClose, booking }) => {
  const [showPayment, setShowPayment] = useState(false);
  const insets = useSafeAreaInsets();

  const statusConfig = {
    pending:       { color: '#FF9800', icon: 'hourglass-empty', label: 'Waiting for Confirmation' },
    accepted:      { color: '#7CB342', icon: 'check-circle',    label: 'Booking Confirmed' },
    'in-progress': { color: '#2196F3', icon: 'build',           label: 'Service In Progress' },
    completed:     { color: '#4CAF50', icon: 'done-all',        label: 'Service Completed' },
    rejected:      { color: '#EF4444', icon: 'cancel',          label: 'Booking Rejected' },
    cancelled:     { color: '#999',    icon: 'block',           label: 'Booking Cancelled' },
  };

  const config = statusConfig[booking?.status] || statusConfig.pending;

  const getAddressText = (address) => {
    if (!address) return 'Not provided';
    if (typeof address === 'string') return address;
    return [address.street, address.city, address.state, address.pincode].filter(Boolean).join(', ') || 'Not provided';
  };

  const razorpayHTML = `
    <!DOCTYPE html><html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;background:#f5f5f5">
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
      var options = {
        key: 'rzp_test_YourKeyHere',
        amount: ${(booking?.totalAmount || 0) * 100},
        currency: 'INR',
        name: 'Vetician',
        description: '${booking?.serviceType || 'Service'} Booking',
        theme: { color: '#7CB342' },
        handler: function(r) { window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, paymentId: r.razorpay_payment_id })); },
        modal: { ondismiss: function() { window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, reason: 'dismissed' })); } }
      };
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(r) { window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, reason: r.error.description })); });
      rzp.open();
    </script></body></html>
  `;

  if (showPayment) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" />
          <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.detailModalHeader}>
            <View style={{ width: 36 }} />
            <RNText style={styles.detailModalTitle}>Payment</RNText>
            <TouchableOpacity onPress={() => setShowPayment(false)} style={styles.detailModalClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          <WebView
            source={{ html: razorpayHTML }}
            style={{ flex: 1 }}
            onMessage={(e) => {
              const data = JSON.parse(e.nativeEvent.data);
              setShowPayment(false);
              if (data.success) {
                Alert.alert('Payment Successful! 🎉', `Payment ID: ${data.paymentId}\nYour booking is confirmed.`, [{ text: 'OK', onPress: onClose }]);
              } else {
                Alert.alert('Payment Failed', data.reason === 'dismissed' ? 'Payment was cancelled.' : data.reason || 'Payment failed.');
              }
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      {visible && <ExpoStatusBar style="light" backgroundColor={COLORS.primaryGreen} />}
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Status bar area manually covered */}
        <View style={{ height: insets.top, backgroundColor: COLORS.primaryGreen }} />
        <LinearGradient colors={[COLORS.primaryGreen, COLORS.primaryGreen]} style={styles.detailModalHeader}>
          <View style={{ width: 36 }} />
          <RNText style={styles.detailModalTitle}>Booking Details</RNText>
          <TouchableOpacity onPress={onClose} style={styles.detailModalClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollContent}>
          {/* Status Banner */}
          <View style={[styles.statusBanner, { backgroundColor: config.color }]}>
            <MaterialIcons name={config.icon} size={40} color="#fff" />
            <Text variant="titleMedium" style={styles.statusBannerText}>{config.label}</Text>
            {booking?.status === 'pending' && (
              <Text variant="labelSmall" style={styles.statusBannerSub}>Paravet will confirm your booking shortly</Text>
            )}
            {booking?.status === 'accepted' && (
              <Text variant="labelSmall" style={styles.statusBannerSub}>
                {booking.paymentMethod === 'online' ? 'Please complete payment to proceed' : 'Paravet will arrive at scheduled time'}
              </Text>
            )}
          </View>

          {/* Booking Info Card */}
          <Card style={styles.detailCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.detailCardTitle}>Booking Summary</Text>
              <View style={styles.detailRow}>
                <MaterialIcons name="medical-services" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Service</Text>
                <Text variant="bodySmall" style={styles.detailValue}>{booking?.serviceType}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Paravet</Text>
                <Text variant="bodySmall" style={styles.detailValue}>{booking?.paravetName}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="calendar-today" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Date & Time</Text>
                <Text variant="bodySmall" style={styles.detailValue}>
                  {new Date(booking?.appointmentDate).toLocaleDateString()} • {booking?.timeSlot}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Address</Text>
                <Text variant="bodySmall" style={[styles.detailValue, { flex: 1 }]}>
                  {getAddressText(booking?.address)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="attach-money" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Total</Text>
                <Text variant="bodySmall" style={[styles.detailValue, { color: '#7CB342', fontWeight: '700' }]}>₹{booking?.totalAmount}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="payment" size={16} color="#7CB342" />
                <Text variant="bodySmall" style={styles.detailLabel}>Payment</Text>
                <Text variant="bodySmall" style={styles.detailValue}>
                  {booking?.paymentMethod === 'online' ? 'Pay Online' : 'Cash After Service'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Payment CTA */}
          {booking?.status === 'accepted' && booking?.paymentMethod === 'online' && (
            <Card style={[styles.detailCard, { backgroundColor: '#F1F8E9' }]}>
              <Card.Content>
                <RNText style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: 6, fontSize: 15 }}>💳 Complete Payment</RNText>
                <RNText style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>Pay ₹{booking?.totalAmount} to confirm your booking</RNText>
                <Button mode="contained" buttonColor="#7CB342" style={{ borderRadius: 10 }} onPress={() => setShowPayment(true)}>
                  Pay Now ₹{booking?.totalAmount}
                </Button>
              </Card.Content>
            </Card>
          )}

          {/* OTP */}
          {booking?.status === 'in-progress' && booking?.otp && (
            <Card style={[styles.detailCard, { backgroundColor: '#FFF3E0' }]}>
              <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="lock" size={24} color="#F57C00" />
                <View style={{ marginLeft: 12 }}>
                  <RNText style={{ fontWeight: '700', color: '#F57C00', fontSize: 15 }}>Service OTP: {booking.otp}</RNText>
                  <RNText style={{ color: '#666', marginTop: 2, fontSize: 13 }}>Share with paravet to start service</RNText>
                </View>
              </Card.Content>
            </Card>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

// Live Tracking Modal
const TrackingModal = ({ visible, onClose, booking }) => {
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'pending');
  const [userLocation, setUserLocation] = useState(null);
  const [paravetLocation, setParavetLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = React.useRef(null);

  const statuses = [
    { id: 'pending',     label: 'Booking Confirmed',    icon: 'check-circle', color: theme.colors.primary },
    { id: 'accepted',   label: 'Partner Assigned',      icon: 'person',       color: '#24A1DE' },
    { id: 'in-progress',label: 'Service in Progress',   icon: 'build',        color: '#FF5722' },
    { id: 'completed',  label: 'Service Completed',     icon: 'done-all',     color: '#4CAF50' },
  ];

  const partner = {
    name: booking?.paravetName || 'Service Partner',
    specialization: 'Paravet',
    rating: 4.8,
  };

  useEffect(() => {
    if (booking) setCurrentStatus(booking.status);
  }, [booking]);

  useEffect(() => {
    if (!visible) return;
    let locationSub;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        // Simulate paravet location nearby (replace with real socket data when backend ready)
        setParavetLocation({
          latitude: loc.coords.latitude + 0.008,
          longitude: loc.coords.longitude + 0.005,
        });

        // Watch user location
        locationSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          (newLoc) => {
            setUserLocation({
              latitude: newLoc.coords.latitude,
              longitude: newLoc.coords.longitude,
            });
          }
        );
      } catch (e) {
        setLocationError('Could not get location');
      }
    })();

    return () => { if (locationSub) locationSub.remove(); };
  }, [visible]);

  // Fit map to show both markers
  useEffect(() => {
    if (userLocation && paravetLocation && mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation, paravetLocation], {
        edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
        animated: true,
      });
    }
  }, [userLocation, paravetLocation]);

  const getDistanceKm = (loc1, loc2) => {
    if (!loc1 || !loc2) return null;
    const R = 6371;
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const distance = getDistanceKm(userLocation, paravetLocation);
  const eta = distance ? Math.round(distance * 3) : null;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.trackingContainer}>
        <View style={styles.trackingHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text variant="headlineSmall" style={styles.trackingTitle}>Track Service</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Real Map */}
        {locationError ? (
          <View style={styles.mapError}>
            <MaterialIcons name="location-off" size={48} color="#999" />
            <Text variant="bodySmall" style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
              {locationError}
            </Text>
          </View>
        ) : userLocation ? (
          <MapView
            ref={mapRef}
            style={styles.realMap}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {/* User Marker */}
            <Marker coordinate={userLocation} title="Your Location">
              <View style={styles.userMarker}>
                <MaterialIcons name="home" size={18} color="#fff" />
              </View>
            </Marker>

            {/* Paravet Marker */}
            {paravetLocation && (
              <Marker coordinate={paravetLocation} title={partner.name}>
                <View style={styles.paravetMarker}>
                  <MaterialIcons name="medical-services" size={18} color="#fff" />
                </View>
              </Marker>
            )}

            {/* Route line */}
            {paravetLocation && (
              <Polyline
                coordinates={[paravetLocation, userLocation]}
                strokeColor="#7CB342"
                strokeWidth={3}
                lineDashPattern={[8, 4]}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapLoading}>
            <ActivityIndicator animating color={theme.colors.primary} size="large" />
            <Text variant="labelSmall" style={{ color: '#666', marginTop: 12 }}>Getting your location...</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ETA Card */}
          {distance && (
            <Card style={styles.etaCard}>
              <Card.Content style={styles.etaCardContent}>
                <View style={styles.etaItem}>
                  <MaterialIcons name="near-me" size={20} color={theme.colors.primary} />
                  <Text variant="labelSmall" style={styles.etaLabel}>Distance</Text>
                  <Text variant="titleMedium" style={styles.etaValue}>{distance} km</Text>
                </View>
                <View style={styles.etaDivider} />
                <View style={styles.etaItem}>
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} />
                  <Text variant="labelSmall" style={styles.etaLabel}>ETA</Text>
                  <Text variant="titleMedium" style={styles.etaValue}>{eta} min</Text>
                </View>
                <View style={styles.etaDivider} />
                <View style={styles.etaItem}>
                  <MaterialIcons name="info" size={20} color={theme.colors.primary} />
                  <Text variant="labelSmall" style={styles.etaLabel}>Status</Text>
                  <Text variant="titleMedium" style={[styles.etaValue, { color: statuses.find(s => s.id === currentStatus)?.color || '#333' }]}>
                    {statuses.find(s => s.id === currentStatus)?.label || currentStatus}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Partner Info */}
          <Card style={styles.trackingPartnerCard}>
            <Card.Content style={styles.trackingPartnerCardContent}>
              <View style={styles.trackingPartnerAvatar}>
                <MaterialIcons name="person" size={28} color="#7CB342" />
              </View>
              <View style={styles.trackingPartnerInfo}>
                <Text variant="titleMedium" style={styles.trackingPartnerName}>{partner.name}</Text>
                <Text variant="labelSmall" style={styles.trackingPartnerRole}>{partner.specialization}</Text>
                <View style={styles.trackingRating}>
                  <MaterialIcons name="star" size={14} color="#FFA500" />
                  <Text variant="labelSmall" style={styles.trackingRatingText}>{partner.rating}</Text>
                </View>
              </View>
              <View style={styles.trackingActions}>
                <TouchableOpacity style={styles.trackingActionBtn}
                  onPress={() => Alert.alert('Call', 'Calling feature coming soon')}
                >
                  <Ionicons name="call" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.trackingActionBtn}
                  onPress={() => Alert.alert('Chat', 'Chat feature coming soon')}
                >
                  <Ionicons name="chatbubble" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          {/* Status Timeline */}
          <Card style={styles.timelineCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.timelineTitle}>Service Status</Text>
              {statuses.map((status, index) => {
                const isActive = statuses.findIndex(s => s.id === currentStatus) >= index;
                return (
                  <View key={status.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineIcon, { backgroundColor: isActive ? status.color : '#E0E0E0' }]}>
                        <MaterialIcons name={status.icon} size={16} color={isActive ? '#fff' : '#999'} />
                      </View>
                      {index < statuses.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: isActive ? status.color : '#E0E0E0' }]} />
                      )}
                    </View>
                    <View style={styles.timelineRight}>
                      <Text variant="labelMedium" style={[styles.timelineLabel, { color: isActive ? '#333' : '#999' }]}>
                        {status.label}
                      </Text>
                      {isActive && currentStatus === status.id && (
                        <Text variant="labelSmall" style={styles.timelineTime}>Current</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </Card.Content>
          </Card>

          {/* OTP */}
          {booking?.otp && (
            <Card style={styles.otpCard}>
              <Card.Content style={styles.otpCardContent}>
                <MaterialIcons name="lock" size={24} color={theme.colors.primary} />
                <View style={styles.otpText}>
                  <Text variant="labelLarge" style={styles.otpTitle}>Service OTP: {booking.otp}</Text>
                  <Text variant="labelSmall" style={styles.otpSubtitle}>Share with partner to start service</Text>
                </View>
              </Card.Content>
            </Card>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
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
  const [bookingDetailVisible, setBookingDetailVisible] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paravets, setParavets] = useState([]);
  const [loadingParavets, setLoadingParavets] = useState(false);
  
  useEffect(() => {
    fetchParavets();
    fetchUserBookings();
    const setupSocketListeners = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        SocketService.connect(userId, 'user');
        
        SocketService.on('booking-status-update', (data) => {
          console.log('🔔 Booking status updated:', data);
          fetchUserBookings();
          
          if (data.status === 'accepted' || data.status === 'confirmed') {
            Alert.alert(
              'Booking Accepted! 🎉',
              `${data.paravetName} has accepted your booking request for ${data.serviceType}.`,
              [{ text: 'OK' }]
            );
          } else if (data.status === 'rejected' || data.status === 'cancelled') {
            Alert.alert(
              'Booking Declined',
              `${data.paravetName} has declined your booking request. Please try booking with another paravet.`,
              [{ text: 'OK' }]
            );
          }
        });

        SocketService.on('booking:statusUpdated', (data) => {
          console.log('🔔 Booking status updated (colon):', data);
          fetchUserBookings();
          
          if (data.status === 'accepted' || data.status === 'confirmed') {
            Alert.alert(
              'Booking Accepted! 🎉',
              `${data.paravetName} has accepted your booking request for ${data.serviceType}.`,
              [{ text: 'OK' }]
            );
          } else if (data.status === 'rejected' || data.status === 'cancelled') {
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
    
    return () => {
      SocketService.off('booking-status-update');
      SocketService.off('booking:statusUpdated');
    };
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await ApiService.getDoorstepBookings();
      setUserBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchParavets = async () => {
    try {
      setLoadingParavets(true);
      const response = await ApiService.getVerifiedParavets();
      setParavets(response.data || []);
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

  const insets = useSafeAreaInsets();

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ExpoStatusBar style="light" backgroundColor='#2E5E10' />
        <LinearGradient
          colors={['#2E5E10', '#3D7A18', '#558B2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.navSpacer} />
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <RNText style={styles.navTitle}>Doorstep Service</RNText>
          </View>

          <View style={styles.heroRow}>
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name="home-heart" size={26} color="#fff" />
            </View>
            <View style={styles.heroTextWrap}>
              <RNText style={styles.heroTitle}>Doorstep Vet Care</RNText>
              <RNText style={styles.heroSub}>Professional care delivered to your home</RNText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-check-outline" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>Verified Paravets</RNText>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-fast" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>2hr Emergency</RNText>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="shield-check-outline" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>100% Safe</RNText>
            </View>
          </View>

          <TouchableOpacity style={styles.searchBar} activeOpacity={0.85}>
            <MaterialCommunityIcons name="magnify" size={18} color="#558B2F" />
            <RNText style={styles.searchBarText}>Search services or paravets...</RNText>
            <MaterialCommunityIcons name="tune-variant" size={18} color="#aaa" />
          </TouchableOpacity>
        </LinearGradient>
        
        {/* Paravet Selection Modal */}
        <Modal visible={paravetSelectionVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
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
                          {paravet.experience?.areasOfExpertise?.value?.length || 0} services available
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                    </Card.Content>
                  </Card>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {/* Paravet Selection Banner */}
          {selectedParavet ? (
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
          ) : (
            <TouchableOpacity
              style={styles.selectParavetBanner}
              onPress={() => setParavetSelectionVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.selectParavetLeft}>
                <View style={styles.selectParavetIconBox}>
                  <MaterialCommunityIcons name="account-search" size={28} color="#fff" />
                </View>
                <View>
                  <RNText style={styles.selectParavetTitle}>Select a Paravet</RNText>
                  <RNText style={styles.selectParavetSubtitle}>Choose to see available services</RNText>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
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
            <Text variant="headlineSmall" style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
              Subscription Plans
            </Text>
            <Text variant="labelSmall" style={[styles.sectionSubtitle, { paddingHorizontal: 16 }]}>
              Save more with regular care
            </Text>

            <View style={styles.plansRow}>
              <Card style={styles.planCard}>
                <Card.Content style={styles.planCardContent}>
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>POPULAR</Text>
                  </View>
                  <Text variant="titleMedium" style={styles.planName}>
                    Weekly Grooming
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPriceBig}>₹2,499</Text>
                    <Text style={styles.planPeriod}>/month</Text>
                  </View>
                  <Text style={styles.planSavings}>Save ₹700</Text>
                  <View style={styles.planFeatures}>
                    <Text style={styles.planFeature}>✓ 4 Grooming Sessions</Text>
                    <Text style={styles.planFeature}>✓ Free Nail Trimming</Text>
                    <Text style={styles.planFeature}>✓ Priority Booking</Text>
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
                  <View style={styles.planBadgeSpacer} />
                  <Text variant="titleMedium" style={styles.planName}>
                    Daily Walking
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPriceBig}>₹3,999</Text>
                    <Text style={styles.planPeriod}>/month</Text>
                  </View>
                  <Text style={styles.planSavings}>Save ₹1,200</Text>
                  <View style={styles.planFeatures}>
                    <Text style={styles.planFeature}>✓ 30 Walking Sessions</Text>
                    <Text style={styles.planFeature}>✓ 30 min per session</Text>
                    <Text style={styles.planFeature}>✓ Activity Reports</Text>
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
            </View>
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
              {userBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').map((booking) => {
                const statusColors = {
                  pending: '#FF9800',
                  accepted: '#7CB342',
                  confirmed: '#7CB342',
                  'in-progress': '#2196F3',
                };
                const statusColor = statusColors[booking.status] || '#FF9800';
                return (
                <Card
                  key={booking._id}
                  style={[styles.activeBookingCard, { borderLeftColor: statusColor }]}
                  onPress={() => {
                    setSelectedBooking(booking);
                    if (booking.status === 'in-progress' || booking.status === 'accepted') {
                      setTrackingModalVisible(true);
                    } else {
                      setBookingDetailVisible(true);
                    }
                  }}
                >
                  <Card.Content style={styles.activeBookingCardContent}>
                    <View style={styles.bookingCardLeft}>
                      <Text variant="titleSmall" style={styles.bookingServiceType}>
                        {booking.serviceType}
                      </Text>
                      <View style={styles.bookingMetaRow}>
                        <MaterialIcons name="calendar-today" size={12} color="#999" />
                        <Text variant="labelSmall" style={styles.bookingDate}>
                          {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot}
                        </Text>
                      </View>
                      <View style={styles.bookingMetaRow}>
                        <MaterialIcons name="person" size={12} color={theme.colors.primary} />
                        <Text variant="labelSmall" style={styles.bookingPartner}>
                          {booking.paravetName || booking.servicePartnerName}
                        </Text>
                      </View>
                      <View style={styles.bookingMetaRow}>
                        <MaterialIcons name="currency-rupee" size={12} color="#666" />
                        <Text variant="labelSmall" style={styles.bookingAmount}>
                          ₹{booking.totalAmount}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bookingCardRight}>
                      <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
                        <RNText style={styles.statusPillText}>
                          {booking.status.toUpperCase()}
                        </RNText>
                      </View>
                      <TouchableOpacity style={styles.viewDetailsBtn}
                        onPress={() => {
                          setSelectedBooking(booking);
                          setBookingDetailVisible(true);
                        }}
                      >
                        <RNText style={styles.viewDetailsBtnText}>View Details</RNText>
                      </TouchableOpacity>
                      {booking.status === 'pending' && (
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => {
                            Alert.alert(
                              'Cancel Booking',
                              'Are you sure you want to cancel this booking?',
                              [
                                { text: 'No', style: 'cancel' },
                                {
                                  text: 'Yes, Cancel',
                                  style: 'destructive',
                                  onPress: async () => {
                                    try {
                                      await ApiService.cancelDoorstepBooking(booking._id);
                                      fetchUserBookings();
                                    } catch (e) {
                                      Alert.alert('Error', 'Could not cancel booking');
                                    }
                                  }
                                }
                              ]
                            );
                          }}
                        >
                          <RNText style={styles.cancelBtnText}>Cancel</RNText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card.Content>
                </Card>
                );
              })}
            </View>
          )}

          {/* Demo Button */}
          <Button
            mode="contained"
            icon="map-marker"
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

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Modals */}
        {selectedService && (
          <BookingModal
            visible={bookingModalVisible}
            onClose={() => setBookingModalVisible(false)}
            service={selectedService}
            preSelectedPartner={selectedParavet}
          />
        )}

        <BookingDetailModal
          visible={bookingDetailVisible}
          onClose={() => setBookingDetailVisible(false)}
          booking={selectedBooking}
        />

        <TrackingModal
          visible={trackingModalVisible}
          onClose={() => setTrackingModalVisible(false)}
          booking={selectedBooking}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroHeader: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -55, right: -40,
  },
  circle2: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20,
  },
  navRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    position: 'relative',
  },
  navBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  navSpacer: { flex: 1 },
  navTitle: {
    position: 'absolute', left: 0, right: 0,
    textAlign: 'center', fontSize: 17,
    fontWeight: '800', color: '#fff', letterSpacing: 0.2,
    zIndex: 1, pointerEvents: 'none',
  },
  heroRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16,
  },
  heroIconBox: {
    width: 54, height: 54, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTextWrap: { flex: 1 },
  heroTitle: {
    fontSize: 20, fontWeight: '900', color: '#fff',
    letterSpacing: -0.3, marginBottom: 3,
  },
  heroSub: {
    fontSize: 12.5, color: 'rgba(255,255,255,0.75)',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 8, gap: 6, marginBottom: 16,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  statText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.35)' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  searchBarText: {
    flex: 1, fontSize: 13.5, color: '#aaa', fontWeight: '500',
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

  realMap: {
    width: '100%',
    height: 280,
  },
  mapLoading: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  mapError: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    margin: 16,
    borderRadius: 16,
  },
  userMarker: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  paravetMarker: {
    backgroundColor: '#7CB342',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  etaCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 16,
  },
  etaCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  etaItem: {
    alignItems: 'center',
    gap: 4,
  },
  etaLabel: {
    color: '#999',
    fontSize: 11,
  },
  etaValue: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: 14,
  },
  etaDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  trackingPartnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  // Map Placeholder - kept for reference
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

  selectParavetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7CB342',
    borderStyle: 'dashed',
  },
  selectParavetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectParavetIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7CB342',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectParavetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  selectParavetSubtitle: {
    fontSize: 12,
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
    paddingVertical: 24,
  },
  plansRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  planCard: {
    flex: 1,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  planCardContent: {
    padding: 4,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  planBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  planBadgeSpacer: {
    height: 28,
    marginBottom: 14,
  },
  planName: {
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 10,
    fontSize: 18,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  planPriceBig: {
    fontSize: 32,
    fontWeight: '900',
    color: '#7CB342',
    letterSpacing: -1,
    marginRight: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  planSavings: {
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 18,
    fontSize: 13,
  },
  planFeatures: {
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  planFeature: {
    color: '#444',
    fontSize: 13,
    lineHeight: 20,
  },
  planButton: {
    width: '100%',
    borderRadius: 12,
  },
  planButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 2,
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

  cancelBtn: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  // Active Bookings
  activeBookingsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  activeBookingCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  activeBookingCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bookingCardLeft: {
    flex: 1,
    gap: 5,
  },
  bookingServiceType: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: 15,
    marginBottom: 2,
  },
  bookingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bookingDate: {
    color: '#666',
    fontSize: 12,
  },
  bookingPartner: {
    color: '#7CB342',
    fontWeight: '600',
    fontSize: 12,
  },
  bookingAmount: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingCardRight: {
    alignItems: 'flex-end',
    gap: 8,
    marginLeft: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  viewDetailsBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7CB342',
  },
  viewDetailsBtnText: {
    color: '#7CB342',
    fontSize: 11,
    fontWeight: '600',
  },

  detailModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  detailModalClose: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statusBannerText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  statusBannerSub: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  detailCardTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    color: '#999',
    width: 80,
  },
  detailValue: {
    color: '#1a1a1a',
    fontWeight: '500',
    flexShrink: 1,
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