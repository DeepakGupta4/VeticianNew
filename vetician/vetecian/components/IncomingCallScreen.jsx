import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, PhoneOff } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function IncomingCallScreen({ visible, callerData, onAccept, onReject }) {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        {/* Caller Info */}
        <View style={styles.callerInfoContainer}>
          <Text style={styles.incomingText}>Incoming Video Call</Text>
          
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Image
              source={{ uri: callerData?.img || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.pulseRing1} />
            <View style={styles.pulseRing2} />
          </Animated.View>

          <Text style={styles.callerName}>{callerData?.name || 'Unknown'}</Text>
          <Text style={styles.callerRole}>{callerData?.role || 'Caller'}</Text>
          
          {callerData?.specialization && (
            <View style={styles.specializationBadge}>
              <Text style={styles.specializationText}>{callerData.specialization}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Reject Button */}
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={onReject}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff4757', '#ff6348']}
              style={styles.buttonGradient}
            >
              <PhoneOff size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.buttonLabel}>Decline</Text>
          </TouchableOpacity>

          {/* Accept Button */}
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2ecc71', '#27ae60']}
              style={styles.buttonGradient}
            >
              <Phone size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.buttonLabel}>Accept</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomText}>📹 Video consultation</Text>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
  },
  callerInfoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  incomingText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 40,
    letterSpacing: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
  },
  pulseRing1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -10,
    left: -10,
  },
  pulseRing2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    top: -20,
    left: -20,
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  callerRole: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 12,
  },
  specializationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  specializationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    marginBottom: 40,
  },
  rejectButton: {
    alignItems: 'center',
  },
  acceptButton: {
    alignItems: 'center',
  },
  buttonGradient: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  bottomInfo: {
    alignItems: 'center',
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
});
