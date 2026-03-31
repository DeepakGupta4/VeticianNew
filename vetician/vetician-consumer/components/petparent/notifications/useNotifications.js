// hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { mockNotifications } from './mockNotifications';

/**
 * useNotifications Hook
 *
 * Manages notification state with:
 * - Local state + persistence via AsyncStorage
 * - Real-time simulation (replace listener with WebSocket / Firebase in production)
 * - Mark as read / mark all as read / delete
 * - Unread count badge
 *
 * PRODUCTION SWAP:
 *   Replace the simulateRealTime() block with:
 *   Firebase: onSnapshot(query(collection(db,'notifications'), where('userId','==',uid)), ...)
 *   WebSocket: ws.onmessage = (e) => addNotification(JSON.parse(e.data))
 *   REST polling: setInterval(() => fetchNewNotifications(), 30_000)
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
    return () => clearInterval(intervalRef.current);
  }, [userId]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // const res = await fetch(`/api/notifications?userId=${userId}`);
      // const data = await res.json();
      await new Promise((r) => setTimeout(r, 1200)); // simulate network
      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Real-time Simulation ───────────────────────────────────────
  // In production: replace with Firebase onSnapshot or WebSocket listener
  const startRealTimeListener = useCallback(() => {
    const incomingQueue = [
      {
        id: 'rt_1',
        title: '🐾 New Order Placed',
        description: "Your pet food order (Royal Canin 3kg) has been confirmed and will arrive in 2 days.",
        type: 'order',
        timestamp: new Date().toISOString(),
        isRead: false,
        petName: 'All Pets',
        actionRoute: '/orders/track',
        extraDetails: {
          orderId: 'ORD-2024-7821',
          items: ['Royal Canin Adult 3kg', 'Pedigree Treats 500g'],
          total: '₹2,340',
          delivery: '2–3 Business Days',
          trackingId: 'VTCTRK00219',
        },
      },
    ];

    let queueIndex = 0;
    intervalRef.current = setInterval(() => {
      if (queueIndex < incomingQueue.length) {
        const incoming = incomingQueue[queueIndex];
        setNotifications((prev) => {
          const exists = prev.find((n) => n.id === incoming.id);
          if (exists) return prev;
          return [{ ...incoming, timestamp: new Date().toISOString() }, ...prev];
        });
        queueIndex++;
      }
    }, 8000); // push a new notification after 8 seconds for demo
  }, []);

  // ── Actions ───────────────────────────────────────────────────
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // TODO: PATCH /api/notifications/:id { isRead: true }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // TODO: PATCH /api/notifications/mark-all-read { userId }
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: DELETE /api/notifications/:id
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
