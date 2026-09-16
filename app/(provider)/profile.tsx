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

// const GREEN = "#1A6B4A";
const BLUE = "#2B719E";

const menuItems = [
  {
    label: "My Profile",
    icon: "person-outline",
  },
  {
    label: "My Services",
    icon: "briefcase-outline",
  },
  {
    label: "Bookings",
    icon: "calendar-outline",
  },
  {
    label: "Earnings",
    icon: "wallet-outline",
  },
  {
    label: "Notifications",
    icon: "notifications-outline",
  },
  {
    label: "Settings",
    icon: "settings-outline",
  },
];

export default function ProviderProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const [name, setName] = useState("Provider Name");
  const [role, setRole] = useState("Service Provider");
  const [avatar, setAvatar] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedName = await AsyncStorage.getItem("userProfile_fullName");
          const storedCategory = await AsyncStorage.getItem("userProfile_category");
          const storedAvatar = await AsyncStorage.getItem("userProfile_avatar");
          if (storedName) setName(storedName);
          if (storedCategory) setRole(storedCategory);
          if (storedAvatar) setAvatar(storedAvatar);
        } catch (e) {
          console.error("Failed to load provider profile data", e);
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color="#FFF" />
              )}
            </View>

            <Text style={styles.name}>{name}</Text>

            <Text style={styles.role}>{role}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={styles.statValue}>₹12K</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuRow,
                  index < menuItems.length - 1 && styles.menuRowBorder,
                ]}
                onPress={() => {
                  if (item.label === "My Profile") {
                    router.push("/edit-profile");
                  }
                }}
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={BLUE}
                  />
                </View>

                <Text style={styles.menuLabel}>{item.label}</Text>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#C0C8D2"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#E74C3C"
            />

            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* Screen */
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Profile Header */
  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  role: {
    fontSize: 14,
    color: "#7A828A",
    marginTop: 4,
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 3,
  },

  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  /* Menu */
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  /* Logout */
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

  logoutText: {
    color: "#E74C3C",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  /* Bottom Spacer */
  bottomSpacer: {
    height: 40,
  },
});