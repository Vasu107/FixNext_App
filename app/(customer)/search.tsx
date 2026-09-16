import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const BLUE = "#2B719E";

const categories = [
  { icon: "broom", label: "Cleaning" },
  { icon: "water-pump", label: "Plumbing" },
  { icon: "air-conditioner", label: "AC Repair" },
  { icon: "lightning-bolt", label: "Electrician" },
  { icon: "sofa", label: "Carpentry" },
  { icon: "spray", label: "Pest Control" },
];

const popular = [
  { name: "Deep Cleaning", price: "₹599", rating: "4.9" },
  { name: "Pipe Fixing", price: "₹349", rating: "4.8" },
  { name: "AC Service", price: "₹499", rating: "4.7" },
  { name: "Fan Installation", price: "₹199", rating: "4.6" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8A92A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            placeholderTextColor="#8A92A6"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#8A92A6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c, i) => (
            <TouchableOpacity key={i} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <MaterialCommunityIcons
                  name={c.icon as any}
                  size={26}
                  color={BLUE}
                />
              </View>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        {popular.map((item, i) => (
          <View key={i} style={styles.popularRow}>
            <View style={styles.popularIcon}>
              <Ionicons name="star" size={20} color={BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.popularName}>{item.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F5A623" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <Text style={styles.popularPrice}>{item.price}</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  title: { fontSize: 24, fontWeight: "800", color: "#111", marginBottom: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#111" },
  container: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 14,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryCard: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 12, fontWeight: "700", color: "#111" },
  popularRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EBF3F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  popularName: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, color: "#7A828A", marginLeft: 4 },
  popularPrice: { fontSize: 14, fontWeight: "800", color: "#111", marginRight: 10 },
  addBtn: {
    backgroundColor: BLUE,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
});
