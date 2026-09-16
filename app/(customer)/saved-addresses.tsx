import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BLUE = "#2B719E";
const GREEN = "#22C55E";
const BG = "#F8FAFC";

type AddressType = "home" | "work" | "other";

interface Address {
  id: string;
  label: string;
  type: AddressType;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

const TYPE_ICONS: Record<AddressType, string> = {
  home: "home-outline",
  work: "business-outline",
  other: "location-outline",
};

const TYPE_COLORS: Record<AddressType, string> = {
  home: "#2B719E",
  work: "#7C3AED",
  other: "#F59E0B",
};

const STORAGE_KEY = "savedAddresses";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "Home",
    type: "home",
    line1: "12, Sunshine Apartments",
    line2: "MG Road, Koramangala",
    city: "Bengaluru",
    pincode: "560034",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    type: "work",
    line1: "4th Floor, Tech Park",
    line2: "Whitefield",
    city: "Bengaluru",
    pincode: "560066",
    isDefault: false,
  },
];

const EMPTY_FORM: Omit<Address, "id" | "isDefault"> = {
  label: "",
  type: "home",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
};

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, "id" | "isDefault">>(EMPTY_FORM);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 1600);
    });
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        setAddresses(DEFAULT_ADDRESSES);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADDRESSES));
      }
    } catch (e) {
      setAddresses(DEFAULT_ADDRESSES);
    }
  };

  const saveAddresses = async (updated: Address[]) => {
    setAddresses(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      type: addr.type,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      pincode: addr.pincode,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    let updated: Address[];
    if (editingId) {
      updated = addresses.map((a) =>
        a.id === editingId ? { ...a, ...form } : a
      );
    } else {
      const newAddr: Address = {
        id: Date.now().toString(),
        ...form,
        isDefault: addresses.length === 0,
      };
      updated = [...addresses, newAddr];
    }
    await saveAddresses(updated);
    setModalVisible(false);
    showSuccessModal();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = addresses.filter((a) => a.id !== id);
          if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
            updated[0].isDefault = true;
          }
          await saveAddresses(updated);
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    await saveAddresses(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A2B3C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity onPress={openAdd} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={BLUE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="location-outline" size={48} color="#C0C8D2" />
            </View>
            <Text style={styles.emptyTitle}>No Saved Addresses</Text>
            <Text style={styles.emptySubtitle}>
              Add your home, work, or other addresses for faster booking.
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle-outline" size={18} color="#FFF" />
              <Text style={styles.emptyAddText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
            </Text>
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => openEdit(addr)}
                onDelete={() => handleDelete(addr.id)}
                onSetDefault={() => handleSetDefault(addr.id)}
              />
            ))}

            <TouchableOpacity style={styles.addNewRow} onPress={openAdd}>
              <View style={styles.addNewIcon}>
                <Ionicons name="add" size={20} color={BLUE} />
              </View>
              <Text style={styles.addNewText}>Add New Address</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0C8D2" />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#1A2B3C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Type Selector */}
            <Text style={styles.fieldLabel}>Address Type</Text>
            <View style={styles.typeRow}>
              {(["home", "work", "other"] as AddressType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeChip,
                    form.type === t && {
                      backgroundColor: TYPE_COLORS[t] + "18",
                      borderColor: TYPE_COLORS[t],
                    },
                  ]}
                  onPress={() => setForm((f) => ({ ...f, type: t }))}
                >
                  <Ionicons
                    name={TYPE_ICONS[t] as any}
                    size={16}
                    color={form.type === t ? TYPE_COLORS[t] : "#8A96A3"}
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      form.type === t && { color: TYPE_COLORS[t], fontWeight: "700" },
                    ]}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Label */}
            <Text style={styles.fieldLabel}>Label *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mom's House, Office Block B"
              placeholderTextColor="#B0BAC6"
              value={form.label}
              onChangeText={(v) => setForm((f) => ({ ...f, label: v }))}
            />

            {/* Address Line 1 */}
            <Text style={styles.fieldLabel}>Address Line 1 *</Text>
            <TextInput
              style={styles.input}
              placeholder="House/Flat no., Building name"
              placeholderTextColor="#B0BAC6"
              value={form.line1}
              onChangeText={(v) => setForm((f) => ({ ...f, line1: v }))}
            />

            {/* Address Line 2 */}
            <Text style={styles.fieldLabel}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Street, Area, Landmark (optional)"
              placeholderTextColor="#B0BAC6"
              value={form.line2}
              onChangeText={(v) => setForm((f) => ({ ...f, line2: v }))}
            />

            {/* City & Pincode */}
            <View style={styles.rowFields}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#B0BAC6"
                  value={form.city}
                  onChangeText={(v) => setForm((f) => ({ ...f, city: v }))}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.fieldLabel}>Pincode *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor="#B0BAC6"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={form.pincode}
                  onChangeText={(v) => setForm((f) => ({ ...f, pincode: v }))}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {editingId ? "Update Address" : "Save Address"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
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

            <Text style={styles.successTitle}>Address Saved!</Text>
            <Text style={styles.successSubtitle}>Your address list has been updated successfully.</Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ─── Address Card ─────────────────────────────────────────── */
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const color = TYPE_COLORS[address.type];

  return (
    <View style={[cardStyles.card, address.isDefault && cardStyles.defaultCard]}>
      {address.isDefault && (
        <View style={cardStyles.defaultBadge}>
          <Ionicons name="checkmark-circle" size={12} color={GREEN} />
          <Text style={cardStyles.defaultBadgeText}>Default</Text>
        </View>
      )}

      <View style={cardStyles.top}>
        <View style={[cardStyles.iconWrap, { backgroundColor: color + "18" }]}>
          <Ionicons name={TYPE_ICONS[address.type] as any} size={22} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.label}>{address.label}</Text>
          <Text style={cardStyles.line1}>{address.line1}</Text>
          {address.line2 ? <Text style={cardStyles.line2}>{address.line2}</Text> : null}
          <Text style={cardStyles.cityPin}>
            {address.city} – {address.pincode}
          </Text>
        </View>
      </View>

      <View style={cardStyles.actions}>
        {!address.isDefault && (
          <TouchableOpacity style={cardStyles.actionBtn} onPress={onSetDefault}>
            <Ionicons name="radio-button-off-outline" size={15} color="#8A96A3" />
            <Text style={cardStyles.actionText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={15} color={BLUE} />
          <Text style={[cardStyles.actionText, { color: BLUE }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={15} color="#E74C3C" />
          <Text style={[cardStyles.actionText, { color: "#E74C3C" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0F3",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#1A2B3C",
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: {
    fontSize: 13,
    color: "#8A96A3",
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A2B3C",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8A96A3",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  emptyAddText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  addNewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#E8EDF2",
    borderStyle: "dashed",
  },
  addNewIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  addNewText: { flex: 1, fontSize: 15, fontWeight: "600", color: BLUE },

  modalSafe: { flex: 1, backgroundColor: "#FFF" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0F3",
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#1A2B3C" },
  modalSaveText: { fontSize: 15, fontWeight: "700", color: BLUE },
  modalScroll: { flex: 1 },
  modalContent: { padding: 20, paddingBottom: 40 },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5A6473",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A2B3C",
  },
  rowFields: { flexDirection: "row", marginTop: 0 },

  typeRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  typeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  typeChipText: { fontSize: 13, fontWeight: "600", color: "#8A96A3" },

  saveBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

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

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDF0F3",
  },
  defaultCard: {
    borderColor: GREEN,
    borderWidth: 1.5,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "#F0FDF4",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 12,
  },
  defaultBadgeText: { fontSize: 11, fontWeight: "700", color: GREEN },
  top: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  label: { fontSize: 15, fontWeight: "700", color: "#1A2B3C", marginBottom: 2 },
  line1: { fontSize: 13, color: "#4A5568", lineHeight: 18 },
  line2: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  cityPin: { fontSize: 12, color: "#8A96A3", marginTop: 2, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  actionText: { fontSize: 12, fontWeight: "600", color: "#8A96A3" },
});
