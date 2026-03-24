import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Header                 from '../../../components/petparent/Vaccination/Header';
import PetSelector            from '../../../components/petparent/Vaccination/PetSelector';
import VaccinationSummaryCard from '../../../components/petparent/Vaccination/VaccinationSummaryCard';
import UpcomingVaccines       from '../../../components/petparent/Vaccination/UpcomingVaccines';
import VaccineHistory         from '../../../components/petparent/Vaccination/VaccineHistory';
import ReminderCard           from '../../../components/petparent/Vaccination/ReminderCard';
import EmptyState             from '../../../components/petparent/Vaccination/EmptyState';
import BookVaccinationButton  from '../../../components/petparent/Vaccination/BookVaccinationButton';
import ScheduleModal          from '../../../components/petparent/Vaccination/ScheduleModal';
import VaccineDetailModal     from '../../../components/petparent/Vaccination/VaccineDetailModal';
import BookingPage            from '../../../components/petparent/Vaccination/BookingPage';
import { COLORS2 as COLORS }  from '../../../constant/theme';
import { PETS, INITIAL_UPCOMING, INITIAL_HISTORY } from '../../../components/petparent/Vaccination/mockData';

export default function VaccinationScreen() {
  const router = useRouter();

  const [selectedPet,    setSelectedPet]    = useState(PETS[0]);
  const [upcoming,       setUpcoming]       = useState(INITIAL_UPCOMING);
  const [history,        setHistory]        = useState(INITIAL_HISTORY);
  const [reminderOn,     setReminderOn]     = useState(false);
  const [scheduleVaccine,setScheduleVaccine]= useState(null);
  const [detailRecord,   setDetailRecord]   = useState(null);
  const [showBooking,    setShowBooking]    = useState(false);

  const handleScheduleConfirm = useCallback((id, formattedTime) => {
    setUpcoming((prev) =>
      prev.map((v) => v.id === id ? { ...v, scheduledTime: formattedTime } : v)
    );
    setScheduleVaccine(null);
  }, []);

  const handleBookingConfirm = useCallback((record) => {
    setHistory((prev) => [{ ...record, id: String(record.id) }, ...prev]);
    setShowBooking(false);
  }, []);

  const handleBack           = useCallback(() => router.back(), [router]);
  const handleHideBooking    = useCallback(() => setShowBooking(false), []);
  const handleShowBooking    = useCallback(() => setShowBooking(true), []);
  const handleToggleReminder = useCallback(() => setReminderOn((v) => !v), []);
  const handleCloseSchedule  = useCallback(() => setScheduleVaccine(null), []);
  const handleCloseDetail    = useCallback(() => setDetailRecord(null), []);

  if (showBooking) {
    return (
      <SafeAreaView style={styles.safe}>
        <BookingPage
          pet={selectedPet}
          onBack={handleHideBooking}
          onConfirm={handleBookingConfirm}
        />
      </SafeAreaView>
    );
  }

  const completed = history.length;
  const pending   = upcoming.filter((v) => !v.scheduledTime).length;
  const nextDue   = upcoming[0]?.scheduledTime ?? upcoming[0]?.due ?? '—';

  return (
    <SafeAreaView style={styles.safe}>
      <Header onBack={handleBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PetSelector
          pets={PETS}
          selectedId={selectedPet.id}
          onSelect={setSelectedPet}
        />

        <VaccinationSummaryCard
          completed={completed}
          pending={pending}
          nextDue={nextDue}
        />

        <BookVaccinationButton onPress={handleShowBooking} />

        {upcoming.length === 0 && history.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <UpcomingVaccines
              vaccines={upcoming}
              onSchedule={setScheduleVaccine}
            />
            <VaccineHistory
              records={history}
              onViewDetail={setDetailRecord}
            />
          </>
        )}

        <ReminderCard
          enabled={reminderOn}
          onToggle={handleToggleReminder}
        />
      </ScrollView>

      <ScheduleModal
        visible={!!scheduleVaccine}
        vaccine={scheduleVaccine}
        onClose={handleCloseSchedule}
        onConfirm={handleScheduleConfirm}
      />

      <VaccineDetailModal
        visible={!!detailRecord}
        record={detailRecord}
        onClose={handleCloseDetail}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.primary },
  scroll:  { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
});
