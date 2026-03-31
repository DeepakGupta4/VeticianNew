import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../pages/Home';

export default function Index() {
  console.log('📍 Index.jsx rendering - should show Home component');
  
  // Temporary: Show a simple test view to verify route works
  // return (
  //   <View style={styles.testContainer}>
  //     <Text style={styles.testText}>Home Page Test - Route Working!</Text>
  //   </View>
  // );
  
  return <Home />;
}

const styles = StyleSheet.create({
  testContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7CB342',
  },
  testText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});