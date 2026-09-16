import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

const BLUE = "#2B719E";
const LIGHT_BLUE = "#EBF3F8";
const BORDER = "#E2E8F0";
const GRAY_BG = "#F8FAFC";
const TEXT_DARK = "#0F172A";
const TEXT_MUTED = "#64748B";

const SERVICE_CATEGORIES = [
  { id: "cleaning",    label: "Cleaning",     icon: "water-outline"     },
  { id: "plumbing",   label: "Plumbing",     icon: "construct-outline" },
  { id: "electrical", label: "Electrical",   icon: "flash-outline"     },
  { id: "ac_repair",  label: "AC Repair",    icon: "snow-outline"      },
  { id: "painting",   label: "Painting",     icon: "brush-outline"     },
  { id: "pest",       label: "Pest Control", icon: "bug-outline"       },
  { id: "carpentry",  label: "Carpentry",    icon: "hammer-outline"    },
  { id: "appliances", label: "Appliances",   icon: "tv-outline"        },
  { id: "saloon",     label: "Saloon",       icon: "cut-outline"       },
  { id: "massage",    label: "Massage",      icon: "leaf-outline"      },
];

const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"];

// ─────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <View
            style={[
              styles.stepDot,
              i + 1 <= current && styles.stepDotActive,
              i + 1 === current && styles.stepDotCurrent,
            ]}
          >
            {i + 1 < current ? (
              <Ionicons name="checkmark" size={10} color="#FFF" />
            ) : (
              <Text style={[styles.stepNum, i + 1 === current && styles.stepNumActive]}>
                {i + 1}
              </Text>
            )}
          </View>
          {i < total - 1 && (
            <View style={[styles.stepLine, i + 1 < current && styles.stepLineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ProviderRegister() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Personal Info
  const [fullName, setFullName]     = useState("");
  const [phone, setPhone]           = useState("");
  const [email, setEmail]           = useState("");
  const [city, setCity]             = useState("");

  // Step 2: Categories
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // Step 3: Experience & Bio
  const [experience, setExperience] = useState("");
  const [bio, setBio]               = useState("");
  const [idNumber, setIdNumber]     = useState("");

  const [loading, setLoading] = useState(false);

  // ── Category toggle ──
  const toggleCategory = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ── Validation per step ──
  const validateStep1 = () => {
    if (!fullName.trim()) { Alert.alert("Required", "Please enter your full name."); return false; }
    if (phone.trim().length < 10) { Alert.alert("Required", "Please enter a valid phone number."); return false; }
    if (!city.trim()) { Alert.alert("Required", "Please enter your city."); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (selectedCats.length === 0) {
      Alert.alert("Required", "Please select at least one service category.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!experience) { Alert.alert("Required", "Please select your experience level."); return false; }
    if (bio.trim().length < 20) { Alert.alert("Required", "Please write a short bio (at least 20 characters)."); return false; }
    return true;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    try {
      const categoryLabels = selectedCats
        .map((id) => SERVICE_CATEGORIES.find((c) => c.id === id)?.label)
        .filter(Boolean)
        .join(", ");

      await AsyncStorage.multiSet([
        ["userProfile_fullName",   fullName],
        ["userProfile_phone",      phone],
        ["userProfile_email",      email],
        ["userProfile_city",       city],
        ["userProfile_category",   categoryLabels],
        ["userProfile_experience", experience],
        ["userProfile_bio",        bio],
        ["userProfile_idNumber",   idNumber],
        ["provider_verified",      "false"],  // awaiting admin verification
      ]);

      // Login as provider — dashboard RBAC guard will let them through
      await login("provider", fullName, phone);
      setStep(4); // show pending verification screen
    } catch (e) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 4 — PENDING VERIFICATION
  // ─────────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <SafeAreaView style={styles.pendingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.pendingContent}>
          <View style={styles.pendingIconCircle}>
            <Ionicons name="time-outline" size={48} color={BLUE} />
          </View>
          <Text style={styles.pendingTitle}>Verification Pending</Text>
          <Text style={styles.pendingSubtitle}>
            Your registration has been submitted successfully. Our admin team will review your
            profile and documents within{" "}
            <Text style={{ fontWeight: "800", color: BLUE }}>24–48 hours</Text>.
          </Text>

          <View style={styles.pendingCard}>
            {[
              { icon: "person-outline",      label: "Name",       value: fullName },
              { icon: "call-outline",        label: "Phone",      value: phone },
              { icon: "briefcase-outline",   label: "Categories", value: selectedCats
                  .map((id) => SERVICE_CATEGORIES.find((c) => c.id === id)?.label)
                  .join(", ") },
              { icon: "time-outline",        label: "Experience", value: experience },
            ].map((row) => (
              <View key={row.label} style={styles.pendingRow}>
                <Ionicons name={row.icon as any} size={18} color={BLUE} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pendingRowLabel}>{row.label}</Text>
                  <Text style={styles.pendingRowValue} numberOfLines={2}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace("/(provider)" as any)}
          >
            <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEPS 1–3
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provider Registration</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* ── Step Indicator ── */}
        <View style={styles.stepContainer}>
          <StepIndicator current={step} total={3} />
          <Text style={styles.stepLabel}>
            {step === 1 && "Personal Information"}
            {step === 2 && "Service Categories"}
            {step === 3 && "Experience & Bio"}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionHint}>
                Tell us about yourself so customers can trust you.
              </Text>

              <InputField
                label="Full Name"
                icon="person-outline"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChangeText={setFullName}
              />
              <InputField
                label="Phone Number"
                icon="call-outline"
                placeholder="e.g. 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
              <InputField
                label="Email (Optional)"
                icon="mail-outline"
                placeholder="e.g. rahul@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputField
                label="City"
                icon="location-outline"
                placeholder="e.g. Kanpur"
                value={city}
                onChangeText={setCity}
              />
            </View>
          )}

          {/* ── STEP 2: Service Categories ── */}
          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionHint}>
                Select all service categories you can offer. You must select at least one.
              </Text>
              <View style={styles.categoriesGrid}>
                {SERVICE_CATEGORIES.map((cat) => {
                  const selected = selectedCats.includes(cat.id);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catCard, selected && styles.catCardSelected]}
                      onPress={() => toggleCategory(cat.id)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.catIconCircle, selected && styles.catIconCircleSelected]}>
                        <Ionicons
                          name={cat.icon as any}
                          size={22}
                          color={selected ? "#FFF" : BLUE}
                        />
                      </View>
                      <Text style={[styles.catLabel, selected && styles.catLabelSelected]}>
                        {cat.label}
                      </Text>
                      {selected && (
                        <View style={styles.catCheck}>
                          <Ionicons name="checkmark-circle" size={16} color={BLUE} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedCats.length > 0 && (
                <View style={styles.selectedBanner}>
                  <Ionicons name="checkmark-circle" size={16} color={BLUE} />
                  <Text style={styles.selectedBannerText}>
                    {selectedCats.length} categor{selectedCats.length === 1 ? "y" : "ies"} selected
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ── STEP 3: Experience & Bio ── */}
          {step === 3 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionHint}>
                Help customers understand your skills and background.
              </Text>

              {/* Experience Picker */}
              <Text style={styles.fieldLabel}>Years of Experience</Text>
              <View style={styles.experienceRow}>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.expChip, experience === opt && styles.expChipSelected]}
                    onPress={() => setExperience(opt)}
                  >
                    <Text style={[styles.expChipText, experience === opt && styles.expChipTextSelected]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bio */}
              <Text style={styles.fieldLabel}>Short Bio</Text>
              <View style={styles.textAreaWrapper}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your skills, past experience and what makes you a great service provider..."
                  placeholderTextColor="#9DB4C5"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              <Text style={styles.charCount}>{bio.length} / 500 characters</Text>

              {/* ID Number */}
              <InputField
                label="Government ID Number (Optional)"
                icon="card-outline"
                placeholder="Aadhaar / PAN / Driving Licence"
                value={idNumber}
                onChangeText={setIdNumber}
              />

              {/* Terms Notice */}
              <View style={styles.termsBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color={BLUE} />
                <Text style={styles.termsText}>
                  By submitting, you agree to FixNext's{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          )}

          {/* ── Footer spacer ── */}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ── Footer CTA ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={() => {
              if (step === 1 && validateStep1()) setStep(2);
              else if (step === 2 && validateStep2()) setStep(3);
              else if (step === 3) handleSubmit();
            }}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {step < 3 ? "Continue" : loading ? "Submitting…" : "Submit Registration"}
            </Text>
            {!loading && <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />}
          </TouchableOpacity>

          {step === 1 && (
            <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
                Already a provider?{" "}
                <Text style={{ color: BLUE, fontWeight: "700" }}>Login</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// REUSABLE INPUT FIELD
// ─────────────────────────────────────────────────────────────
function InputField({
  label, icon, placeholder, value, onChangeText, keyboardType, maxLength,
}: {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "email-address";
  maxLength?: number;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon as any} size={18} color={TEXT_MUTED} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9DB4C5"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? "default"}
          maxLength={maxLength}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#FFF",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GRAY_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  // ── Step Indicator ──
  stepContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: BLUE,
  },
  stepDotCurrent: {
    borderWidth: 2,
    borderColor: BLUE,
    backgroundColor: LIGHT_BLUE,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_MUTED,
  },
  stepNumActive: {
    color: BLUE,
  },
  stepLine: {
    width: 48,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: BLUE,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MUTED,
  },

  // ── Form ──
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  formSection: {
    paddingTop: 16,
  },
  sectionHint: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 20,
    lineHeight: 20,
  },

  // ── Input Field ──
  fieldWrapper: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },

  // ── Categories Grid ──
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  catCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_BG,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    padding: 12,
    position: "relative",
  },
  catCardSelected: {
    borderColor: BLUE,
    backgroundColor: LIGHT_BLUE,
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  catIconCircleSelected: {
    backgroundColor: BLUE,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
    flex: 1,
  },
  catLabelSelected: {
    color: BLUE,
  },
  catCheck: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  selectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BLUE,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    gap: 8,
  },
  selectedBannerText: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE,
  },

  // ── Experience Chips ──
  experienceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  expChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: GRAY_BG,
  },
  expChipSelected: {
    borderColor: BLUE,
    backgroundColor: LIGHT_BLUE,
  },
  expChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  expChipTextSelected: {
    color: BLUE,
  },

  // ── Bio ──
  textAreaWrapper: {
    backgroundColor: GRAY_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 4,
    minHeight: 120,
  },
  textArea: {
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: "right",
    marginBottom: 18,
  },

  // ── Terms ──
  termsBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: LIGHT_BLUE,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 18,
  },
  termsLink: {
    color: BLUE,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFF",
  },
  primaryBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loginLink: {
    alignItems: "center",
    paddingTop: 14,
  },
  loginLinkText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },

  // ── Pending Screen ──
  pendingContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  pendingContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  pendingIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  pendingTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 12,
    textAlign: "center",
  },
  pendingSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  pendingCard: {
    width: "100%",
    backgroundColor: GRAY_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 32,
    gap: 14,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pendingRowLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pendingRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
  },
});
