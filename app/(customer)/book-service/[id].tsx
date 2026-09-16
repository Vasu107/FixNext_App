import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const PRIMARY_BLUE = '#2B719E';
const BG_LIGHT = '#F8FAFC';
const SUCCESS_GREEN = "#10B981";

// ── Provider data (kept in sync with provider-profile) ──────────────────────
const PROVIDER_DATA: Record<string, any> = {
  '1': {
    name: 'Sarah Jenkins',
    title: 'Deep Cleaning',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop',
  },
  '2': {
    name: 'Michael Chang',
    title: 'Eco-Friendly Cleaning',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
  },
};

const DEFAULT_PROVIDER = PROVIDER_DATA['1'];

// ── Calendar helpers ─────────────────────────────────────────────────────────
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Time slots ───────────────────────────────────────────────────────────────
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'];

export default function BookServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = PROVIDER_DATA[String(id)] ?? DEFAULT_PROVIDER;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>('10:00 AM');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert('Select a time', 'Please pick a time slot before confirming.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Add location', 'Please enter your service location.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Describe the problem', 'Please describe the issue so the provider can prepare.');
      return;
    }

    // Format the date/time string nicely to display on the success screen
    const selectedDate = new Date(viewYear, viewMonth, selectedDay);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = selectedDate.getTime() - todayDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    let datePrefix = '';
    if (diffDays === 0) {
      datePrefix = 'Today, ';
    } else if (diffDays === 1) {
      datePrefix = 'Tomorrow, ';
    }

    const shortMonth = MONTH_NAMES[viewMonth].substring(0, 3);
    const formattedDateTime = `${datePrefix}${selectedDay} ${shortMonth} • ${selectedTime}`;
    const generatedBookingId = `#UA-${Math.floor(100000 + Math.random() * 900000)}`;

    router.replace({
      pathname: '/booking-success',
      params: {
        bookingId: generatedBookingId,
        dateTime: formattedDateTime,
        address: location.trim(),
      },
    });
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={PRIMARY_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Provider Card ── */}
        <View style={styles.providerCard}>
          <Image source={{ uri: provider.image }} style={styles.providerAvatar} />
          <View style={styles.providerInfo}>
            <Text style={styles.providerService}>{provider.title}</Text>
            <Text style={styles.providerName}>with {provider.name}</Text>
            {provider.verified && (
              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={12} color={SUCCESS_GREEN} />
                <Text style={styles.verifiedText}>Verified Professional</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Select Date ── */}
        <Text style={styles.sectionLabel}>Select Date</Text>

        <View style={styles.calendarCard}>
          {/* Month navigation */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={18} color="#555" />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={18} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Day-of-week labels */}
          <View style={styles.dayLabelRow}>
            {DAY_LABELS.map((d, i) => (
              <Text key={i} style={styles.dayLabel}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <View key={`e-${idx}`} style={styles.calCell} />;
              }
              const selected = day === selectedDay;
              const todayCell = isToday(day);
              return (
                <TouchableOpacity
                  key={`d-${day}`}
                  style={[
                    styles.calCell,
                    todayCell && !selected && styles.todayCell,
                    selected && styles.selectedCell,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.calDayText,
                      todayCell && !selected && styles.todayText,
                      selected && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Available Times ── */}
        <Text style={styles.sectionLabel}>Available Times</Text>

        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const active = slot === selectedTime;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, active && styles.timeSlotActive]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeSlotText, active && styles.timeSlotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Service Location ── */}
        <Text style={styles.sectionLabel}>Service Location</Text>
        <View style={styles.inputCard}>
          <View style={styles.inputIconWrap}>
            <Ionicons name="location-outline" size={18} color={PRIMARY_BLUE} />
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="Enter your address or landmark"
            placeholderTextColor="#AAB2BC"
            value={location}
            onChangeText={setLocation}
            returnKeyType="next"
          />
        </View>

        {/* ── Problem Description ── */}
        <Text style={styles.sectionLabel}>Problem Description</Text>
        <View style={styles.textAreaCard}>
          <View style={styles.textAreaTop}>
            <Ionicons name="document-text-outline" size={18} color={PRIMARY_BLUE} />
            <Text style={styles.textAreaHint}>Describe the issue in detail</Text>
          </View>
          <TextInput
            style={styles.textAreaField}
            placeholder="e.g. The kitchen pipe is leaking and water is dripping under the sink..."
            placeholderTextColor="#AAB2BC"
            value={description}
            onChangeText={(t) => t.length <= 300 && setDescription(t)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/300</Text>
        </View>

        {/* spacer so CTA doesn't overlap */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Confirm CTA ── */}
      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmBtnText}>Confirm Schedule →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Provider Card */
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  providerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  providerInfo: {
    flex: 1,
  },
  providerService: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: SUCCESS_GREEN,
    fontWeight: '600',
  },

  /* Section label */
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },

  /* Calendar */
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  dayLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#AAB2BC',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  calDayText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  todayCell: {
    backgroundColor: '#EBF4FB',
    borderRadius: 20,
  },
  todayText: {
    color: PRIMARY_BLUE,
    fontWeight: '700',
  },
  selectedCell: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '700',
  },

  /* Time slots */
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  timeSlot: {
    width: '46%',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8E4EE',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: '#EBF4FB',
    borderColor: PRIMARY_BLUE,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  timeSlotTextActive: {
    color: PRIMARY_BLUE,
  },

  /* Location input */
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8E4EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 24,
    gap: 8,
  },
  inputIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    paddingVertical: 12,
  },

  /* Description textarea */
  textAreaCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8E4EE',
    padding: 12,
    marginBottom: 8,
  },
  textAreaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  textAreaHint: {
    fontSize: 13,
    color: '#7A828A',
    fontWeight: '600',
  },
  textAreaField: {
    fontSize: 14,
    color: '#111',
    minHeight: 90,
    lineHeight: 21,
  },
  charCount: {
    fontSize: 11,
    color: '#AAB2BC',
    textAlign: 'right',
    marginTop: 4,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  confirmBtn: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
