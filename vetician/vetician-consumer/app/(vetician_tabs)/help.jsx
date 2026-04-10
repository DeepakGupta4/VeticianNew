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

export default function NeedHelpScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const reportIssueRef = useRef(null);

  // Selected issue state for pre-filling the form
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

  // When user selects an issue from the list
  const handleSelectIssue = (issue) => {
    console.log('📋 Issue selected:', issue.title);
    
    // Set the selected issue to pre-fill the form
    setSelectedIssue(issue);
    
    // Scroll to the Report Issue Form
    setTimeout(() => {
      reportIssueRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => {}
      );
    }, 100);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />

      {/* Fixed Header */}
      <Header onBack={() => router.back()} />

      {/* Scrollable Content */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.scroll, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Quick Help Actions */}
        <QuickActions onOpenDrawer={() => {}} />

        {/* 2. Common Issues */}
        <CommonIssues onSelectIssue={handleSelectIssue} />

        {/* 3. Live Support Options */}
        <SupportOptions onOpenDrawer={() => {}} />

        {/* 4. Track Requests */}
        <TrackRequests onViewAll={() => {}} />

        {/* 5. Report Issue Form */}
        <View ref={reportIssueRef} collapsable={false}>
          <ReportIssueForm 
            selectedIssue={selectedIssue}
            onClearIssue={() => setSelectedIssue(null)}
          />
        </View>

        {/* 6. Safety & Assurance */}
        <SafetyCard />
      </Animated.ScrollView>
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
