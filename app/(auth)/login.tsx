import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, UserRole } from "@/context/AuthContext";
import { BASE_URL } from "@/src/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Complete the web auth session so the browser closes after redirect
WebBrowser.maybeCompleteAuthSession();

const BLUE = "#0758C9";

// ─── Google OAuth Config ──────────────────────────────────────────────────────
// On Android, expo-auth-session requires androidClientId.
// Fallback to web clientId so the hook never crashes when only one ID is set.
const GOOGLE_WEB_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "not-configured";
const GOOGLE_ANDROID_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || GOOGLE_WEB_ID;
const GOOGLE_IOS_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || GOOGLE_WEB_ID;

// Expo auth proxy redirect URI — must be added to Google Cloud Console
// Authorized redirect URIs: https://auth.expo.io/@vasudev123/fixnext
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "fixnext",
});

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Google OAuth setup ──────────────────────────────────────────────────────
  // All three platform IDs are provided so the hook never throws on any platform
  // Google provider already includes its discovery document internally — no second arg needed
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_ID,
    androidClientId: GOOGLE_ANDROID_ID,
    iosClientId: GOOGLE_IOS_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri: REDIRECT_URI,
  });

  /** True only when real credentials have been configured */
  const isGoogleConfigured =
    GOOGLE_WEB_ID !== "not-configured" &&
    GOOGLE_WEB_ID !== "YOUR_GOOGLE_WEB_CLIENT_ID_HERE";

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert("Login", "Please enter your email.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Login", "Please enter your password.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid credentials");
      }

      await AsyncStorage.setItem("token", data.token);
      await loginAs(
        data.user.role as UserRole,
        data.user.name,
        data.user.phone,
        data.user.email
      );
    } catch (error: any) {
      console.log("Login error:", error);
      Alert.alert("Login Failed", error.message || "Something went wrong. Please try again.");
    }
  };

  // Helper: saves login info and routes to the correct dashboard
  const loginAs = async (
    role: UserRole,
    name?: string,
    phone?: string,
    email?: string,
    avatar?: string,
    authProvider?: string
  ) => {
    try {
      await login(role, name, phone, email, avatar, authProvider);
      // Navigate to the correct dashboard based on role
      if (role === "admin") {
        router.replace("/(admin)" as any);
      } else if (role === "provider") {
        router.replace("/(provider)" as any);
      } else {
        router.replace("/(customer)" as any);
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login Failed", "Something went wrong. Please try again.");
    }
  };


  const handleGoogleLogin = async () => {
    if (!isGoogleConfigured) {
      Alert.alert(
        "Setup Required",
        "Google Sign-In is not configured yet.\n\nAdd your Google Client IDs to:\n• FixNext/.env\n• server/.env\n\nSee implementation plan for steps."
      );
      return;
    }

    try {
      setGoogleLoading(true);
      const result = await promptAsync();

      if (result?.type === "success") {
        const idToken = result.params?.id_token ?? result.authentication?.idToken;

        if (!idToken) {
          throw new Error("Google did not return an ID token. Ensure openid scope is requested.");
        }

        // Send idToken to our backend for verification & user upsert
        const serverResponse = await fetch(`${BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await serverResponse.json();

        if (!serverResponse.ok || !data.success) {
          throw new Error(data.error || "Google login failed on server");
        }

        // Store JWT and log in
        await AsyncStorage.setItem("token", data.token);
        await loginAs(
          data.user.role as UserRole,
          data.user.name,
          data.user.phone,
          data.user.email,
          data.user.avatar,
          data.user.authProvider
        );
      } else if (result?.type === "cancel" || result?.type === "dismiss") {
        // User cancelled — do nothing
      } else if (result?.type === "error") {
        throw new Error(result.error?.message || "Google sign-in failed");
      }
    } catch (error: any) {
      console.log("Google login error:", error);
      Alert.alert("Google Login Failed", error.message || "Something went wrong. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password recovery screen will be connected here."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        <View style={styles.container}>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/FixNext_logo.png")}
              style={{ width: 180, height: 60 }}
              resizeMode="contain"
            />
          </View>

          {/* Welcome */}
          <Text style={styles.welcomeText}>
            Welcome back! Please enter your details.
          </Text>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#8D8D8D"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#777777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Remember + Forgot */}
          <View style={styles.optionsRow}>

            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() =>
                setRememberMe(!rememberMe)
              }
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe &&
                  styles.checkboxActive,
                ]}
              >
                {rememberMe && (
                  <Text style={styles.checkmark}>
                    ✓
                  </Text>
                )}
              </View>

              <Text style={styles.rememberText}>
                Remember for 30{"\n"}days.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotText}>
                Forgot{"\n"}password?
              </Text>
            </TouchableOpacity>

          </View>

          {/* Sign In */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.orText}>
              or
            </Text>

            <View style={styles.divider} />
          </View>

          {/* Google */}
          <TouchableOpacity
            style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            disabled={googleLoading || !request}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color="#4285F4" style={{ marginRight: 10 }} />
            ) : (
              <Text style={styles.googleIcon}>G</Text>
            )}

            <Text style={styles.googleText}>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={handleCreateAccount}
            >
              <Text style={styles.createText}>
                Create an account
              </Text>
            </TouchableOpacity>
          </View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: "#FFFFFF",
  },

  /* Logo */

  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },

  logoText: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: BLUE,
  },

  /* Welcome */

  welcomeText: {
    fontSize: 16,
    color: "#5E5E5E",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  /* Fields */

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    color: "#222222",
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#D5D9DF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  /* Remember */

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#D5D9DF",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  rememberText: {
    fontSize: 14,
    color: "#555555",
    marginLeft: 8,
  },

  forgotText: {
    fontSize: 14,
    color: BLUE,
    fontWeight: "600",
  },

  /* Sign In */

  signInButton: {
    height: 54,
    borderRadius: 8,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: BLUE,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Divider */

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  orText: {
    fontSize: 14,
    color: "#777777",
    marginHorizontal: 16,
  },

  /* Google */

  googleButton: {
    height: 54,
    borderWidth: 1,
    borderColor: "#D5D9DF",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  googleButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#F5F5F5",
  },

  googleIcon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4285F4",
    marginRight: 10,
  },

  googleText: {
    fontSize: 15,
    color: "#222222",
    fontWeight: "600",
  },

  /* Register */

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  registerText: {
    fontSize: 15,
    color: "#555555",
  },

  createText: {
    fontSize: 15,
    color: BLUE,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginLeft: 6,
  },


});