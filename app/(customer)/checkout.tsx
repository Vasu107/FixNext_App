import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useBookings } from "@/context/BookingsContext";

const PRIMARY_BLUE = "#2B719E";
const BG = "#F8FAFC";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
];

const DATES = (() => {
  const days: { label: string; sub: string; value: string }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: i === 0 ? "Today" : dayNames[d.getDay()],
      sub: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      value: `${i === 0 ? "Today" : dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`,
    });
  }
  return days;
})();

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / GPay / PhonePe", icon: "phone-portrait-outline" as const, sub: "Instant, no charges" },
  { id: "card", label: "Credit / Debit Card", icon: "card-outline" as const, sub: "Visa, Mastercard, RuPay" },
  { id: "wallet", label: "FixNext Wallet", icon: "wallet-outline" as const, sub: "Balance: ₹0.00" },
  { id: "cod", label: "Cash on Delivery", icon: "cash-outline" as const, sub: "Pay after service" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalCount, clearCart } = useCart();
  const { addBooking } = useBookings();
  const insets = useSafeAreaInsets();

  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [notes, setNotes] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.1);
  const convenienceFee = 29;
  const total = subtotal - discount + convenienceFee;

  const generateBookingId = () =>
    "#FX-" + Math.floor(100000 + Math.random() * 900000);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert("Address Required", "Please enter your service address.");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Add services before placing an order.");
      return;
    }

    setIsPlacing(true);
    // Simulate API call
    setTimeout(() => {
      const bookingId = generateBookingId();
      const dateTime = `${selectedDate} • ${selectedTime}`;

      // Save booking to global store
      addBooking({
        bookingId,
        services: items.map((i) => ({
          id: i.id,
          service: i.service,
          price: i.price,
          qty: i.qty,
          icon: i.icon,
        })),
        dateTime,
        address: address.trim(),
        total,
        status: "Upcoming",
        placedAt: new Date().toISOString(),
      });

      clearCart();
      setIsPlacing(false);
      router.replace({
        pathname: "/booking-success",
        params: { bookingId, dateTime, address: address.trim() },
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Order Items ── */}
        <SectionCard title="Your Services" icon="bag-handle-outline">
          {items.map((item, idx) => (
            <View key={item.id} style={[styles.orderRow, idx < items.length - 1 && styles.orderRowBorder]}>
              <View style={styles.orderIconBox}>
                <Ionicons name={item.icon as any} size={18} color={PRIMARY_BLUE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderName}>{item.service}</Text>
                <Text style={styles.orderDesc}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.orderPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </SectionCard>

        {/* ── Address ── */}
        <SectionCard title="Service Address" icon="location-outline">
          <View style={styles.inputWrapper}>
            <Ionicons name="home-outline" size={18} color="#8A92A6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full address…"
              placeholderTextColor="#AABBC8"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
            />
          </View>
          <View style={styles.savedRow}>
            <Ionicons name="bookmark-outline" size={14} color={PRIMARY_BLUE} />
            <Text style={styles.savedText}>  Use saved address</Text>
          </View>
        </SectionCard>

        {/* ── Date ── */}
        <SectionCard title="Select Date" icon="calendar-outline">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePicker}>
            {DATES.map((d) => {
              const active = selectedDate === d.value;
              return (
                <TouchableOpacity
                  key={d.value}
                  style={[styles.dateChip, active && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d.value)}
                >
                  <Text style={[styles.dateChipLabel, active && styles.dateChipLabelActive]}>{d.label}</Text>
                  <Text style={[styles.dateChipSub, active && styles.dateChipSubActive]}>{d.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SectionCard>

        {/* ── Time ── */}
        <SectionCard title="Select Time Slot" icon="time-outline">
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const active = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* ── Payment ── */}
        <SectionCard title="Payment Method" icon="card-outline">
          {PAYMENT_METHODS.map((pm) => {
            const active = selectedPayment === pm.id;
            return (
              <TouchableOpacity
                key={pm.id}
                style={[styles.payRow, active && styles.payRowActive]}
                onPress={() => setSelectedPayment(pm.id)}
              >
                <View style={[styles.payIcon, active && styles.payIconActive]}>
                  <Ionicons name={pm.icon} size={20} color={active ? "#FFF" : PRIMARY_BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.payLabel, active && styles.payLabelActive]}>{pm.label}</Text>
                  <Text style={styles.paySub}>{pm.sub}</Text>
                </View>
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </SectionCard>

        {/* ── Notes ── */}
        <SectionCard title="Special Instructions" icon="chatbubble-ellipses-outline">
          <TextInput
            style={styles.notesInput}
            placeholder="Any special request for the professional…"
            placeholderTextColor="#AABBC8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </SectionCard>

        {/* ── Bill Summary ── */}
        <SectionCard title="Bill Summary" icon="receipt-outline">
          <BillRow label="Subtotal" value={`₹${subtotal}`} />
          <BillRow label="Discount (10%)" value={`-₹${discount}`} valueColor="#1A6B4A" />
          <BillRow label="Convenience Fee" value={`₹${convenienceFee}`} />
          <View style={styles.billDivider} />
          <BillRow label="Total Payable" value={`₹${total}`} bold />
        </SectionCard>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.stickyBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <View>
          <Text style={styles.stickyTotal}>₹{total}</Text>
          <Text style={styles.stickyLabel}>{totalCount} service{totalCount !== 1 ? "s" : ""}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, isPlacing && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacing}
          activeOpacity={0.85}
        >
          {isPlacing ? (
            <Text style={styles.placeBtnText}>Placing…</Text>
          ) : (
            <>
              <Text style={styles.placeBtnText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ── Small reusable components ── */

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={16} color={PRIMARY_BLUE} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function BillRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.billLabelBold]}>{label}</Text>
      <Text
        style={[
          styles.billValue,
          valueColor ? { color: valueColor } : {},
          bold && styles.billValueBold,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F2F5F8",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111" },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  /* Section card */
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#111" },

  /* Order items */
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  orderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F5F8",
  },
  orderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
  },
  orderName: { fontSize: 13, fontWeight: "700", color: "#111" },
  orderDesc: { fontSize: 11, color: "#7A828A", marginTop: 2 },
  orderPrice: { fontSize: 14, fontWeight: "800", color: "#111" },

  /* Address */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4ECF2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputIcon: { marginTop: 2, marginRight: 8 },
  input: { flex: 1, fontSize: 13, color: "#111", lineHeight: 20 },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedText: { fontSize: 12, color: PRIMARY_BLUE, fontWeight: "600" },

  /* Date */
  datePicker: { marginHorizontal: -4 },
  dateChip: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4ECF2",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 4,
    minWidth: 62,
  },
  dateChipActive: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  dateChipLabel: { fontSize: 12, fontWeight: "700", color: "#555" },
  dateChipLabelActive: { color: "#FFF" },
  dateChipSub: { fontSize: 10, color: "#999", marginTop: 3 },
  dateChipSubActive: { color: "rgba(255,255,255,0.8)" },

  /* Time */
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4ECF2",
    backgroundColor: "#F8FAFC",
  },
  timeChipActive: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  timeChipText: { fontSize: 12, fontWeight: "600", color: "#555" },
  timeChipTextActive: { color: "#FFF" },

  /* Payment */
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4ECF2",
    backgroundColor: "#F8FAFC",
    marginBottom: 10,
    gap: 12,
  },
  payRowActive: { borderColor: PRIMARY_BLUE, backgroundColor: "#EBF3F8" },
  payIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#DFF0FB",
    alignItems: "center",
    justifyContent: "center",
  },
  payIconActive: { backgroundColor: PRIMARY_BLUE },
  payLabel: { fontSize: 13, fontWeight: "700", color: "#111" },
  payLabelActive: { color: PRIMARY_BLUE },
  paySub: { fontSize: 11, color: "#8A92A6", marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C4CDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: PRIMARY_BLUE },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY_BLUE },

  /* Notes */
  notesInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4ECF2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111",
    lineHeight: 20,
    minHeight: 72,
    textAlignVertical: "top",
  },

  /* Bill */
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  billLabel: { fontSize: 13, color: "#7A828A" },
  billLabelBold: { fontSize: 15, fontWeight: "800", color: "#111" },
  billValue: { fontSize: 13, fontWeight: "600", color: "#111" },
  billValueBold: { fontSize: 16, fontWeight: "800", color: PRIMARY_BLUE },
  billDivider: { height: 1, backgroundColor: "#EFEFEF", marginVertical: 10 },

  /* Sticky bar */
  stickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  stickyTotal: { fontSize: 20, fontWeight: "800", color: "#111" },
  stickyLabel: { fontSize: 12, color: "#8A92A6", marginTop: 2 },
  placeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  placeBtnDisabled: { opacity: 0.6 },
  placeBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
