// hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * useNotifications Hook
 *
 * Manages notification state with real-time booking data from database:
 * - Fetches appointments/bookings from backend
 * - Transforms booking data into notifications
 * - Mark as read / mark all as read / delete
 * - Unread count badge
 * - Real-time updates via polling
 */

export const useNotifications = (userId = 'demo_user') => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const intervalRef = useRef(null);

  // ── Initial Load ──────────────────────────────────────────────
  useEffect(() => {
    loadNotifications();
    startRealTimeListener();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userId]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔔 Fetching notifications from database...');
      
      const token = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (!token || !storedUserId) {
        console.log('⚠️ No auth token or userId found');
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Fetch appointments/bookings
      const response = await fetch(`${API_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Appointments fetched:', data);

      if (data.success && data.appointments) {
        // Transform appointments into notifications
        const transformedNotifications = data.appointments.map(appt => {
          const statusEmoji = {
            pending: '⏳',
            confirmed: '✅',
            completed: '🎉',
            cancelled: '❌'
          };

          const typeMap = {
            pending: 'appointment',
            confirmed: 'appointment',
            completed: 'success',
            cancelled: 'alert'
          };

          return {
            id: appt._id,
            title: `${statusEmoji[appt.status] || '🐾'} Appointment ${appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}`,
            description: `${appt.petName} has a ${appt.bookingType} appointment${appt.illness ? ` for ${appt.illness}` : ''}`,
            type: typeMap[appt.status] || 'appointment',
            timestamp: appt.createdAt || appt.date,
            isRead: appt.isRead || false,
            petName: appt.petName || 'Your Pet',
            actionRoute: '/appointments',
            extraDetails: {
              appointmentId: appt._id,
              petName: appt.petName,
              petType: appt.petType,
              breed: appt.breed,
              date: new Date(appt.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
              time: new Date(appt.date).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              bookingType: appt.bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Visit',
              status: appt.status,
              illness: appt.illness || 'General Checkup',
              clinicName: appt.clinicName || 'Vetician Clinic',
              doctorName: appt.doctorName || 'Dr. Veterinarian'
            }
          };
        });

        // Sort by timestamp (newest first)
        transformedNotifications.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );

        setNotifications(transformedNotifications);
        console.log('✅ Notifications transformed:', transformedNotifications.length);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('❌ Failed to load notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Real-time Polling ───────────────────────────────────────
  // Poll for new notifications every 30 seconds
  const startRealTimeListener = useCallback(() => {
    intervalRef.current = setInterval(() => {
      console.log('🔄 Polling for new notifications...');
      loadNotifications();
    }, 30000); // Poll every 30 seconds
  }, [loadNotifications]);

  // ── Actions ───────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/notifications/${id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/notifications/mark-all-read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  // ── Derived State ─────────────────────────────────────────────
  const filtered =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications: filtered,
    allNotifications: notifications,
    loading,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refresh: loadNotifications,
  };
};
