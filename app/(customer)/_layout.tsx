import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ColorValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const BLUE = "#2B719E";
const INACTIVE = "#667085";


export default function TabLayout() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const insets = useSafeAreaInsets();
  const { totalCount } = useCart();

  // ── RBAC Guard: customers only ──
  useEffect(() => {
    if (isReady && user?.role !== "customer") {
      router.replace("/login" as any);
    }
  }, [isReady, user]);

  const tabBarHeight = 68 + insets.bottom;

  return (
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

      {/* BOOKINGS */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="calendar"
              inactiveIcon="calendar-outline"
              color={color}
            />
          ),
        }}
      />

      {/* SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="search"
              inactiveIcon="search-outline"
              color={color}
            />
          ),
        }}
      />

      {/* CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",

          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconArea}>
              <TabIcon
                focused={focused}
                activeIcon="cart"
                inactiveIcon="cart-outline"
                color={color}
              />

              {/* Cart Badge */}
              {totalCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    focused && styles.badgeActive,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {totalCount > 99 ? "99+" : totalCount}
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

      {/* HIDDEN SUB-PAGES (Render full screen without bottom tab bar) */}
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="category/[id]"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="book-service/[id]"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="booking-success"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="saved-addresses"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="provider-profile/[id]"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="job-tracking/provider"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="job-tracking/otp-entry"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

/* -----------------------------------------
   ACTIVE TAB ICON
------------------------------------------ */

type TabIconProps = {
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
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

  badge: {
    position: "absolute",

    top: 0,
    right: -1,

    minWidth: 16,
    height: 16,

    paddingHorizontal: 3,

    borderRadius: 8,

    backgroundColor: "#2872A1",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.5,
    borderColor: "#FFFFFF",

    zIndex: 20,
  },

  badgeActive: {
    /*
     * Keep badge visible even when
     * Cart becomes the active tab.
     */
    top: -2,
    right: -2,
  },

  badgeText: {
    color: "#FFFFFF",

    fontSize: 9,
    fontWeight: "800",

    textAlign: "center",
  },
});