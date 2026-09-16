import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useBookings } from "@/context/BookingsContext";
import { useAuth } from "@/context/AuthContext";
import { useProviders } from "@/context/ProvidersContext";
import { useNotifications } from "@/context/NotificationsContext";


const BLUE = "#0758C9";
const LIGHT_BG = "#F4F6F9";

type Role = "customer" | "provider";

export default function RegisterScreen() {
  const router = useRouter();

  const { login } = useAuth();
  const { addProvider } = useProviders();

  const [role, setRole] = useState<Role>("customer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [categoryId, setCategoryId] = useState("1");

  const handleContinue = async () => {
    // Validation
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      // Register provider
      if (role === "provider") {
        const newProviderId = Date.now().toString();

        addProvider({
          id: newProviderId,
          catId: categoryId,
          name: fullName.trim(),
          rating: 5.0,
          reviews: 0,
          experience: "New Pro",
          startingAt: "₹199/hr",
          verified: false,
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
          coverImage:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
          about:
            "I'm a newly registered professional on FixNext, ready to help you with your needs!",
          completedJobs: 0,
          serviceCategories: [
            {
              icon: "star",
              label: "General Service",
            },
          ],
          reviews_list: [],
        });
      }

      // Save login session
      await login(
        role,
        fullName.trim(),
        phone.trim()
      );

      // Navigate to dashboard
      if (role === "provider") {
        router.replace("/(provider)" as any);
      } else {
        router.replace("/(customer)" as any);
      }
    } catch (error) {
      console.error("Registration error:", error);

      Alert.alert(
        "Error",
        "Registration failed. Please try again."
      );
    }
  };

  const handleLogin = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={LIGHT_BG}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ================= HEADER ================= */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/FixNext_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.titleText}>
              Join FixNext
            </Text>

            <Text style={styles.subtitleText}>
              Create your account to get started.
            </Text>
          </View>

          {/* ================= ROLE SELECTOR ================= */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>
              I am a...
            </Text>

            <View style={styles.roleRow}>
              {/* CUSTOMER */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === "customer" &&
                    styles.roleCardActive,
                ]}
                onPress={() =>
                  setRole("customer")
                }
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={28}
                  color={
                    role === "customer"
                      ? BLUE
                      : "#A0A0A0"
                  }
                />

                <Text
                  style={[
                    styles.roleCardTitle,
                    role === "customer" &&
                      styles.roleCardTitleActive,
                  ]}
                >
                  Customer
                </Text>

                <Text style={styles.roleCardDesc}>
                  I need home services
                </Text>

                {role === "customer" && (
                  <View
                    style={styles.roleCheckBadge}
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* PROVIDER */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === "provider" &&
                    styles.roleCardActive,
                ]}
                onPress={() =>
                  setRole("provider")
                }
                activeOpacity={0.8}
              >
                <Ionicons
                  name="construct"
                  size={28}
                  color={
                    role === "provider"
                      ? BLUE
                      : "#A0A0A0"
                  }
                />

                <Text
                  style={[
                    styles.roleCardTitle,
                    role === "provider" &&
                      styles.roleCardTitleActive,
                  ]}
                >
                  Provider
                </Text>

                <Text style={styles.roleCardDesc}>
                  I offer services
                </Text>

                {role === "provider" && (
                  <View
                    style={styles.roleCheckBadge}
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= FORM CARD ================= */}
          <View style={styles.cardContainer}>
            {/* FULL NAME */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Full Name
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#888888"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Jane Doe"
                  placeholderTextColor="#A0A0A0"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* PHONE */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Phone Number
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#888888"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="(555) 000-0000"
                  placeholderTextColor="#A0A0A0"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                New Password
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#888888"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.hintText}>
                Must be at least 8 characters.
              </Text>
            </View>

            {/* PROVIDER CATEGORY */}
            {role === "provider" && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Service Category
                </Text>

                <View style={styles.categoryRow}>
                  {[
                    {
                      id: "1",
                      label: "Cleaning",
                    },
                    {
                      id: "2",
                      label: "Plumbing",
                    },
                    {
                      id: "3",
                      label: "AC Repair",
                    },
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catBtn,
                        categoryId === cat.id &&
                          styles.catBtnActive,
                      ]}
                      onPress={() =>
                        setCategoryId(cat.id)
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.catBtnText,
                          categoryId === cat.id &&
                            styles.catBtnTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* CONTINUE BUTTON */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor:
                    role === "provider"
                      ? "#1A6B4A"
                      : BLUE,
                },
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>
                {role === "provider"
                  ? "Register as Provider"
                  : "Register as Customer"}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* ================= FOOTER ================= */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
  },

  /* ================= HEADER ================= */

  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 150,
    height: 50,
    marginBottom: 10,
  },

  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 6,
  },

  subtitleText: {
    fontSize: 15,
    color: "#5E5E5E",
  },

  /* ================= ROLE SELECTOR ================= */

  roleContainer: {
    width: "100%",
    marginBottom: 20,
  },

  roleLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 12,
  },

  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  roleCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E5ED",
    position: "relative",
  },

  roleCardActive: {
    borderColor: BLUE,
    backgroundColor: "#EEF4FF",
  },

  roleCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555555",
    marginTop: 8,
    marginBottom: 4,
  },

  roleCardTitleActive: {
    color: BLUE,
  },

  roleCardDesc: {
    fontSize: 12,
    color: "#A0A0A0",
    textAlign: "center",
  },

  roleCheckBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================= FORM CARD ================= */

  cardContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,

    elevation: 2,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E5ED",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    height: 52,
    paddingHorizontal: 14,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111111",
    height: "100%",
  },

  hintText: {
    fontSize: 13,
    color: "#7A828A",
    marginTop: 6,
  },

  /* ================= BUTTON ================= */

  continueButton: {
    flexDirection: "row",
    height: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },

  /* ================= FOOTER ================= */

  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  footerText: {
    fontSize: 15,
    color: "#666666",
  },

  loginLink: {
    fontSize: 15,
    color: BLUE,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  /* ================= PROVIDER CATEGORY ================= */

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  catBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E5ED",
    alignItems: "center",
  },

  catBtnActive: {
    borderColor: BLUE,
    backgroundColor: "#EEF4FF",
  },

  catBtnText: {
    fontSize: 13,
    color: "#7A828A",
    fontWeight: "600",
  },

  catBtnTextActive: {
    color: BLUE,
    fontWeight: "800",
  },
});