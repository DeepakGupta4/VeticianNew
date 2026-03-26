// components/needhelp/BottomDrawer.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import IssueDetails from './IssueDetails';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.75;

// ------- Chat Drawer Content -------
function ChatContent({ onClose }) {
  const [messages, setMessages] = React.useState([
    { id: 1, from: 'bot', text: 'Hi there! I\'m the Vetician support assistant. How can I help you today?' },
  ]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const inputRef = React.useRef(null);

  const BOT_REPLIES = [
    'I understand your concern. Let me check on this for you.',
    'Thank you for reaching out. Our team will resolve this within 24 hours.',
    'I\'ve logged your issue. Ticket ID: #VT-' + Math.floor(1000 + Math.random() * 9000),
    'Could you share more details so we can assist you better?',
    'Our support team has been notified and will contact you shortly.',
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <View style={chatStyles.container}>
      <View style={chatStyles.handle} />
      <View style={chatStyles.header}>
        <View style={chatStyles.agentRow}>
          <View style={chatStyles.agentAvatar}>
            <MaterialIcons name="support-agent" size={22} color={COLORS2.primary} />
          </View>
          <View>
            <Text style={chatStyles.agentName}>Vetician Support</Text>
            <View style={chatStyles.onlineRow}>
              <View style={chatStyles.onlineDot} />
              <Text style={chatStyles.onlineText}>Online • Avg reply: 2 min</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={chatStyles.closeBtn}>
          <MaterialIcons name="close" size={20} color={COLORS2.subtext} />
        </TouchableOpacity>
      </View>
      <View style={chatStyles.messagesArea}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[chatStyles.bubble, msg.from === 'user' ? chatStyles.userBubble : chatStyles.botBubble]}
          >
            <Text style={[chatStyles.bubbleText, msg.from === 'user' && { color: '#fff' }]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {typing && (
          <View style={chatStyles.botBubble}>
            <Text style={chatStyles.typing}>● ● ●</Text>
          </View>
        )}
      </View>
      <View style={chatStyles.inputRow}>
        <View style={chatStyles.inputWrap}>
          <MaterialIcons name="chat-bubble-outline" size={18} color={COLORS2.subtext} style={{ marginRight: 8 }} />
          <Animated.View style={{ flex: 1 }}>
            <View style={chatStyles.fakeInput}>
              <Text
                style={[chatStyles.fakeInputText, !input && { color: COLORS2.subtext }]}
                onPress={() => inputRef.current?.focus()}
              >
                {input || 'Type a message...'}
              </Text>
            </View>
          </Animated.View>
        </View>
        <TouchableOpacity style={chatStyles.sendBtn} onPress={sendMessage} activeOpacity={0.85}>
          <MaterialIcons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Note: In real RN app, replace fakeInput with actual TextInput */}
    </View>
  );
}

// ------- Emergency Drawer Content -------
function EmergencyContent({ onClose }) {
  return (
    <View style={emergencyStyles.container}>
      <View style={emergencyStyles.handle} />
      <View style={emergencyStyles.iconCircle}>
        <MaterialIcons name="local-hospital" size={36} color="#E53935" />
      </View>
      <Text style={emergencyStyles.title}>Emergency Help</Text>
      <Text style={emergencyStyles.subtitle}>
        If your pet is in immediate danger or needs urgent medical attention, contact us right now.
      </Text>
      <TouchableOpacity
        style={[emergencyStyles.btn, { backgroundColor: '#E53935' }]}
        onPress={() => Linking.openURL('tel:+18001234567')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="phone" size={20} color="#fff" />
        <Text style={emergencyStyles.btnText}>Call Emergency Line</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[emergencyStyles.btn, { backgroundColor: COLORS2.primary, marginTop: 12 }]}
        onPress={() => Linking.openURL('tel:+18001234567')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="local-hospital" size={20} color="#fff" />
        <Text style={emergencyStyles.btnText}>Find Nearest Emergency Vet</Text>
      </TouchableOpacity>
      <View style={emergencyStyles.tipsCard}>
        <Text style={emergencyStyles.tipsTitle}>While Waiting for Help:</Text>
        {['Keep your pet calm and still', 'Do not give any medication', 'Note symptoms to report to vet'].map((tip, i) => (
          <View key={i} style={emergencyStyles.tipRow}>
            <MaterialIcons name="chevron-right" size={16} color={COLORS2.primary} />
            <Text style={emergencyStyles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ------- Main Drawer -------
export default function BottomDrawer({ visible, type, issue, onClose, onContactSupport }) {
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: DRAWER_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  const renderContent = () => {
    if (type === 'issue' && issue) {
      return (
        <IssueDetails
          issue={issue}
          onContactSupport={onContactSupport}
          onClose={onClose}
        />
      );
    }
    if (type === 'chat') {
      return <ChatContent onClose={onClose} />;
    }
    if (type === 'emergency') {
      return <EmergencyContent onClose={onClose} />;
    }
    return null;
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.drawer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        {renderContent()}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: COLORS2.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    overflow: 'hidden',
  },
});

// Chat styles
const chatStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: COLORS2.border, alignSelf: 'center', marginBottom: 12,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS2.border,
  },
  agentRow: { flexDirection: 'row', alignItems: 'center' },
  agentAvatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS2.accent, justifyContent: 'center', alignItems: 'center',
    marginRight: 12, borderWidth: 1, borderColor: COLORS2.border,
  },
  agentName: { fontSize: 15, fontWeight: '700', color: COLORS2.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#43A047', marginRight: 5 },
  onlineText: { fontSize: 11, color: COLORS2.subtext },
  closeBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS2.accent, justifyContent: 'center', alignItems: 'center',
  },
  messagesArea: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 16, gap: 10,
  },
  bubble: {
    maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
  },
  botBubble: {
    backgroundColor: COLORS2.accent, alignSelf: 'flex-start',
    borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS2.border,
  },
  userBubble: {
    backgroundColor: COLORS2.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, color: COLORS2.text, lineHeight: 20 },
  typing: { fontSize: 12, color: COLORS2.subtext, letterSpacing: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS2.border, gap: 10,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS2.accent, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  fakeInput: { flex: 1 },
  fakeInputText: { fontSize: 14, color: COLORS2.text },
  sendBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS2.primary, justifyContent: 'center', alignItems: 'center',
  },
});

// Emergency styles
const emergencyStyles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, alignItems: 'center' },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: COLORS2.border, marginBottom: 20, alignSelf: 'center',
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 2, borderColor: '#FFCDD2',
  },
  title: { fontSize: 22, fontWeight: '700', color: COLORS2.text, marginBottom: 8 },
  subtitle: {
    fontSize: 14, color: COLORS2.subtext, textAlign: 'center', lineHeight: 20,
    marginBottom: 24, paddingHorizontal: 10,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', borderRadius: 14, paddingVertical: 16, gap: 10,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  tipsCard: {
    width: '100%', backgroundColor: COLORS2.accent, borderRadius: 16,
    padding: 16, marginTop: 20, borderWidth: 1, borderColor: COLORS2.border,
  },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS2.text, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tipText: { fontSize: 13, color: COLORS2.text, marginLeft: 4 },
});
