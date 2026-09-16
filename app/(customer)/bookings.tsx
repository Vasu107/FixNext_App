import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookings, BookingStatus, Booking } from "@/context/BookingsContext";

const BLUE = "#2B719E";

const STATUS_META: Record<BookingStatus, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Upcoming: { color: "#0758C9", bg: "#EBF3FF", icon: "time-outline" },
  Completed: { color: "#1A6B4A", bg: "#E6F4EE", icon: "checkmark-circle-outline" },
  Cancelled: { color: "#C0392B", bg: "#FDECEA", icon: "close-circle-outline" },
};

const FILTERS: (BookingStatus | "All")[] = ["All", "Upcoming", "Completed", "Cancelled"];

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 4;

export default function BookingsScreen() {
  const { bookings, updateStatus } = useBookings();
  const [activeFilter, setActiveFilter] = useState<BookingStatus | "All">("All");
  const tabAnim = useRef(new Animated.Value(0)).current;

  const countFor = (f: BookingStatus | "All") =>
    f === "All" ? bookings.length : bookings.filter((b) => b.status === f).length;

  const handleTabPress = (f: BookingStatus | "All", idx: number) => {
    setActiveFilter(f);
    Animated.spring(tabAnim, {
      toValue: idx * TAB_WIDTH,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const filtered =
    activeFilter === "All"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        {bookings.length > 0 && (
          <Text style={styles.subtitle}>{bookings.length} order{bookings.length !== 1 ? "s" : ""}</Text>
        )}
      </View>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        {FILTERS.map((f, idx) => {
          const active = activeFilter === f;
          const count = countFor(f);
          return (
            <TouchableOpacity
              key={f}
              style={styles.tab}
              onPress={() => handleTabPress(f, idx)}
              activeOpacity={0.7}
            >
              <View style={styles.tabInner}>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {f}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        {/* Animated underline */}
        <Animated.View
          style={[
            styles.tabIndicator,
            { transform: [{ translateX: tabAnim }], width: TAB_WIDTH },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#C0C8D2" />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === "All"
                ? "Add services and place your first order!"
                : `No ${activeFilter.toLowerCase()} bookings`}
            </Text>
          </View>
        ) : (
          filtered.map((b) => <BookingCard key={b.bookingId} booking={b} onUpdateStatus={updateStatus} />)
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Booking Card ── */

function BookingCard({
  booking,
  onUpdateStatus,
}: {
  booking: Booking;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}) {
  const meta = STATUS_META[booking.status];
  const primaryService = booking.services[0];
  const extraCount = booking.services.length - 1;

  return (
    <View style={styles.card}>
      {/* Top row: icon + info + status */}
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <Ionicons name={primaryService?.icon as any ?? "bag-handle-outline"} size={22} color={BLUE} />
        </View>

        <View style={styles.info}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {primaryService?.service ?? "Service"}
            {extraCount > 0 ? ` + ${extraCount} more` : ""}
          </Text>
          <Text style={styles.bookingId}>{booking.bookingId}</Text>
          <Text style={styles.dateText}>
            <Ionicons name="calendar-outline" size={11} color="#8A92A6" />
            {"  "}{booking.dateTime}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={11} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>
            {"  "}{booking.status}
          </Text>
        </View>
      </View>

      {/* Services list */}
      {booking.services.map((svc, i) => (
        <View key={svc.id} style={[styles.svcRow, i === 0 && styles.svcRowFirst]}>
          <Text style={styles.svcName} numberOfLines={1}>{svc.service}</Text>
          <Text style={styles.svcPrice}>₹{svc.price} × {svc.qty}</Text>
        </View>
      ))}

      {/* Footer: total + address */}
      <View style={styles.cardDivider} />
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <Ionicons name="location-outline" size={13} color="#8A92A6" />
          <Text style={styles.addressText} numberOfLines={1}>
            {"  "}{booking.address}
          </Text>
        </View>
        <Text style={styles.totalText}>₹{booking.total}</Text>
      </View>

      {/* Action buttons for Upcoming */}
      {booking.status === "Upcoming" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onUpdateStatus(booking.bookingId, "Cancelled")}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => onUpdateStatus(booking.bookingId, "Completed")}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color="#FFF" />
            <Text style={styles.trackBtnText}>  Mark Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontSize: 24, fontWeight: "800", color: "#111" },
  subtitle: { fontSize: 13, color: "#8A92A6", fontWeight: "600" },

  /* Tab Bar */
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A92A6",
  },
  tabLabelActive: {
    color: BLUE,
    fontWeight: "800",
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E4ECF2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: BLUE,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7A828A",
  },
  tabBadgeTextActive: {
    color: "#FFF",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 3,
  },
  list: { paddingHorizontal: 16 },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#111", marginTop: 16 },
  emptySubtitle: {
    fontSize: 14,
    color: "#7A828A",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: { flex: 1, marginRight: 8 },
  serviceName: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 3 },
  bookingId: { fontSize: 11, color: "#8A92A6", marginBottom: 4, fontWeight: "600" },
  dateText: { fontSize: 12, color: "#555" },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  /* Services breakdown */
  svcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#F2F5F8",
  },
  svcRowFirst: { marginTop: 4 },
  svcName: { fontSize: 12, color: "#555", flex: 1, marginRight: 8 },
  svcPrice: { fontSize: 12, fontWeight: "700", color: "#111" },

  /* Footer */
  cardDivider: { height: 1, backgroundColor: "#F2F5F8", marginVertical: 10 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  addressText: { fontSize: 12, color: "#8A92A6", flex: 1 },
  totalText: { fontSize: 15, fontWeight: "800", color: BLUE },

  /* Action buttons */
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E5ED",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 13, fontWeight: "600", color: "#7A828A" },
  trackBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  trackBtnText: { fontSize: 13, fontWeight: "700", color: "#FFF" },
});
