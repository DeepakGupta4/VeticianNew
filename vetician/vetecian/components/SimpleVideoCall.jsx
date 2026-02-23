import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SimpleVideoCall({ token, roomName, onCallEnd }) {
  return (
    <View style={styles.container}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.placeholderText}>Video Call Active</Text>
        <Text style={styles.roomText}>Room: {roomName}</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.controlIcon}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.controlIcon}>📹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.endBtn]} onPress={onCallEnd}>
          <Text style={styles.controlIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endBtn: {
    backgroundColor: '#F44336',
  },
  controlIcon: {
    fontSize: 24,
  },
});
