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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, UserRole } from "@/context/AuthContext";

const BLUE = "#0758C9";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
      /*
       * ----------------------------------------
       * CONNECT YOUR REAL LOGIN API HERE
       * ----------------------------------------
       * When your API returns, it should also return the user's role.
       * Then call: await loginAs(role);
       */

      // Default to customer login (no real backend yet)
      await loginAs("customer");
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login Failed", "Something went wrong. Please try again.");
    }
  };

  // Helper: saves login info and routes to the correct dashboard
  const loginAs = async (role: UserRole) => {
    try {
      await login(role);
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


  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Login",
      "Google authentication will be connected here."
    );
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
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.googleIcon}>
              G
            </Text>

            <Text style={styles.googleText}>
              Continue with Google
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

          {/* Demo Login Buttons */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>— Demo Login (Dev Only) —</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: "#0758C9" }]}
                onPress={() => loginAs("customer")}
              >
                <Text style={styles.demoBtnText}>👤 Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: "#1A6B4A" }]}
                onPress={() => loginAs("provider")}
              >
                <Text style={styles.demoBtnText}>🔧 Provider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: "#E94560" }]}
                onPress={() => loginAs("admin")}
              >
                <Text style={styles.demoBtnText}>🔒 Admin</Text>
              </TouchableOpacity>
            </View>
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

  /* Demo Buttons */
  demoContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  demoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  demoBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});