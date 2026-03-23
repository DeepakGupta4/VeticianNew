import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { getParent, updateParent } from '../../../store/slices/authSlice';
import { User, Mail, Phone, Calendar, Award, AlertCircle, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../../../utils/validation';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parentData, setParentData] = useState(null);
  const { user } = useSelector(state => state.auth);
  
  const [editingField, setEditingField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    dateOfBirth: '',
    emergencyContact: ''
  });
  
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const result = await dispatch(getParent(userId)).unwrap();
          const parent = result.parent[0];
          setParentData(parent);
          
          if (parent) {
            const dob = parent.dateOfBirth ? new Date(parent.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
            
            setFormData({
              name: parent.name || '',
              phone: user?.phone || parent.phone || '',
              email: parent.email || user?.email || '',
              gender: parent.gender ? parent.gender.charAt(0).toUpperCase() + parent.gender.slice(1) : 'Male',
              dateOfBirth: dob,
              emergencyContact: parent.emergencyContact || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [dispatch, user]);

  const handleFieldPress = (field, currentValue) => {
    if (field === 'phone' || field === 'memberSince') {
      return;
    }
    
    if (field === 'dateOfBirth') {
      setShowDatePicker(true);
      if (formData.dateOfBirth) {
        const parsedDate = new Date(formData.dateOfBirth);
        if (!isNaN(parsedDate.getTime())) {
          setTempDate(parsedDate);
        }
      }
      return;
    }
    
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    const newFormData = { ...formData, [editingField]: tempValue };
    
    if (editingField === 'name' && !tempValue.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (editingField === 'email') {
      if (!tempValue.trim()) {
        Alert.alert('Error', 'Email is required');
        return;
      }
      if (!validateEmail(tempValue)) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }
    }

    try {
      setSaving(true);
      
      let dateOfBirthISO = parentData?.dateOfBirth || '';
      if (formData.dateOfBirth) {
        const parsedDate = new Date(formData.dateOfBirth);
        if (!isNaN(parsedDate.getTime())) {
          dateOfBirthISO = parsedDate.toISOString();
        }
      }

      // Keep phone number as is - don't strip country code
      const phoneNumber = newFormData.phone;

      const result = await dispatch(updateParent({
        name: newFormData.name.trim(),
        email: newFormData.email.trim(),
        phone: phoneNumber,
        gender: newFormData.gender.toLowerCase(),
        dateOfBirth: dateOfBirthISO,
        emergencyContact: newFormData.emergencyContact,
        address: parentData?.address || '',
        image: parentData?.image || null
      })).unwrap();

      if (result.success) {
        setFormData(newFormData);
        setEditingField(null);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      if (Platform.OS === 'ios') {
        setFormData({ ...formData, dateOfBirth: formattedDate });
      } else {
        saveDateOfBirth(selectedDate);
      }
    }
  };

  const saveDateOfBirth = async (date) => {
    try {
      setSaving(true);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });

      // Keep phone number as is - don't strip country code
      const phoneNumber = formData.phone;

      const result = await dispatch(updateParent({
        name: formData.name,
        email: formData.email,
        phone: phoneNumber,
        gender: formData.gender.toLowerCase(),
        dateOfBirth: date.toISOString(),
        emergencyContact: formData.emergencyContact,
        address: parentData?.address || '',
        image: parentData?.image || null
      })).unwrap();

      if (result.success) {
        setFormData({ ...formData, dateOfBirth: formattedDate });
        Alert.alert('Success', 'Date of birth updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update date of birth');
    } finally {
      setSaving(false);
    }
  };

  const handleGenderChange = async (gender) => {
    try {
      setSaving(true);
      
      let dateOfBirthISO = parentData?.dateOfBirth || '';
      if (formData.dateOfBirth && !parentData?.dateOfBirth) {
        const parsedDate = new Date(formData.dateOfBirth);
        if (!isNaN(parsedDate.getTime())) {
          dateOfBirthISO = parsedDate.toISOString();
        }
      }
      
      // Keep phone number as is - don't strip country code
      const phoneNumber = formData.phone;
      
      const result = await dispatch(updateParent({
        name: formData.name,
        email: formData.email,
        phone: phoneNumber,
        gender: gender.toLowerCase(),
        dateOfBirth: dateOfBirthISO,
        emergencyContact: formData.emergencyContact || '',
        address: parentData?.address || 'Not provided',
        image: parentData?.image || null
      })).unwrap();

      if (result.success) {
        setFormData({ ...formData, gender });
        setEditingField(null);
        Alert.alert('Success', 'Gender updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to update gender');
    } finally {
      setSaving(false);
    }
  };

  const getMemberSinceDate = () => {
    if (parentData?.createdAt) {
      const date = new Date(parentData.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'December 2022';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.helpButton}>
          <HelpCircle size={24} color="#FFFFFF" />
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Name Field */}
          <TouchableOpacity 
            style={styles.fieldContainer}
            onPress={() => handleFieldPress('name', formData.name)}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <User size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.fieldValue}>{formData.name || 'Not provided'}</Text>
              </View>
            </View>
            <ChevronRight size={24} color="#999" />
          </TouchableOpacity>

          {/* Phone Number Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Phone size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <Text style={styles.fieldValue}>{formData.phone || 'Not provided'}</Text>
              </View>
            </View>
          </View>

          {/* Email Field */}
          <TouchableOpacity 
            style={styles.fieldContainer}
            onPress={() => handleFieldPress('email', formData.email)}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Mail size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Email</Text>
                {formData.email ? (
                  <Text style={styles.fieldValue}>{formData.email}</Text>
                ) : (
                  <Text style={styles.requiredText}>Required</Text>
                )}
              </View>
            </View>
            <ChevronRight size={24} color="#999" />
          </TouchableOpacity>

          {/* Gender Field */}
          <TouchableOpacity 
            style={styles.fieldContainer}
            onPress={() => setEditingField('gender')}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <User size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <Text style={styles.fieldValue}>{formData.gender}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Date of Birth Field */}
          <TouchableOpacity 
            style={styles.fieldContainer}
            onPress={() => handleFieldPress('dateOfBirth', formData.dateOfBirth)}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Calendar size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                {formData.dateOfBirth ? (
                  <Text style={styles.fieldValue}>{formData.dateOfBirth}</Text>
                ) : (
                  <Text style={styles.requiredText}>Required</Text>
                )}
              </View>
            </View>
            <ChevronRight size={24} color="#999" />
          </TouchableOpacity>

          {/* Member Since Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Award size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Member Since</Text>
                <Text style={styles.fieldValue}>{getMemberSinceDate()}</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact Field */}
          <TouchableOpacity 
            style={[styles.fieldContainer, styles.fieldContainerLast]}
            onPress={() => handleFieldPress('emergencyContact', formData.emergencyContact)}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <AlertCircle size={24} color="#666" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Emergency contact</Text>
                {formData.emergencyContact ? (
                  <Text style={styles.fieldValue}>{formData.emergencyContact}</Text>
                ) : (
                  <Text style={styles.requiredText}>Required</Text>
                )}
              </View>
            </View>
            {!formData.emergencyContact && (
              <Text style={styles.addButton}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal
        visible={editingField !== null && editingField !== 'dateOfBirth' && editingField !== 'gender'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditingField(null)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingField === 'name' && 'Edit Name'}
                {editingField === 'email' && 'Edit Email'}
                {editingField === 'emergencyContact' && 'Emergency Contact'}
              </Text>
              <TouchableOpacity onPress={handleSaveField} disabled={saving}>
                <Text style={[styles.modalSave, saving && styles.modalSaveDisabled]}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                value={tempValue}
                onChangeText={setTempValue}
                placeholder={
                  editingField === 'name' ? 'Enter your name' :
                  editingField === 'email' ? 'Enter your email' :
                  'Enter emergency contact'
                }
                keyboardType={editingField === 'email' ? 'email-address' : 'default'}
                autoFocus
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal
        visible={editingField === 'gender'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditingField(null)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <View style={{ width: 60 }} />
            </View>
            <View style={styles.modalBody}>
              {['Male', 'Female', 'Other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={styles.genderOption}
                  onPress={() => handleGenderChange(gender)}
                  disabled={saving}
                >
                  <Text style={styles.genderOptionText}>{gender}</Text>
                  {formData.gender === gender && (
                    <Text style={styles.genderCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <TouchableOpacity 
                  onPress={() => {
                    saveDateOfBirth(tempDate);
                    setShowDatePicker(false);
                  }}
                  disabled={saving}
                >
                  <Text style={[styles.modalSave, saving && styles.modalSaveDisabled]}>
                    {saving ? 'Saving...' : 'Done'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={tempDate.toISOString().split('T')[0]}
                  onChangeText={(text) => {
                    const newDate = new Date(text);
                    if (!isNaN(newDate.getTime())) {
                      setTempDate(newDate);
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
                <Text style={styles.dateHelperText}>Format: YYYY-MM-DD (e.g., 1990-01-15)</Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4E8D7C',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    gap: 6,
  },
  helpText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  fieldContainerLast: {
    borderBottomWidth: 0,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: '#666',
  },
  requiredText: {
    fontSize: 15,
    color: '#FF6B00',
    fontWeight: '500',
  },
  addButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  modalCancel: {
    fontSize: 17,
    color: '#007AFF',
  },
  modalSave: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalSaveDisabled: {
    color: '#999',
  },
  modalBody: {
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  genderOptionText: {
    fontSize: 17,
    color: '#000',
  },
  genderCheck: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    height: 260,
  },
  datePickerContainer: {
    padding: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
  },
  dateHelperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});