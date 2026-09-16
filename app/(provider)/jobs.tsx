import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useBookings, JobStatus, Booking } from "@/context/BookingsContext";

const GREEN = "#18B978";
const BLUE = "#2B719E";
const RED = "#E74C3C";
const ORANGE = "#F59E0B";
const { width } = Dimensions.get("window");

// Job status display metadata
const JOB_META: Record<JobStatus, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  New: { label: "New", color: "#0758C9", bg: "#EBF3FF", icon: "radio-button-on" },
  Accepted: { label: "Accepted", color: "#7C3AED", bg: "#F3EEFF", icon: "checkmark-circle" },
  "En Route": { label: "En Route", color: "#F59E0B", bg: "#FFF8EB", icon: "navigate" },
  Arrived: { label: "Arrived", color: "#2B719E", bg: "#EBF3FF", icon: "location" },
  "In Progress": { label: "In Progress", color: "#F59E0B", bg: "#FFF8EB", icon: "time" },
  Completed: { label: "Completed", color: GREEN, bg: "#E7FAF2", icon: "checkmark-done-circle" },
  Rejected: { label: "Rejected", color: RED, bg: "#FDECEA", icon: "close-circle" },
};

const TABS: (JobStatus | "All")[] = ["All", "New", "Accepted", "En Route", "Arrived", "In Progress", "Completed", "Rejected"];
const TAB_W = (width - 32) / 3; // 3 visible tabs worth of space

// Next action for each job status (navigate is handled separately)
const NEXT_ACTIONS: Partial<Record<JobStatus, { label: string; icon: keyof typeof Ionicons.glyphMap; next: JobStatus; color: string }[]>> = {
  New: [
    { label: "Accept", icon: "checkmark-circle-outline", next: "Accepted", color: BLUE },
    { label: "Reject", icon: "close-circle-outline", next: "Rejected", color: RED },
  ],
  "In Progress": [
    { label: "Mark Complete", icon: "checkmark-done-circle-outline", next: "Completed", color: GREEN },
  ],
};

export default function ProviderJobs() {
  const { bookings, updateJobStatus, newJobsCount } = useBookings();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JobStatus | "All">("All");
  const tabAnim = useRef(new Animated.Value(0)).current;

  const countFor = (f: JobStatus | "All") =>
    f === "All" ? bookings.length : bookings.filter((b) => b.jobStatus === f).length;

  const handleTab = (f: JobStatus | "All", idx: number) => {
    setActiveTab(f);
    Animated.spring(tabAnim, {
      toValue: idx * TAB_W,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const filtered =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => b.jobStatus === activeTab);

  const handleAction = (bookingId: string, next: JobStatus) => {
    if (next === "Rejected") {
      Alert.alert("Reject Job", "Are you sure you want to reject this job?", [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", style: "destructive", onPress: () => updateJobStatus(bookingId, next) },
      ]);
    } else {
      updateJobStatus(bookingId, next);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Jobs</Text>
          <Text style={styles.headerSub}>
            {bookings.length} total · {newJobsCount} new
          </Text>
        </View>
        {newJobsCount > 0 && (
          <View style={styles.newBadge}>
            <Ionicons name="notifications" size={14} color="#FFF" />
            <Text style={styles.newBadgeText}>  {newJobsCount} New</Text>
          </View>
        )}
      </View>

      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        {(["New", "Accepted", "In Progress", "Completed"] as JobStatus[]).map((s) => {
          const meta = JOB_META[s];
          return (
            <TouchableOpacity
              key={s}
              style={[styles.statCard, { borderColor: meta.color + "33" }]}
              onPress={() => handleTab(s, TABS.indexOf(s))}
            >
              <Text style={[styles.statNum, { color: meta.color }]}>{countFor(s)}</Text>
              <Text style={styles.statLabel}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Animated Tab Bar ── */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((t, idx) => {
            const active = activeTab === t;
            const count = countFor(t);
            return (
              <TouchableOpacity
                key={t}
                style={[styles.tab, { width: TAB_W }]}
                onPress={() => handleTab(t, idx)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t}</Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, active && { backgroundColor: active ? BLUE : "#E4ECF2" }]}>
                    <Text style={[styles.tabBadgeText, active && { color: "#FFF" }]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Animated.View style={[styles.tabIndicator, { width: TAB_W, transform: [{ translateX: tabAnim }] }]} />
      </View>

      {/* ── Job List ── */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={60} color="#C0C8D2" />
            <Text style={styles.emptyTitle}>No jobs here</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "All"
                ? "When customers book services, they'll appear here."
                : `No ${activeTab.toLowerCase()} jobs right now`}
            </Text>
          </View>
        ) : (
          filtered.map((b) => (
            <JobCard
              key={b.bookingId}
              booking={b}
              onAction={handleAction}
              onNavigate={(id) => router.push(`/job-tracking/provider?bookingId=${id}` as any)}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Job Card ── */

function JobCard({
  booking,
  onAction,
  onNavigate,
}: {
  booking: Booking;
  onAction: (bookingId: string, next: JobStatus) => void;
  onNavigate: (bookingId: string) => void;
}) {
  const meta = JOB_META[booking.jobStatus];
  const actions = NEXT_ACTIONS[booking.jobStatus] ?? [];
  const primaryService = booking.services[0];
  const extraCount = booking.services.length - 1;

  return (
    <View style={styles.card}>
      {/* Top: customer + status */}
      <View style={styles.cardTop}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {booking.customerName.charAt(0)}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.customerName}>{booking.customerName}</Text>
          <Text style={styles.bookingId}>{booking.bookingId}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={11} color="#8A92A6" />
            <Text style={styles.dateText}>  {booking.dateTime}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={11} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>  {meta.label}</Text>
        </View>
      </View>

      {/* Services */}
      <View style={styles.servicesBox}>
        <Text style={styles.servicesTitle}>
          {primaryService?.service}{extraCount > 0 ? ` +${extraCount} more` : ""}
        </Text>
        {booking.services.map((s) => (
          <View key={s.id} style={styles.svcRow}>
            <Ionicons name={s.icon as any} size={13} color={BLUE} />
            <Text style={styles.svcName}>{s.service}</Text>
            <Text style={styles.svcQty}>×{s.qty}</Text>
            <Text style={styles.svcPrice}>₹{s.price * s.qty}</Text>
          </View>
        ))}
      </View>

      {/* Address + total */}
      <View style={styles.footerRow}>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={13} color="#8A92A6" />
          <Text style={styles.addressText} numberOfLines={1}>  {booking.address}</Text>
        </View>
        <Text style={styles.totalText}>₹{booking.total}</Text>
      </View>

      {/* Navigate to site button for Accepted jobs */}
      {booking.jobStatus === "Accepted" && (
        <TouchableOpacity
          style={styles.navigateBtn}
          onPress={() => onNavigate(booking.bookingId)}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={16} color="#FFF" />
          <Text style={styles.navigateBtnText}>  Navigate to Site</Text>
        </TouchableOpacity>
      )}

      {/* Action buttons for other statuses */}
      {actions.length > 0 && booking.jobStatus !== "Accepted" && (
        <View style={styles.actionRow}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.next}
              style={[styles.actionBtn, { backgroundColor: a.color }]}
              onPress={() => onAction(booking.bookingId, a.next)}
              activeOpacity={0.8}
            >
              <Ionicons name={a.icon} size={15} color="#FFF" />
              <Text style={styles.actionBtnText}>  {a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F9FB" },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  headerSub: { fontSize: 12, color: "#8A92A6", marginTop: 2 },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: RED,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  newBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  /* Stats Row */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: "#7A828A", marginTop: 2, textAlign: "center" },

  /* Tab bar */
  tabBar: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    position: "relative",
    marginBottom: 4,
  },
  tabScroll: { paddingHorizontal: 16 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 5,
  },
  tabLabel: { fontSize: 12, fontWeight: "600", color: "#8A92A6" },
  tabLabelActive: { color: BLUE, fontWeight: "800" },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E4ECF2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 10, fontWeight: "700", color: "#7A828A" },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 3,
    left: 16,
  },

  list: { paddingHorizontal: 16 },

  /* Empty state */
  emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: "#7A828A", marginTop: 8, textAlign: "center", lineHeight: 20 },

  /* Job Card */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  cardInfo: { flex: 1, marginRight: 8 },
  customerName: { fontSize: 14, fontWeight: "800", color: "#111", marginBottom: 2 },
  bookingId: { fontSize: 11, color: "#8A92A6", fontWeight: "600", marginBottom: 3 },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 12, color: "#555" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  /* Services */
  servicesBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  servicesTitle: { fontSize: 13, fontWeight: "700", color: "#111", marginBottom: 8 },
  svcRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  svcName: { flex: 1, fontSize: 12, color: "#555" },
  svcQty: { fontSize: 12, color: "#8A92A6" },
  svcPrice: { fontSize: 12, fontWeight: "700", color: "#111" },

  /* Footer */
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addressRow: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  addressText: { fontSize: 12, color: "#8A92A6", flex: 1 },
  totalText: { fontSize: 16, fontWeight: "800", color: BLUE },

  /* Actions */
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  navigateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B719E",
    paddingVertical: 12,
    borderRadius: 10,
  },
  navigateBtnText: { color: "#FFF", fontSize: 14, fontWeight: "700" },
});
