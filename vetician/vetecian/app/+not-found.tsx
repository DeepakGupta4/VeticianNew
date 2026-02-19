import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function ComingSoonScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Coming Soon!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This feature is yet to come</Text>
        <Text style={styles.subtitle}>We're working hard to bring you this functionality soon!</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()} // Go back to previous screen
        >
          <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    maxWidth: 300,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});