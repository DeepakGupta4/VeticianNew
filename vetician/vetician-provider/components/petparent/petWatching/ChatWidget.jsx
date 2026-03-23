// ─────────────────────────────────────────
//  components/ChatWidget.jsx
//
//  WHAT IT SHOWS:
//    • Staff avatar + online indicator
//    • Message bubble list (staff & me)
//    • Quick reply chips
//    • Text input + send button
//
//  HOW TO USE:
//    <ChatWidget />
// ─────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, ScrollView,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Initial messages ──
const INITIAL_MESSAGES = [
  { from: 'staff', text: 'Max just finished his morning run! 🐾', time: '10:35 AM' },
  { from: 'me',    text: 'Aww that\'s great! Is he eating well?',   time: '10:37 AM' },
  { from: 'staff', text: 'Yes! He finished his bowl completely ', time: '10:40 AM' },
];

// ── Quick reply suggestions ──
const QUICK_REPLIES = [
  '📸 Send new photo',
  '🐾 Is my pet okay?',
  '🍖 Feeding time?',
];

export default function ChatWidget() {

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Send a message (used by both input and quick replies)
  const sendMessage = (text) => {
    const content = text || inputText.trim();
    if (!content) return;
    setMessages(prev => [
      ...prev,
      { from: 'me', text: content, time: 'Now' },
    ]);
    setInputText('');
  };

  return (
    <View style={styles.card}>

      {/* ── Staff info header ── */}
      <View style={styles.staffRow}>
        {/* Avatar + online dot */}
        <View style={styles.avatarWrapper}>
          <View style={styles.staffAvatar}>
            <Text style={{ fontSize: 18 }}>🧑‍⚕️</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>Resort Staff</Text>
          <Text style={styles.onlineLabel}>● Online now</Text>
        </View>

        {/* Call button */}
        <TouchableOpacity style={styles.callBtn}>
          <MaterialCommunityIcons name="phone" size={13} color={COLORS.primary} />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* ── Message bubbles ── */}
      <ScrollView
        style={styles.messageList}
        contentContainerStyle={{ gap: 8, padding: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => {
          const isMe = msg.from === 'me';
          return (
            <View
              key={i}
              style={[
                styles.bubbleRow,
                isMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
              ]}
            >
              <View style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleStaff,
              ]}>
                <Text style={[styles.bubbleText, isMe && { color: '#fff' }]}>
                  {msg.text}
                </Text>
                <Text style={[styles.bubbleTime, isMe && { color: 'rgba(255,255,255,0.6)' }]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── Quick reply chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickReplies}
      >
        {QUICK_REPLIES.map(reply => (
          <TouchableOpacity
            key={reply}
            style={styles.chip}
            onPress={() => sendMessage(reply)}
          >
            <Text style={styles.chipText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Text input row ── */}
      <View style={styles.inputRow}>
        {/* Attach photo */}
        <TouchableOpacity style={styles.attachBtn}>
          <MaterialCommunityIcons name="image-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage()}
          placeholder="Type a message…"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />

        {/* Send button */}
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => sendMessage()}
        >
          <MaterialCommunityIcons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 22,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  // staff header
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  avatarWrapper: { position: 'relative' },
  staffAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 1.5, borderColor: '#fff',
  },
  staffInfo: { flex: 1 },
  staffName:   { fontSize: 13, fontWeight: '700', color: '#1F2D10' },
  onlineLabel: { fontSize: 11, fontWeight: '600', color: COLORS.primary },

  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 10, paddingHorizontal: 13, paddingVertical: 6,
  },
  callBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  // messages
  messageList: { maxHeight: 160 },

  bubbleRow:      { flexDirection: 'row' },
  bubbleRowLeft:  { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end'   },

  bubble: {
    maxWidth: '72%',
    borderRadius: 14, padding: 10,
  },
  bubbleStaff: {
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 12, color: '#1F2D10', lineHeight: 17 },
  bubbleTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 3, textAlign: 'right' },

  // quick replies
  quickReplies: {
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 11, paddingVertical: 6,
  },
  chipText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  // input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachBtn: {
    width: 36, height: 36,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
    fontSize: 12, color: '#1F2D10',
  },
  sendBtn: {
    width: 36, height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
});
