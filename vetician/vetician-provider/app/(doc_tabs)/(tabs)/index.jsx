import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Home from '../../../components/veterinarian/home/Home';

export default function AppHome() {
    const [checking, setChecking] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userId = await AsyncStorage.getItem('userId');
                const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

                const res = await fetch(`${API_URL}/auth/veterinarian/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.success && data.data?.profile?.isVerified) {
                    setIsVerified(true);
                } else if (data.success && data.data?.profile) {
                    router.replace('/(doc_tabs)/pending-approval');
                } else {
                    router.replace('/(doc_tabs)/onboarding/onboarding_conf');
                }
            } catch (e) {
                router.replace('/(doc_tabs)/onboarding/onboarding_conf');
            } finally {
                setChecking(false);
            }
        };
        checkVerification();
    }, []);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#7CB342" />
                <Text style={{ marginTop: 12, color: '#6B7280' }}>Checking account status...</Text>
            </View>
        );
    }

    if (!isVerified) return null;

    return <Home />;
}
