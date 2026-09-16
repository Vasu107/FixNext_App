import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const PRIMARY_BLUE = '#2B719E';
const SUCCESS_GREEN = '#4ADE80';
const SUCCESS_GREEN_GLOW = 'rgba(74, 222, 128, 0.15)';
const BG_LIGHT = '#FFFFFF';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookingId?: string;
    dateTime?: string;
    address?: string;
  }>();

  const bookingId = params.bookingId ?? '#UA-827391';
  const dateTime = params.dateTime ?? 'Tomorrow, 10 Oct • 10:00 AM';
  const address = params.address ?? '123, Civil Lines, Kanpur, UP';

  const handleViewBookings = () => {
    // Navigate to customer tabs and reset to bookings tab
    router.replace('/(customer)/bookings');
  };

  const handleBackHome = () => {
    // Navigate back to the customer home screen
    router.replace('/(customer)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Success Animation/Illustration ── */}
        <View style={styles.illustrationContainer}>
          {/* Glowing Outer Rings */}
          <View style={styles.glowRingOuter}>
            <View style={styles.glowRingInner}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={44} color="#FFF" />
              </View>
            </View>
          </View>

          {/* Floating Dots to match layout screenshot */}
          <View style={[styles.floatingDot, styles.dotYellow]} />
          <View style={[styles.floatingDot, styles.dotBlue]} />
          <View style={[styles.floatingDot, styles.dotPurple]} />
        </View>

        {/* ── Titles ── */}
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your service has been successfully scheduled. A professional partner will be assigned shortly.
        </Text>

        {/* ── Details Card ── */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>BOOKING ID</Text>
            <Text style={styles.cardHeaderValue}>{bookingId}</Text>
          </View>

          <View style={styles.divider} />

          {/* Date & Time Row */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar" size={18} color="#1E293B" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{dateTime}</Text>
            </View>
          </View>

          {/* Address Row */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={18} color="#1E293B" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Service Address</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {address}
              </Text>
            </View>
          </View>
        </View>

        {/* ── CTA Buttons ── */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleViewBookings} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>View My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textBtn} onPress={handleBackHome}>
          <Text style={styles.textBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── SMS/Email confirmation disclaimer ── */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          We've sent a confirmation email and SMS with the details to your registered contacts.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },

  /* Success Illustration */
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  glowRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: SUCCESS_GREEN_GLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRingInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(74, 222, 128, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SUCCESS_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SUCCESS_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  /* Floating Dots */
  floatingDot: {
    position: 'absolute',
    borderRadius: 8,
  },
  dotYellow: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F59E0B',
    top: 30,
    right: 32,
  },
  dotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    left: 20,
    top: 110,
  },
  dotPurple: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#A855F7',
    bottom: 24,
    right: 48,
  },

  /* Titles */
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
    marginBottom: 32,
  },

  /* Details Card */
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 36,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  cardHeaderValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },

  /* CTA Buttons */
  primaryBtn: {
    width: '100%',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Disclaimer */
  disclaimerContainer: {
    paddingHorizontal: 40,
    marginTop: 'auto',
  },
  disclaimerText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 15,
  },
});
