// app/dashboard/need-help.js  (Expo Router path)
// OR screens/NeedHelpScreen.js

import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

import { COLORS2 } from '../../components/petparent/NeedHelpPage/colors';
import Header from '../../components/petparent/NeedHelpPage/Header';
import QuickActions from '../../components/petparent/NeedHelpPage/QuickActions';
import CommonIssues from '../../components/petparent/NeedHelpPage/CommonIssues';
import SupportOptions from '../../components/petparent/NeedHelpPage/SupportOptions';
import TrackRequests from '../../components/petparent/NeedHelpPage/TrackRequests';
import ReportIssueForm from '../../components/petparent/NeedHelpPage/ReportIssueForm';
import SafetyCard from '../../components/petparent/NeedHelpPage/SafetyCard';
import BottomDrawer from '../../components/petparent/NeedHelpPage/BottomDrawer';

export default function NeedHelpScreen() {
  const router = useRouter();

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState(null); // 'issue' | 'chat' | 'emergency'
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Fade-in animation for whole page
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, []);

  // Open drawer with specific type
  const openDrawer = (type, issue = null) => {
    setDrawerType(type);
    setSelectedIssue(issue);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => {
      setDrawerType(null);
      setSelectedIssue(null);
    }, 300);
  };

  // When user selects an issue from the list
  const handleSelectIssue = (issue) => {
    openDrawer('issue', issue);
  };

  // When user taps "Contact Support" inside IssueDetails
  const handleContactSupport = () => {
    closeDrawer();
    setTimeout(() => openDrawer('chat'), 350);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />

      {/* Fixed Header */}
      <Header onBack={() => router.back()} />

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Quick Help Actions */}
        <QuickActions onOpenDrawer={openDrawer} />

        {/* 2. Common Issues */}
        <CommonIssues onSelectIssue={handleSelectIssue} />

        {/* 3. Live Support Options */}
        <SupportOptions onOpenDrawer={openDrawer} />

        {/* 4. Track Requests */}
        <TrackRequests onViewAll={() => {}} />

        {/* 5. Report Issue Form */}
        <ReportIssueForm />

        {/* 6. Safety & Assurance */}
        <SafetyCard />
      </Animated.ScrollView>

      {/* Bottom Drawer - handles issue details, chat, emergency */}
      <BottomDrawer
        visible={drawerVisible}
        type={drawerType}
        issue={selectedIssue}
        onClose={closeDrawer}
        onContactSupport={handleContactSupport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  scroll: {
    flex: 1,
  },
});
