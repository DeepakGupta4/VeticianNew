import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle 
}) => {
  const variants = {
    primary: { bg: '#4F46E5', text: '#FFFFFF' },
    secondary: { bg: '#E5E7EB', text: '#374151' },
    danger: { bg: '#B91C1C', text: '#FFFFFF' },
    success: { bg: '#10B981', text: '#FFFFFF' },
    outline: { bg: 'transparent', text: '#4F46E5', border: '#4F46E5' },
  };

  const sizes = {
    sm: { padding: 8, fontSize: 14 },
    md: { padding: 12, fontSize: 16 },
    lg: { padding: 16, fontSize: 18 },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: variantStyle.bg, 
          padding: sizeStyle.padding,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variantStyle.border,
          opacity: disabled ? 0.5 : 1 
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <Text style={[styles.text, { color: variantStyle.text, fontSize: sizeStyle.fontSize }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
