import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";

const BLUE = "#2B719E";

export default function CartScreen() {
  const { items, updateQty } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color="#C0C8D2" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add services to get started</Text>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={styles.card}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                ) : (
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon as any} size={24} color={BLUE} />
                  </View>
                )}
                <View style={styles.info}>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Ionicons name="remove" size={16} color={BLUE} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Ionicons name="add" size={16} color={BLUE} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount (10%)</Text>
                <Text style={[styles.summaryValue, { color: "#1A6B4A" }]}>
                  -₹{discount}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push("/checkout")}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: { fontSize: 24, fontWeight: "800", color: "#111" },
  itemCount: { fontSize: 14, color: "#7A828A", fontWeight: "600" },
  container: { paddingHorizontal: 20 },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#111", marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: "#7A828A", marginTop: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
  },
  info: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 2 },
  description: { fontSize: 12, color: "#7A828A", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "800", color: BLUE },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 14, fontWeight: "700", color: "#111", marginHorizontal: 10 },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: "#7A828A" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#111" },
  divider: { height: 1, backgroundColor: "#EFEFEF", marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: "800", color: "#111" },
  totalValue: { fontSize: 18, fontWeight: "800", color: BLUE },
  checkoutBtn: {
    flexDirection: "row",
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});
