import React, { useEffect, useState } from "react";
import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { CartProvider } from "@/context/CartContext";
import { BookingsProvider } from "@/context/BookingsContext";
import { ProvidersProvider } from "@/context/ProvidersContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

// Keep native splash screen visible until app is fully ready
SplashScreen.preventAutoHideAsync().catch(() => {});

// Role → route mapping (mirrors AuthContext)
const ROLE_ROUTES = {
  customer: "/(customer)",
  provider: "/(provider)",
  admin: "/(admin)",
} as const;

// ─────────────────────────────────────────────
// AppStack — rendered inside AuthProvider & the navigator
// Handles initial navigation once the stack is mounted.
// ─────────────────────────────────────────────

function AppStack() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { user, isReady, onboardingCompleted } = useAuth();
  const [minSplashDone, setMinSplashDone] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Display logo on splash screen for at least 1.5s on app start
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashDone(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const isAppReady = isReady && navState?.key && fontsLoaded && minSplashDone;

  // Initial navigation — runs once the navigator is mounted, auth is resolved, and splash timer finishes
  useEffect(() => {
    if (!isAppReady) return;

    SplashScreen.hideAsync().catch(() => {});

    if (!onboardingCompleted) {
      router.replace("/onboarding" as any);
    } else if (user) {
      router.replace(ROLE_ROUTES[user.role] as any);
    } else {
      router.replace("/login" as any);
    }
  }, [isAppReady]);

  // Show FixNext branded splash screen while session is being rehydrated, fonts are loading, or splash timer is running
  if (!isAppReady) {
    return (
      <View style={styles.loading}>
        <Image
          source={require("../assets/FixNext_logo.png")}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <Text style={styles.splashTagline}>Everyday Home Services, Fixed Fast</Text>
        <ActivityIndicator size="large" color="#0758C9" style={styles.spinner} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(customer)" options={{ animation: "fade" }} />
      <Stack.Screen name="(provider)" options={{ animation: "fade" }} />
      <Stack.Screen name="(admin)" options={{ animation: "fade" }} />
    </Stack>
  );
}

// ─────────────────────────────────────────────
// Root layout — wraps everything with providers
// ─────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProvidersProvider>
        <BookingsProvider>
          <NotificationsProvider>
            <CartProvider>
              <AppStack />
            </CartProvider>
          </NotificationsProvider>
        </BookingsProvider>
      </ProvidersProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  splashLogo: {
    width: 240,
    height: 90,
  },
  splashTagline: {
    fontSize: 14,
    color: "#667085",
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
  spinner: {
    marginTop: 28,
  },
});