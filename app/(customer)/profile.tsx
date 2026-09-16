import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

const BLUE = "#2B719E";

const menuItems = [
  { icon: "person-circle-outline", label: "Edit Profile" },
  { icon: "location-outline", label: "Saved Addresses" },
  { icon: "notifications-outline", label: "Notifications" },
  { icon: "shield-checkmark-outline", label: "Privacy & Security" },
  { icon: "help-circle-outline", label: "Help & Support" },
  { icon: "information-circle-outline", label: "About FixNext" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [avatar, setAvatar] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedName = await AsyncStorage.getItem("userProfile_fullName");
          const storedEmail = await AsyncStorage.getItem("userProfile_email");
          const storedAvatar = await AsyncStorage.getItem("userProfile_avatar");
          if (storedName) setName(storedName);
          if (storedEmail) setEmail(storedEmail);
          if (storedAvatar) setAvatar(storedAvatar);
        } catch (e) {
          console.error("Failed to load profile data in tab", e);
        }
      };
      loadProfile();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    router.replace("/login" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="#FFF" />
            )}
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>4.9 ⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>₹2,340</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                i < menuItems.length - 1 && styles.menuRowBorder,
              ]}
              onPress={() => {
                if (item.label === "Edit Profile") {
                  router.push("/edit-profile");
                } else if (item.label === "Saved Addresses") {
                  router.push("/saved-addresses");
                }
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={22} color={BLUE} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0C8D2" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { paddingHorizontal: 20, paddingTop: 20 },
  profileCard: {
    backgroundColor: BLUE,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  name: { fontSize: 22, fontWeight: "800", color: "#FFF", marginBottom: 4 },
  email: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 20 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 15, fontWeight: "800", color: "#FFF", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  statDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.3)" },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: "#222" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D4",
    backgroundColor: "#FFF5F5",
  },
  logoutText: { color: "#E74C3C", fontSize: 15, fontWeight: "700", marginLeft: 8 },
});
