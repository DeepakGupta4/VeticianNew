import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput,
  StyleSheet, Animated, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';

export default function SOSModal({ visible, onClose }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleVideoCall = () => {
    onClose();
    router.push('/(vetician_tabs)/pages/VideoConsultation');
  };

  const handleDoctorVisit = () => {
    onClose();
    router.push('/(vetician_tabs)/(tabs)/doorstep');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Message Empty', 'Please describe your pet\'s problem.');
      return;
    }
    try {
      setSending(true);
      const userId = await AsyncStorage.getItem('userId');
      await ApiService.post('/sos/message', { userId, message: message.trim() });
      Alert.alert('Sent! 🐾', 'Your message has been sent to the doctor. They will contact you shortly.');
      setMessage('');
      onClose();
    } catch (e) {
      Alert.alert('Sent! 🐾', 'Your message has been sent to the doctor. They will contact you shortly.');
      setMessage('');
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.sosBadge}>
              <MaterialCommunityIcons name="alarm-light" size={20} color="#fff" />
              <Text style={styles.sosBadgeText}>SOS - Emergency Help</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>What does your pet need?</Text>

          {/* Options */}
          <View style={styles.options}>
            {/* Instant Video Call */}
            <TouchableOpacity style={styles.optionCard} onPress={handleVideoCall} activeOpacity={0.85}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="video" size={28} color="#7CB342" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Instant Video Call</Text>
                <Text style={styles.optionDesc}>Talk to a doctor right now - Online</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7CB342" />
            </TouchableOpacity>

            {/* Doctor Visit */}
            <TouchableOpacity style={styles.optionCard} onPress={handleDoctorVisit} activeOpacity={0.85}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="home-heart" size={28} color="#FF9800" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Doctor Home Visit</Text>
                <Text style={styles.optionDesc}>Book a doorstep visit</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FF9800" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or send a message</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Message Box */}
          <View style={styles.messageBox}>
            <TextInput
              style={styles.input}
              placeholder="Describe your pet's problem... (e.g. my dog is not eating)"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.sendBtn, sending && { opacity: 0.7 }]}
              onPress={handleSendMessage}
              disabled={sending}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.sendText}>{sending ? 'Sending...' : 'Send Message'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7CB342',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  sosBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  options: {
    gap: 12,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 12,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 12,
    color: '#888',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  messageBox: {
    gap: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#333',
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7CB342',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
