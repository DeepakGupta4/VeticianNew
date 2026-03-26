// components/needhelp/CommonIssues.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IssueItem from './IssueItem';
import { COLORS2 } from './colors';

export const ISSUES_DATA = [
  {
    id: '1',
    icon: 'wifi-off',
    title: 'App not loading',
    subtitle: 'Connection or startup issues',
    steps: [
      'Check your internet connection (Wi-Fi or mobile data)',
      'Force close and relaunch the app',
      'Clear app cache from device settings',
      'Update the app to the latest version',
      'Restart your device if the problem persists',
    ],
    description: 'This usually happens due to a weak network or outdated app version.',
  },
  {
    id: '2',
    icon: 'cloud-off',
    title: 'Unable to fetch data',
    subtitle: 'Content not loading properly',
    steps: [
      'Pull down to refresh the screen',
      'Check internet connectivity',
      'Log out and log back in',
      'Ensure the app has necessary permissions',
    ],
    description: 'Data sync issues can occur when the server is temporarily unavailable.',
  },
  {
    id: '3',
    icon: 'location-off',
    title: 'Location not detected',
    subtitle: 'GPS or location permission issue',
    steps: [
      'Enable Location Services on your device',
      'Allow location permission for Vetician in Settings',
      'Turn GPS on and wait a few seconds',
      'Ensure you are outdoors or near a window',
    ],
    description: 'Location access is needed to find vets and services near you.',
  },
  {
    id: '4',
    icon: 'payment',
    title: 'Payment failed',
    subtitle: 'Transaction or billing problem',
    steps: [
      'Check your card details are correct',
      'Ensure sufficient balance in your account',
      'Try a different payment method',
      'Contact your bank if the issue continues',
    ],
    description: 'Payment failures are usually caused by incorrect card info or bank blocks.',
  },
  {
    id: '5',
    icon: 'event-busy',
    title: 'Booking not confirmed',
    subtitle: 'Appointment scheduling issue',
    steps: [
      'Check your internet and try again',
      'Verify the vet is still available at that slot',
      'Refresh the bookings page',
      'Contact support with booking details',
    ],
    description: 'Bookings may fail if the slot was taken simultaneously by another user.',
  },
  {
    id: '6',
    icon: 'videocam-off',
    title: 'Cannot connect to vet',
    subtitle: 'Video or call connection issue',
    steps: [
      'Ensure microphone and camera permissions are enabled',
      'Check internet speed (minimum 1 Mbps required)',
      'Rejoin the consultation session',
      'Switch between Wi-Fi and mobile data',
    ],
    description: 'Consultation sessions require stable internet and device permissions.',
  },
  {
    id: '7',
    icon: 'miscellaneous-services',
    title: 'Service not assigned',
    subtitle: 'No professional allocated yet',
    steps: [
      'Wait 10–15 minutes after booking confirmation',
      'Check notification settings for updates',
      'Refresh the service status page',
      'Reach out to support if unresolved after 30 min',
    ],
    description: 'Service assignment depends on professional availability in your area.',
  },
];

export default function CommonIssues({ onSelectIssue }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Common Issues</Text>
        <View style={styles.dot} />
        <Text style={styles.sectionSub}>Tap to see solutions</Text>
      </View>
      <View style={styles.card}>
        {ISSUES_DATA.map((issue, index) => (
          <IssueItem
            key={issue.id}
            icon={issue.icon}
            title={issue.title}
            subtitle={issue.subtitle}
            isLast={index === ISSUES_DATA.length - 1}
            onPress={() => onSelectIssue(issue)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.text,
    letterSpacing: -0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS2.secondary,
    marginHorizontal: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS2.subtext,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
