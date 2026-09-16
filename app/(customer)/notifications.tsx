import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifications, AppNotification } from "@/context/NotificationsContext";

const GREEN = "#1A6B4A";
const BLUE = "#2B719E";

export default function ProviderNotifications() {
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications();

  // Settings Modal State
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [serviceReminders, setServiceReminders] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);

  useEffect(() => {
    loadSettings();
    markAsRead(); // Mark all notifications as read when viewed
  }, []);

  const loadSettings = async () => {
    try {
      const bu = await AsyncStorage.getItem("notif_bookingUpdates");
      const sr = await AsyncStorage.getItem("notif_serviceReminders");
      const po = await AsyncStorage.getItem("notif_promoOffers");

      if (bu !== null) setBookingUpdates(bu === "true");
      if (sr !== null) setServiceReminders(sr === "true");
      if (po !== null) setPromoOffers(po === "true");
    } catch (e) {
      console.log("Error loading notification settings", e);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("notif_bookingUpdates", bookingUpdates.toString());
      await AsyncStorage.setItem("notif_serviceReminders", serviceReminders.toString());
      await AsyncStorage.setItem("notif_promoOffers", promoOffers.toString());
      setSettingsVisible(false);
    } catch (e) {
      console.log("Error saving notification settings", e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={20} color={BLUE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {notifications.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
            No notifications right now.
          </Text>
        ) : (
          notifications.map((notif, idx) => (
            <NotificationCard key={notif.id || idx} notification={notif} />
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSettingsVisible(false)}
            >
              <Ionicons name="close" size={20} color="#111" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Notifications</Text>
            <View style={{ width: 34 }} /> {/* Placeholder for alignment */}
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            <Text style={styles.manageTitle}>Manage Alerts</Text>
            <Text style={styles.manageSubtitle}>
              Choose how you want to be notified about your home care services.
            </Text>

            <View style={styles.settingsCard}>
              {/* Booking Updates */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <View style={styles.settingTitleRow}>
                    <Ionicons name="calendar-outline" size={16} color={BLUE} />
                    <Text style={styles.settingTitle}>Booking Updates</Text>
                  </View>
                  <Text style={styles.settingDesc}>
                    Get real-time updates on your booking status, including confirmations and reschedules.
                  </Text>
                </View>
                <Switch
                  value={bookingUpdates}
                  onValueChange={setBookingUpdates}
                  trackColor={{ false: "#D1D5DB", true: BLUE }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={styles.settingDivider} />

              {/* Service Reminders */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <View style={styles.settingTitleRow}>
                    <Ionicons name="alarm-outline" size={16} color="#10B981" />
                    <Text style={styles.settingTitle}>Service Reminders</Text>
                  </View>
                  <Text style={styles.settingDesc}>
                    Receive reminders 24 hours before your scheduled professional arrives.
                  </Text>
                </View>
                <Switch
                  value={serviceReminders}
                  onValueChange={setServiceReminders}
                  trackColor={{ false: "#D1D5DB", true: BLUE }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={styles.settingDivider} />

              {/* Promotional Offers */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <View style={styles.settingTitleRow}>
                    <Ionicons name="pricetag-outline" size={16} color="#F59E0B" />
                    <Text style={styles.settingTitle}>Promotional Offers</Text>
                  </View>
                  <Text style={styles.settingDesc}>
                    Stay informed about special discounts, seasonal offers, and new services.
                  </Text>
                </View>
                <Switch
                  value={promoOffers}
                  onValueChange={setPromoOffers}
                  trackColor={{ false: "#D1D5DB", true: BLUE }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveSettings}>
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* Notification Card */

function NotificationCard({ notification }: any) {
  const isPartner = notification.type === "partner";
  const isOffer = notification.type === "offer";
  const isRating = notification.type === "rating";

  return (
    <View
      style={[
        styles.notificationCard,
        isPartner && styles.partnerCard,
        isOffer && styles.offerCard,
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.notificationIcon,
          isPartner && styles.partnerIcon,
          isOffer && styles.offerIcon,
          notification.type === "booking" && styles.bookingIcon,
          isRating && styles.ratingIcon,
        ]}
      >
        <Ionicons
          name={notification.icon}
          size={18}
          color={
            isPartner
              ? BLUE
              : isOffer
              ? "#F39C12"
              : notification.type === "booking"
              ? "#2ECC71"
              : "#9B59B6"
          }
        />
      </View>

      {/* Content */}
      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <Text style={styles.notificationTitle}>
            {notification.title}
          </Text>

          <Text style={styles.notificationTime}>
            {notification.time}
          </Text>
        </View>

        <Text style={styles.notificationMessage}>
          {notification.message}
        </Text>

        {/* Track Partner */}
        {notification.button && (
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>
              {notification.button}
            </Text>
          </TouchableOpacity>
        )}

        {/* Rating Stars */}
        {isRating && (
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star-outline"
                size={14}
                color="#C8D0D8"
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* Header */

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F4",
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F5F7",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginLeft: 10,
  },

  markRead: {
    fontSize: 8,
    fontWeight: "800",
    color: BLUE,
  },

  /* Container */

  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },

  /* Date */

  dateTitle: {
    fontSize: 8,
    fontWeight: "800",
    color: "#7A828A",
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  yesterday: {
    marginTop: 6,
  },

  /* Notification Card */

  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,

    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },

  partnerCard: {
    borderLeftColor: BLUE,
  },

  offerCard: {
    borderLeftColor: "#F39C12",
  },

  /* Icon */

  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F2F5F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  partnerIcon: {
    backgroundColor: "#EAF3F8",
  },

  offerIcon: {
    backgroundColor: "#FFF4E6",
  },

  bookingIcon: {
    backgroundColor: "#EAF8F0",
  },

  ratingIcon: {
    backgroundColor: "#F4EDFA",
  },

  /* Content */

  notificationContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  notificationTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#20252B",
  },

  notificationTime: {
    fontSize: 7,
    color: "#9AA2AA",
    marginLeft: 8,
  },

  notificationMessage: {
    fontSize: 8,
    lineHeight: 12,
    color: "#8A929A",
    paddingRight: 4,
  },

  /* Track Button */

  trackButton: {
    alignSelf: "flex-start",
    backgroundColor: BLUE,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 7,
  },

  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "800",
  },

  /* Rating */

  starsRow: {
    flexDirection: "row",
    marginTop: 7,
    gap: 2,
  },

  /* Modal Styles */
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F4",
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F5F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BLUE,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  manageTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  manageSubtitle: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 20,
  },
  settingsCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111",
  },
  settingDesc: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BLUE,
    borderStyle: "dashed",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});