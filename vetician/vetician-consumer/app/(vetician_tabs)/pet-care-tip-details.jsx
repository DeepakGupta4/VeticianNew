import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../components/petparent/PetCareTips/colors.jsx';
import { TIPS_DATA } from '../../components/petparent/PetCareTips/tipsData.jsx';
import TipDetails from '../../components/petparent/PetCareTips/TipDetails.jsx';
import ActionButtons from '../../components/petparent/PetCareTips/ActionButtons.jsx';

export default function PetCareTipDetails() {
  const router = useRouter();
  const { tipId } = useLocalSearchParams();
  const tip = TIPS_DATA.find((t) => t.id === tipId);

  const [isSaved,       setIsSaved]       = useState(false);
  const [isHelpful,     setIsHelpful]     = useState(false);
  const [helpfulCount,  setHelpfulCount]  = useState(tip?.helpfulCount ?? 0);
  const [savedCount,    setSavedCount]    = useState(tip?.savedCount ?? 0);

  const handleSave = () => {
    setIsSaved((prev) => {
      setSavedCount((c) => prev ? Math.max(0, c - 1) : c + 1);
      return !prev;
    });
  };

  const handleHelpful = () => {
    setIsHelpful((prev) => {
      setHelpfulCount((c) => prev ? Math.max(0, c - 1) : c + 1);
      return !prev;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {tip ? tip.title : 'Pet Care Tips'}
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, isSaved && styles.iconBtnSaved]}
          onPress={handleSave}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {!tip ? (
        <View style={styles.notFound}>
          <MaterialCommunityIcons name="alert-circle-outline" size={52} color={COLORS2.border} />
          <Text style={styles.notFoundText}>Tip not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
            <Text style={styles.goBackBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* pass live counts so stats row updates in real-time */}
          <TipDetails
            tip={tip}
            helpfulCount={helpfulCount}
            savedCount={savedCount}
          />
          <ActionButtons
            tip={tip}
            isSaved={isSaved}
            onSave={handleSave}
            isHelpful={isHelpful}
            onMarkHelpful={handleHelpful}
            helpfulCount={helpfulCount}
            savedCount={savedCount}
          />
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.primary },
  header: {
    backgroundColor: COLORS2.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSaved: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  scroll: { flex: 1, backgroundColor: COLORS2.bg },
  scrollContent: { flexGrow: 1 },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS2.bg,
  },
  notFoundText: { fontSize: 16, color: COLORS2.subtext },
  goBackBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS2.primary,
    borderRadius: 12,
    marginTop: 4,
  },
  goBackBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
