import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useBookings } from "@/context/BookingsContext";
import { StatusBar } from "expo-status-bar";

export default function OtpEntryScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { bookings, verifyOtp } = useBookings();
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const booking = bookings.find((b) => b.bookingId === bookingId);

  const handleSubmit = () => {
    if (!bookingId) return;
    const success = verifyOtp(bookingId, otp.trim());
    if (success) {
      Alert.alert("Success", "OTP verified. Job started.");
      // navigate back to jobs list or provider home
      router.replace("/provider" as any);
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>Booking not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP sent to Customer</Text>
        <Text style={styles.subtitle}>Booking ID: {bookingId}</Text>
        <TextInput
          style={styles.input}
          placeholder="4‑digit OTP"
          keyboardType="numeric"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F6F9FB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 24, marginTop: 80 },
  title: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 12 },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 24 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#C0C8D2",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  submitBtn: {
    backgroundColor: "#2B719E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
