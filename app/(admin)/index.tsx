import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const ADMIN_DARK = "#1A1A2E";
const ADMIN_ACCENT = "#E94560";

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.adminBadge}>🔒 ADMIN</Text>
            <Text style={styles.name}>Admin Panel</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: "people", value: "1,248", label: "Total Users", bg: "#3A3A5C" },
            { icon: "construct", value: "312", label: "Providers", bg: "#3A3A5C" },
            { icon: "calendar", value: "87", label: "Bookings Today", bg: "#3A3A5C" },
            { icon: "wallet", value: "₹86K", label: "Revenue", bg: "#3A3A5C" },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon as any} size={24} color={ADMIN_ACCENT} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: "people-circle", label: "Manage Users" },
            { icon: "construct", label: "Manage Providers" },
            { icon: "list", label: "All Bookings" },
            { icon: "settings", label: "Settings" },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={26} color={ADMIN_ACCENT} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[
          { text: "New provider registered: Amit K.", time: "2 mins ago", icon: "person-add" },
          { text: "Booking #1423 completed", time: "15 mins ago", icon: "checkmark-circle" },
          { text: "New customer: Priya S.", time: "1 hr ago", icon: "person" },
        ].map((item, i) => (
          <View key={i} style={styles.activityRow}>
            <View style={styles.activityIcon}>
              <Ionicons name={item.icon as any} size={18} color={ADMIN_ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>{item.text}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ADMIN_DARK },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  adminBadge: {
    fontSize: 11,
    color: ADMIN_ACCENT,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: { fontSize: 26, fontWeight: "800", color: "#FFFFFF" },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ADMIN_ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statValue: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 8 },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#FFFFFF", marginBottom: 16 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 28 },
  actionCard: {
    width: "48%",
    backgroundColor: "#2A2A4A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(233,69,96,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionLabel: { fontSize: 13, fontWeight: "600", color: "#FFFFFF", textAlign: "center" },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A4A",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(233,69,96,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityText: { fontSize: 13, color: "#FFFFFF", fontWeight: "500" },
  activityTime: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
});
