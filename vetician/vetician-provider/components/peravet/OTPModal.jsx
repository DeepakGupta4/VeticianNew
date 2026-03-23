import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X, CheckCircle } from 'lucide-react-native';

export default function OTPModal({
  visible,
  mobileNumber,
  onVerifyOTP,
  onResendOTP,
  loading,
  onClose,
}) {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && visible && !canResend && !verified) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, visible, canResend, verified]);

  // Reset timer when modal opens
  useEffect(() => {
    if (visible) {
      setResendTimer(30);
      setCanResend(false);
      setOtp('');
      setVerified(false);
    }
  }, [visible]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    try {
      const result = await onVerifyOTP(otp);
      if (result.success) {
        setVerified(true);
        setTimeout(() => {
          setOtp('');
          onClose();
        }, 1500);
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    try {
      await onResendOTP();
      setResendTimer(30);
      setCanResend(false);
      setOtp('');
      Alert.alert('OTP Sent', `A new OTP has been sent to ${mobileNumber}`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={loading}
          >
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>

          {verified ? (
            // Success State
            <View style={styles.successContainer}>
              <CheckCircle size={64} color="#34C759" />
              <Text style={styles.successTitle}>Verified!</Text>
              <Text style={styles.successMessage}>
                Your mobile number has been verified successfully.
              </Text>
            </View>
          ) : (
            // OTP Input State
            <>
              <Text style={styles.title}>Verify Your Mobile Number</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit OTP to {mobileNumber}
              </Text>

              {/* OTP Input */}
              <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>Enter OTP</Text>
                <TextInput
                  style={[styles.otpInput, otp.length === 6 && styles.otpInputComplete]}
                  placeholder="000000"
                  value={otp}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text) && text.length <= 6) {
                      setOtp(text);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#ccc"
                  editable={!loading}
                />
                <Text style={styles.otpHint}>Enter the 6-digit code sent to your phone</Text>
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  otp.length !== 6 && styles.verifyButtonDisabled,
                  loading && styles.verifyButtonLoading,
                ]}
                onPress={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              {/* Resend OTP Section */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive OTP?</Text>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendCountdown}>
                    Resend in {resendTimer}s
                  </Text>
                )}
              </View>

              {/* Helper Text */}
              <View style={styles.helperBox}>
                <Text style={styles.helperText}>
                  💡 Tip: Check your SMS or spam folder if you don't see the OTP
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  otpInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#d0d5dc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 12,
    fontVariant: ['tabular-nums'],
  },
  otpInputComplete: {
    borderColor: '#34C759',
    backgroundColor: '#f0fdf4',
  },
  otpHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#00B0FF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#d0d5dc',
    opacity: 0.6,
  },
  verifyButtonLoading: {
    opacity: 0.8,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resendText: {
    fontSize: 13,
    color: '#666',
  },
  resendButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00B0FF',
  },
  resendCountdown: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  helperBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  // Success State Styles
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34C759',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
