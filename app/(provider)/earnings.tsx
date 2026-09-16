import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBookings } from "@/context/BookingsContext";

const { width } = Dimensions.get("window");
const BLUE = "#2B719E";
const LIGHT_BLUE = "#EBF3F8";
const GRAY_BG = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const TEXT_MUTED = "#64748B";
const GREEN = "#22C55E";
const LIGHT_GREEN = "#F0FDF4";

// ── Demo weekly bar data (Mon–Sun) ──
const WEEKLY_BARS = [
  { day: "Mon", amount: 1200 },
  { day: "Tue", amount: 2800 },
  { day: "Wed", amount: 900  },
  { day: "Thu", amount: 3400 },
  { day: "Fri", amount: 2100 },
  { day: "Sat", amount: 4200 },
  { day: "Sun", amount: 1800 },
];
const BAR_MAX = Math.max(...WEEKLY_BARS.map((b) => b.amount));
const BAR_HEIGHT = 100;

// ── Demo payout history ──
const PAYOUTS = [
  { id: "p1", label: "Payout — Week 36",    date: "10 Sep 2026", amount: 8400,  status: "Paid"    },
  { id: "p2", label: "Payout — Week 35",    date: "3 Sep 2026",  amount: 6200,  status: "Paid"    },
  { id: "p3", label: "Payout — Week 34",    date: "27 Aug 2026", amount: 7850,  status: "Paid"    },
  { id: "p4", label: "Payout — Week 33",    date: "20 Aug 2026", amount: 5300,  status: "Paid"    },
  { id: "p5", label: "Current Week",        date: "Processing",  amount: 12450, status: "Pending" },
];

type Period = "week" | "month" | "all";

export default function ProviderEarnings() {
  const { bookings } = useBookings();
  const [period, setPeriod] = useState<Period>("month");

  // ── Calculate real earnings from completed bookings ──
  const completedBookings = bookings.filter((b) => b.jobStatus === "Completed");
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.total, 0);
  const totalJobs   = completedBookings.length;

  // Stats
  const thisMonthAmount = 12450;
  const lastMonthAmount = 9820;
  const growthPct = (((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100).toFixed(1);
  const isGrowth = thisMonthAmount >= lastMonthAmount;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Earnings</Text>
            <Text style={styles.pageSubtitle}>Track your income & payouts</Text>
          </View>
          <View style={styles.walletIconCircle}>
            <Ionicons name="wallet" size={22} color={BLUE} />
          </View>
        </View>

        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>
            {period === "week" ? "This Week" : period === "month" ? "This Month" : "Total Earned"}
          </Text>
          <Text style={styles.heroAmount}>
            ₹{period === "all" && totalEarned > 0
              ? totalEarned.toLocaleString("en-IN")
              : thisMonthAmount.toLocaleString("en-IN")}
          </Text>

          {/* Growth badge */}
          <View style={[styles.growthBadge, !isGrowth && styles.growthBadgeDown]}>
            <Ionicons
              name={isGrowth ? "trending-up" : "trending-down"}
              size={14}
              color={isGrowth ? GREEN : "#EF4444"}
            />
            <Text style={[styles.growthText, !isGrowth && styles.growthTextDown]}>
              {isGrowth ? "+" : ""}{growthPct}% vs last month
            </Text>
          </View>

          {/* Period Tabs inside hero */}
          <View style={styles.periodRow}>
            {(["week", "month", "all"] as Period[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodTab, period === p && styles.periodTabActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                  {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Quick Stats Row ── */}
        <View style={styles.statsRow}>
          {[
            { icon: "briefcase-outline",  label: "Total Jobs",    value: String(totalJobs > 0 ? totalJobs : 24) },
            { icon: "star-outline",       label: "Avg Rating",    value: "4.8"    },
            { icon: "time-outline",       label: "Pending Pay",   value: "₹12.4K" },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Ionicons name={s.icon as any} size={18} color={BLUE} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Weekly Earnings Bar Chart ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Breakdown</Text>
          <Text style={styles.sectionSub}>Sep 8 – Sep 14, 2026</Text>

          <View style={styles.barChart}>
            {WEEKLY_BARS.map((bar) => {
              const barH = (bar.amount / BAR_MAX) * BAR_HEIGHT;
              const isMax = bar.amount === BAR_MAX;
              return (
                <View key={bar.day} style={styles.barColumn}>
                  <Text style={styles.barAmount}>₹{(bar.amount / 1000).toFixed(1)}k</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { height: barH },
                        isMax && styles.barHighlight,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, isMax && styles.barDayHighlight]}>{bar.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Payout History ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payout History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {PAYOUTS.map((payout, i) => {
            const isPending = payout.status === "Pending";
            return (
              <View
                key={payout.id}
                style={[styles.payoutRow, i < PAYOUTS.length - 1 && styles.payoutRowBorder]}
              >
                <View style={[styles.payoutIconCircle, isPending && styles.payoutIconCirclePending]}>
                  <Ionicons
                    name={isPending ? "time-outline" : "checkmark-circle-outline"}
                    size={20}
                    color={isPending ? "#F59E0B" : GREEN}
                  />
                </View>

                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutLabel}>{payout.label}</Text>
                  <Text style={styles.payoutDate}>{payout.date}</Text>
                </View>

                <View style={styles.payoutRight}>
                  <Text style={styles.payoutAmount}>
                    ₹{payout.amount.toLocaleString("en-IN")}
                  </Text>
                  <View style={[styles.statusBadge, isPending && styles.statusBadgePending]}>
                    <Text style={[styles.statusText, isPending && styles.statusTextPending]}>
                      {payout.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Withdraw CTA ── */}
        <View style={styles.withdrawCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.withdrawTitle}>Available Balance</Text>
            <Text style={styles.withdrawAmount}>₹12,450</Text>
            <Text style={styles.withdrawNote}>Next payout: Mon, 17 Sep</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn}>
            <Ionicons name="arrow-up" size={16} color="#FFF" />
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GRAY_BG,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ── Header ──
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_DARK,
  },
  pageSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Hero Card ──
  heroCard: {
    backgroundColor: BLUE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -1,
    marginBottom: 10,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 4,
    marginBottom: 20,
  },
  growthBadgeDown: {
    backgroundColor: "#FEF2F2",
  },
  growthText: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
  },
  growthTextDown: {
    color: "#EF4444",
  },
  periodRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  periodTab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  periodTabActive: {
    backgroundColor: "#FFF",
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },
  periodTabTextActive: {
    color: BLUE,
  },

  // ── Quick Stats ──
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Section Card ──
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 18,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
  },

  // ── Bar Chart ──
  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barAmount: {
    fontSize: 9,
    color: TEXT_MUTED,
    fontWeight: "600",
    marginBottom: 4,
  },
  barTrack: {
    width: 20,
    height: BAR_HEIGHT,
    backgroundColor: LIGHT_BLUE,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 6,
  },
  bar: {
    width: "100%",
    backgroundColor: BLUE,
    borderRadius: 6,
    opacity: 0.7,
  },
  barHighlight: {
    opacity: 1,
    backgroundColor: BLUE,
  },
  barDay: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: "600",
  },
  barDayHighlight: {
    color: BLUE,
    fontWeight: "800",
  },

  // ── Payout Row ──
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  payoutRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  payoutIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutIconCirclePending: {
    backgroundColor: "#FFFBEB",
  },
  payoutInfo: {
    flex: 1,
  },
  payoutLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  payoutDate: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  payoutRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  payoutAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },
  statusBadge: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgePending: {
    backgroundColor: "#FFFBEB",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: GREEN,
  },
  statusTextPending: {
    color: "#F59E0B",
  },

  // ── Withdraw Card ──
  withdrawCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: TEXT_DARK,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  withdrawTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    marginBottom: 4,
  },
  withdrawAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  withdrawNote: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },
  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 6,
  },
  withdrawBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
