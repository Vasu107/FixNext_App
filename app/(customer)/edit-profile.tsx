import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const BLUE = "#2B719E";
const GRAY_BG = "#F8FAFC";
const BORDER_COLOR = "#E2E8F0";

const PRESET_AVATARS = [
  { id: "1", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { id: "2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { id: "3", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
  { id: "4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
  { id: "5", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
  { id: "6", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
];

const CATEGORIES = [
  { name: "Cleaning", icon: "water-outline" },
  { name: "Plumbing", icon: "construct-outline" },
  { name: "AC Repair", icon: "snow-outline" },
  { name: "Electrician", icon: "flash-outline" },
  { name: "Painting", icon: "brush-outline" },
  { name: "Pest Control", icon: "bug-outline" },
  { name: "Carpentry", icon: "hammer-outline" },
  { name: "Appliances", icon: "tv-outline" },
  { name: "Saloon", icon: "cut-outline" },
  { name: "Massage", icon: "leaf-outline" },
];

export default function EditProfileScreen() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [avatar, setAvatar] = useState("");

  // UI State
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Success animation values
  const circleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.6)).current;

  const showSuccessModal = () => {
    // Reset animations
    circleAnim.setValue(0);
    checkAnim.setValue(0);
    scaleAnim.setValue(0.6);
    setSuccessModalVisible(true);

    Animated.sequence([
      // Card scales in
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      // Circle draws in
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      // Checkmark fades in
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Auto-navigate back after 1.6 s
      setTimeout(() => {
        setSuccessModalVisible(false);
        router.back();
      }, 1600);
    });
  };

  // Load existing profile details
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userProfile_fullName");
        const storedEmail = await AsyncStorage.getItem("userProfile_email");
        const storedPhone = await AsyncStorage.getItem("userProfile_phone");
        const storedBio = await AsyncStorage.getItem("userProfile_bio");
        const storedCategory = await AsyncStorage.getItem("userProfile_category");
        const storedAvatar = await AsyncStorage.getItem("userProfile_avatar");

        if (storedName) setFullName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
        if (storedBio) setBio(storedBio);
        if (storedCategory) setSelectedCategory(storedCategory);
        if (storedAvatar) setAvatar(storedAvatar);
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    };
    loadProfile();
  }, []);

  // Save profile changes
  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full Name is required.");
      return;
    }
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone Number is required.");
      return;
    }

    try {
      await AsyncStorage.setItem("userProfile_fullName", fullName.trim());
      await AsyncStorage.setItem("userProfile_email", email.trim());
      await AsyncStorage.setItem("userProfile_phone", phone.trim());
      await AsyncStorage.setItem("userProfile_bio", bio.trim());
      await AsyncStorage.setItem("userProfile_category", selectedCategory);
      await AsyncStorage.setItem("userProfile_avatar", avatar);

      showSuccessModal();
    } catch (err) {
      console.error("Failed to save profile data", err);
      Alert.alert("Error", "Failed to save profile changes. Please try again.");
    }
  };

  const selectAvatar = (url: string) => {
    setAvatar(url);
    setAvatarModalVisible(false);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to choose a profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      setAvatarModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Card */}
          <View style={styles.card}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={50} color="#94A3B8" />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={() => setAvatarModalVisible(true)}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "fullName" && styles.inputFocused,
                  ]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Jane Doe"
                  placeholderTextColor="#94A3B8"
                  onFocus={() => setFocusedInput("fullName")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Email Address */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "email" && styles.inputFocused,
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="jane.doe@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Phone Number */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "phone" && styles.inputFocused,
                  ]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Bio/About Section */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>About / Bio</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    focusedInput === "bio" && styles.inputFocused,
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself or your services..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onFocus={() => setFocusedInput("bio")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Service Categories (Radio Buttons) */}
              <View style={styles.categorySection}>
                <Text style={styles.sectionLabel}>Service Category</Text>
                <Text style={styles.sectionSubtitle}>
                  Choose your primary service type:
                </Text>
                <View style={styles.radioGroup}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <TouchableOpacity
                        key={cat.name}
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                        onPress={() => setSelectedCategory(cat.name)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radioLeft}>
                          <Ionicons
                            name={cat.icon as any}
                            size={20}
                            color={isSelected ? BLUE : "#64748B"}
                            style={styles.categoryIcon}
                          />
                          <Text
                            style={[
                              styles.radioLabel,
                              isSelected && styles.radioLabelSelected,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInnerCircle} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Avatar Picker Modal */}
        <Modal
          visible={avatarModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setAvatarModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Profile Photo</Text>
                <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              {/* Gallery Picker Button */}
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={pickFromGallery}
                activeOpacity={0.7}
              >
                <View style={styles.galleryButtonIcon}>
                  <Ionicons name="images-outline" size={22} color={BLUE} />
                </View>
                <View style={styles.galleryButtonTextWrap}>
                  <Text style={styles.galleryButtonTitle}>Choose from Gallery</Text>
                  <Text style={styles.galleryButtonSubtitle}>Pick any photo from your device</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or pick an avatar</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.avatarGrid}>
                {PRESET_AVATARS.map((av) => (
                  <TouchableOpacity
                    key={av.id}
                    style={styles.avatarOption}
                    onPress={() => selectAvatar(av.url)}
                  >
                    <Image source={{ uri: av.url }} style={styles.gridAvatar} />
                    {avatar === av.url && (
                      <View style={styles.checkmarkOverlay}>
                        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* ── Success Modal ── */}
        <Modal
          visible={successModalVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.successOverlay}>
            <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
              {/* Animated circle ring */}
              <View style={styles.successIconWrap}>
                <Animated.View
                  style={[
                    styles.successCircle,
                    {
                      borderColor: circleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#D1FAE5", "#10B981"],
                      }),
                      transform: [
                        {
                          scale: circleAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.4, 1.08, 1],
                          }),
                        },
                      ],
                      opacity: circleAnim,
                    },
                  ]}
                />
                {/* Checkmark icon */}
                <Animated.View style={{ opacity: checkAnim, transform: [{ scale: checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }], position: "absolute" }}>
                  <Ionicons name="checkmark" size={52} color="#10B981" />
                </Animated.View>
              </View>

              <Text style={styles.successTitle}>Profile Saved!</Text>
              <Text style={styles.successSubtitle}>Your changes have been updated successfully.</Text>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: GRAY_BG,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: BLUE,
  },
  form: {
    gap: 18,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
    backgroundColor: "#FAFAFA",
  },
  inputFocused: {
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  categorySection: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  radioGroup: {
    gap: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "#FAFAFA",
  },
  radioButtonSelected: {
    borderColor: BLUE,
    backgroundColor: "rgba(43, 113, 158, 0.05)",
  },
  radioLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryIcon: {
    width: 20,
    textAlign: "center",
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  radioLabelSelected: {
    color: BLUE,
    fontWeight: "600",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: BLUE,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  saveButton: {
    backgroundColor: BLUE,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "75%",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "rgba(43, 113, 158, 0.04)",
    marginBottom: 16,
  },
  galleryButtonIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "rgba(43, 113, 158, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryButtonTextWrap: {
    flex: 1,
  },
  galleryButtonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  galleryButtonSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER_COLOR,
  },
  dividerText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  avatarOption: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  gridAvatar: {
    width: "100%",
    height: "100%",
  },
  checkmarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(43, 113, 158, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Success Modal ──
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 44,
    paddingHorizontal: 36,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  successIconWrap: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  successCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 8,
    position: "absolute",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
