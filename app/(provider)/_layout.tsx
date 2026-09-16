import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBookings } from "@/context/BookingsContext";
import { useAuth } from "@/context/AuthContext";

const BLUE = "#2B719E";
const INACTIVE = "#667085";
const DARK = "#101828";
const MUTED = "#98A2B3";
const LIGHT_BG = "#F6F9FB";

// ==================================================
// HEADER
// ==================================================

function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* LOCATION */}
      <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
        <Ionicons name="location" size={18} color={BLUE} />
        <Text style={styles.locationText}>Home • Kanpur</Text>
        <Ionicons name="chevron-down" size={16} color={BLUE} />
      </TouchableOpacity>

      {/* HEADER RIGHT */}
      <View style={styles.headerRight}>
        {/* NOTIFICATION */}
        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.7}
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={23} color={DARK} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        {/* PROFILE */}
        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={() => router.push("/(provider)/profile" as any)}
        >
          <Ionicons name="person-outline" size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const insets = useSafeAreaInsets();
  const { newJobsCount } = useBookings();

  // ── RBAC Guard: providers only ──
  useEffect(() => {
    if (isReady && user?.role !== "provider") {
      router.replace("/login" as any);
    }
  }, [isReady, user]);

  const tabBarHeight = 68 + insets.bottom;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }} edges={["top", "left", "right"]}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: BLUE,
          tabBarInactiveTintColor: INACTIVE,

          tabBarStyle: {
            height: tabBarHeight,

            paddingTop: 8,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,

            backgroundColor: "#FFFFFF",

            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",

            elevation: 8,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 6,

            // IMPORTANT:
            // Allows the active circle to rise outside the tab bar.
            overflow: "visible",
          },

          tabBarItemStyle: {
            height: 62,
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 2,
          },

          tabBarHideOnKeyboard: true,
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",

            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                activeIcon="home"
                inactiveIcon="home-outline"
                color={color}
              />
            ),
          }}
        />

        {/* EARNINGS */}
        <Tabs.Screen
          name="earnings"
          options={{
            title: "Earnings",

            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                activeIcon="wallet"
                inactiveIcon="wallet-outline"
                color={color}
              />
            ),
          }}
        />

        {/* JOBS */}
        <Tabs.Screen
          name="jobs"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ position: "relative" }}>
                <TabIcon
                  focused={focused}
                  activeIcon="briefcase"
                  inactiveIcon="briefcase-outline"
                  color={color}
                />
                {newJobsCount > 0 && (
                  <View style={styles.jobsBadge}>
                    <Text style={styles.jobsBadgeText}>
                      {newJobsCount > 9 ? "9+" : newJobsCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        {/* PROFILE */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",

            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                activeIcon="person"
                inactiveIcon="person-outline"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

/* -----------------------------------------
   ACTIVE TAB ICON
------------------------------------------ */

type TabIconProps = {
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  color: string | import("react-native").OpaqueColorValue | import("react-native").ColorValue;
};

function TabIcon({
  focused,
  activeIcon,
  inactiveIcon,
  color,
}: TabIconProps) {
  if (focused) {
    return (
      <View style={styles.activeCircle}>
        <Ionicons
          name={activeIcon}
          size={24}
          color="#FFFFFF"
        />
      </View>
    );
  }

  return (
    <View style={styles.inactiveIcon}>
      <Ionicons
        name={inactiveIcon}
        size={23}
        color={color}
      />
    </View>
  );
}

/* -----------------------------------------
   STYLES
------------------------------------------ */

const styles = StyleSheet.create({
  // -----------------------------------------------
  // HEADER STYLES
  // -----------------------------------------------

  header: {
    height: 64,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F5",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginHorizontal: 6,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F7F9FA",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    top: 7,
    right: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
  },

  iconArea: {
    width: 54,
    height: 54,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  /*
   * This is the raised blue circle
   * shown in your screenshot.
   */
  activeCircle: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: BLUE,

    alignItems: "center",
    justifyContent: "center",

    /*
     * Move the active circle upward.
     */
    transform: [
      {
        translateY: -14,
      },
    ],

    /*
     * White ring around the circle.
     */
    borderWidth: 3,
    borderColor: "#FFFFFF",

    /*
     * Shadow for floating effect.
     */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.20,
    shadowRadius: 5,

    elevation: 7,
  },

  inactiveIcon: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  jobsBadge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFF",
    zIndex: 20,
  },
  jobsBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
});