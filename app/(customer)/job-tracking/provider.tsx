import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useBookings } from "@/context/BookingsContext";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");
const BLUE = "#2B719E";
const GREEN = "#18B978";

// Simulated route points for demo animation
const ROUTE_POINTS = [
  { x: 0.15, y: 0.78 },
  { x: 0.25, y: 0.65 },
  { x: 0.35, y: 0.60 },
  { x: 0.48, y: 0.52 },
  { x: 0.55, y: 0.44 },
  { x: 0.62, y: 0.38 },
  { x: 0.70, y: 0.30 },
];

const MAP_HEIGHT = height * 0.52;

export default function ProviderTrackingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { bookings, setProviderEnRoute, setProviderArrived } = useBookings();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const booking = bookings.find((b) => b.bookingId === bookingId);

  const markerX = useRef(new Animated.Value(ROUTE_POINTS[0].x * width)).current;
  const markerY = useRef(new Animated.Value(ROUTE_POINTS[0].y * MAP_HEIGHT)).current;
  const markerScale = useRef(new Animated.Value(1)).current;

  const [eta, setEta] = useState(8);
  const [arrived, setArrived] = useState(false);

  // start pulsing marker
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(markerScale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(markerScale, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // mark provider as en route when screen loads
  useEffect(() => {
    if (bookingId) setProviderEnRoute(bookingId);
  }, [bookingId]);

  // animate marker along route
  useEffect(() => {
    if (arrived) return;
    const stepDuration = 3000;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= ROUTE_POINTS.length) { clearInterval(interval); return; }
      const pt = ROUTE_POINTS[step];
      Animated.timing(markerX, { toValue: pt.x * width, duration: stepDuration - 200, useNativeDriver: false }).start();
      Animated.timing(markerY, { toValue: pt.y * MAP_HEIGHT, duration: stepDuration - 200, useNativeDriver: false }).start();
      setEta((prev) => Math.max(0, prev - 1));
    }, stepDuration);
    return () => clearInterval(interval);
  }, [arrived]);

  const handleArrived = () => {
    setArrived(true);
    if (bookingId) setProviderArrived(bookingId);
    router.replace(`/job-tracking/otp-entry?bookingId=${bookingId}` as any);
  };

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>Booking not found</Text>
      </View>
    );
  }

  const primaryService = booking.services[0];
  const arrivalTime = new Date(Date.now() + eta * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* MAP AREA */}
      <View style={[styles.mapArea, { height: MAP_HEIGHT }]}>
        <SimulatedMap />
        <RoutePolyline />
        {/* Customer pin */}
        <View style={[styles.customerPin, {
          left: ROUTE_POINTS[ROUTE_POINTS.length - 1].x * width - 16,
          top: ROUTE_POINTS[ROUTE_POINTS.length - 1].y * MAP_HEIGHT - 36,
        }]}>
          <View style={styles.customerPinCircle}>
            <Ionicons name="home" size={14} color="#FFF" />
          </View>
          <View style={styles.customerPinTail} />
        </View>
        {/* Provider animated marker */}
        <Animated.View style={[styles.providerMarkerWrap, {
          left: Animated.subtract(markerX, 22),
          top: Animated.subtract(markerY, 22),
        }]}>
          <Animated.View style={[styles.providerMarkerPulse, { transform: [{ scale: markerScale }] }]} />
          <View style={styles.providerMarker}>
            <Ionicons name="bicycle" size={18} color="#FFF" />
          </View>
        </Animated.View>
        {/* Status badge */}
        <View style={[styles.statusBadge, { top: insets.top + 12, left: width / 2 - 80 }]}>
          <View style={styles.greenDot} />
          <Text style={styles.statusBadgeText}>Partner is on the way</Text>
        </View>
        {/* Back button */}
        <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12, left: 16 }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET */}
      <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent} bounces={false}>
        <View style={styles.etaRow}>
          <View>
            <Text style={styles.etaMins}>{eta} mins</Text>
            <Text style={styles.etaSub}>Arrival at {arrivalTime}</Text>
          </View>
          <View style={styles.liveTrackingBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTrackingText}>LIVE TRACKING</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>{booking.customerName.charAt(0)}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{booking.customerName}</Text>
            <Text style={styles.customerSub}>{primaryService?.service}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call" size={20} color={BLUE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-ellipses" size={20} color={BLUE} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.timeline}>
          <TimelineItem icon="person" color={GREEN} title="Partner Assigned" subtitle="Partner is reaching customer location" done={true} />
          <View style={styles.timelineLine} />
          <TimelineItem icon="build" color="#C0C8D2" title="Service Start" subtitle={"Estimated at " + arrivalTime} done={false} />
        </View>
        <View style={styles.divider} />
        <View style={styles.safetyBadge}>
          <Ionicons name="shield-checkmark" size={22} color={GREEN} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.safetyTitle}>Vaccinated & Safety Verified</Text>
            <Text style={styles.safetySub}>Partner follows all safety protocols and is background checked.</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.arrivedBtn} onPress={handleArrived} activeOpacity={0.85}>
          <Ionicons name="location" size={20} color="#FFF" />
          <Text style={styles.arrivedBtnText}> I have Arrived at Customer Location</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function SimulatedMap() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#E8F0E9" }]} />
      {[0.15, 0.30, 0.45, 0.60, 0.75, 0.90].map((p, i) => (
        <View key={"h" + i} style={[styles.gridLine, { top: p * MAP_HEIGHT, left: 0, right: 0, height: 1 }]} />
      ))}
      {[0.1, 0.25, 0.40, 0.55, 0.70, 0.85].map((p, i) => (
        <View key={"v" + i} style={[styles.gridLine, { left: p * width, top: 0, bottom: 0, width: 1 }]} />
      ))}
      <View style={[styles.road, { top: MAP_HEIGHT * 0.6, left: 0, right: 0, height: 8 }]} />
      <View style={[styles.road, { left: width * 0.55, top: 0, bottom: 0, width: 8 }]} />
      <View style={[styles.park, { top: MAP_HEIGHT * 0.05, left: width * 0.05, width: 60, height: 50 }]} />
      <View style={[styles.park, { top: MAP_HEIGHT * 0.45, left: width * 0.72, width: 70, height: 55 }]} />
      {([[0.12, 0.12], [0.30, 0.12], [0.12, 0.40], [0.72, 0.12], [0.12, 0.70]] as [number, number][]).map(([x, y], i) => (
        <View key={"b" + i} style={[styles.building, { left: x * width, top: y * MAP_HEIGHT }]} />
      ))}
    </View>
  );
}

function RoutePolyline() {
  return (
    <>
      {ROUTE_POINTS.slice(0, -1).map((pt, i) => {
        const next = ROUTE_POINTS[i + 1];
        const dx = (next.x - pt.x) * width;
        const dy = (next.y - pt.y) * MAP_HEIGHT;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View key={i} style={{
            position: "absolute",
            left: pt.x * width,
            top: pt.y * MAP_HEIGHT - 2,
            width: len,
            height: 4,
            backgroundColor: BLUE,
            borderRadius: 2,
            opacity: 0.6,
            transform: [{ rotate: angle + "deg" }],
          }} />
        );
      })}
    </>
  );
}

function TimelineItem({ icon, color, title, subtitle, done }: { icon: any; color: string; title: string; subtitle: string; done: boolean }) {
  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineDot, { backgroundColor: done ? color : "#E4ECF2" }]}>
        <Ionicons name={icon} size={12} color={done ? "#FFF" : "#C0C8D2"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F6F9FB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  mapArea: { overflow: "hidden", backgroundColor: "#E8F0E9" },
  gridLine: { position: "absolute", backgroundColor: "#D4E0D5" },
  road: { position: "absolute", backgroundColor: "#C8D0C8" },
  park: { position: "absolute", backgroundColor: "#B8D4B8", borderRadius: 4 },
  building: { position: "absolute", width: 44, height: 36, backgroundColor: "#D0D8DC", borderRadius: 4 },
  providerMarkerWrap: { position: "absolute", width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  providerMarkerPulse: { position: "absolute", width: 44, height: 44, borderRadius: 22, backgroundColor: BLUE + "30" },
  providerMarker: { width: 36, height: 36, borderRadius: 18, backgroundColor: BLUE, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFF", elevation: 5 },
  customerPin: { position: "absolute", alignItems: "center" },
  customerPinCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E74C3C", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFF" },
  customerPinTail: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#E74C3C" },
  statusBadge: { position: "absolute", flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, elevation: 4 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN, marginRight: 6 },
  statusBadgeText: { fontSize: 12, fontWeight: "700", color: "#111" },
  backBtn: { position: "absolute", width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", elevation: 4 },
  sheet: { flex: 1, backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  sheetContent: { padding: 24 },
  etaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  etaMins: { fontSize: 28, fontWeight: "800", color: "#111" },
  etaSub: { fontSize: 13, color: "#8A92A6", marginTop: 2 },
  liveTrackingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#EBF3F8", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN, marginRight: 6 },
  liveTrackingText: { fontSize: 11, fontWeight: "800", color: BLUE, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: "#F2F4F7", marginVertical: 16 },
  customerRow: { flexDirection: "row", alignItems: "center" },
  customerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: BLUE, alignItems: "center", justifyContent: "center", marginRight: 12 },
  customerAvatarText: { fontSize: 20, fontWeight: "800", color: "#FFF" },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: "700", color: "#111" },
  customerSub: { fontSize: 12, color: "#8A92A6", marginTop: 2 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EBF3F8", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  timeline: { marginVertical: 4 },
  timelineItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  timelineDot: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 12 },
  timelineLine: { width: 2, height: 16, backgroundColor: "#E4ECF2", marginLeft: 12, marginBottom: 4 },
  timelineTitle: { fontSize: 13, fontWeight: "700", color: "#111" },
  timelineSub: { fontSize: 12, color: "#8A92A6", marginTop: 2 },
  safetyBadge: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#F0FDF8", borderRadius: 12, padding: 14, marginBottom: 20 },
  safetyTitle: { fontSize: 13, fontWeight: "700", color: "#111" },
  safetySub: { fontSize: 11, color: "#8A92A6", marginTop: 3, lineHeight: 16 },
  arrivedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: GREEN, paddingVertical: 16, borderRadius: 14, elevation: 5 },
  arrivedBtnText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});
