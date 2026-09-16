import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationsContext";

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#2B719E";
const BG_LIGHT = "#F8FAFC";

const POPULAR_SERVICES = [
  {
    id: "pop_1",
    service: "Bathroom Cleaning",
    description: "Deep cleaning for your bathroom",
    price: 299,
    icon: "water",
    rating: "4.9",
    booked: "1.2m+ booked",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&auto=format&fit=crop",
  },
  {
    id: "pop_2",
    service: "Kitchen Cleaning",
    description: "Degreasing and deep clean for your kitchen",
    price: 499,
    icon: "restaurant",
    rating: "4.9",
    booked: "800k+ booked",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&auto=format&fit=crop",
  },
  {
    id: "pop_3",
    service: "Sofa Cleaning",
    description: "Deep cleaning for your sofa",
    price: 399,
    icon: "bed",
    rating: "4.8",
    booked: "650k+ booked",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop",
  },
  {
    id: "pop_4",
    service: "AC Service",
    description: "AC cleaning and servicing",
    price: 599,
    icon: "snow",
    rating: "4.7",
    booked: "500k+ booked",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&auto=format&fit=crop",
  },
  {
    id: "pop_5",
    service: "Plumbing",
    description: "Quick plumbing repair at home",
    price: 249,
    icon: "water",
    rating: "4.8",
    booked: "420k+ booked",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop",
  },
  {
    id: "pop_6",
    service: "Electrician",
    description: "Electrical repair and installation",
    price: 199,
    icon: "flash",
    rating: "4.8",
    booked: "350k+ booked",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  { name: "Cleaning", icon: "broom", price: "From ₹399" },
  { name: "Plumbing", icon: "water-pump", price: "From ₹249" },
  { name: "AC Repair", icon: "air-conditioner", price: "From ₹399" },
  { name: "Electrician", icon: "flash", price: "From ₹199" },
  { name: "Painting", icon: "format-paint", price: "From ₹999" },
  { name: "Pest Control", icon: "bug", price: "From ₹499" },
  { name: "Carpentry", icon: "hammer-wrench", price: "From ₹299" },
  { name: "Appliances", icon: "washing-machine", price: "From ₹349" },
  { name: "Saloon", icon: "content-cut", price: "From ₹499" },
  { name: "Massage", icon: "spa", price: "From ₹599" },
];

const BANNERS = [
  {
    title: "Need help right now?",
    subtitle: "Get a professional at your doorstep quickly.",
    badge: "AVAILABLE NOW",
    buttonText: "Book Instant Help",
    icon1: "calendar-outline", text1: "Schedule later",
    icon2: "repeat", text2: "Recurring service",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Quality service at home",
    subtitle: "Verified professionals are ready to solve your problems.",
    badge: "TRUSTED PROFESSIONALS",
    buttonText: "Find a Professional",
    icon1: "shield-checkmark-outline", text1: "Verified experts",
    icon2: "star-outline", text2: "Top rated",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Save on your next service",
    subtitle: "Get great service at an affordable price with FixNext.",
    badge: "SPECIAL OFFER",
    buttonText: "Explore Services",
    icon1: "pricetag-outline", text1: "Best prices",
    icon2: "wallet-outline", text2: "Easy payment",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Your home, our priority",
    subtitle: "From cleaning to repairs, get everything done with FixNext.",
    badge: "HOME CARE",
    buttonText: "Book a Service",
    icon1: "home-outline", text1: "Home services",
    icon2: "time-outline", text2: "On-time service",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem, updateQty, getQty } = useCart();
  const { unreadCount } = useNotifications();
  const bannerScrollRef = useRef<ScrollView>(null);
  const bannerIndexRef = useRef(0);

  const BANNER_WIDTH = width - 40;
  const BANNER_GAP = 12;
  const BANNER_INTERVAL = BANNER_WIDTH + BANNER_GAP;

  const RENDER_BANNERS = [...BANNERS, BANNERS[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = bannerIndexRef.current + 1;

      bannerScrollRef.current?.scrollTo({
        x: nextIndex * BANNER_INTERVAL,
        animated: true,
      });

      if (nextIndex === RENDER_BANNERS.length - 1) {
        // Scrolled to the clone. Secretly snap back to 0 after animation finishes.
        setTimeout(() => {
          bannerScrollRef.current?.scrollTo({
            x: 0,
            animated: false,
          });
          bannerIndexRef.current = 0;
        }, 800);
      } else {
        bannerIndexRef.current = nextIndex;
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [BANNER_INTERVAL]);

  const handleBannerScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    let newIndex = Math.round(offsetX / BANNER_INTERVAL);

    if (newIndex === RENDER_BANNERS.length - 1) {
      bannerScrollRef.current?.scrollTo({
        x: 0,
        animated: false,
      });
      newIndex = 0;
    }
    bannerIndexRef.current = newIndex;
  };
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.staticHeaderContainer}>
        {/* Header (Location, Notification, Profile) */}
        <View style={styles.headerRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color={PRIMARY_BLUE} />
            <Text style={styles.locationText}>Home • Kanpur</Text>
            <Ionicons name="chevron-down" size={16} color={PRIMARY_BLUE} />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={24} color="#111" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.profilePic}>
              <Ionicons name="person" size={16} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8A92A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you need help with?"
            placeholderTextColor="#8A92A6"
          />
          <Ionicons name="mic" size={20} color={PRIMARY_BLUE} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={BANNER_INTERVAL}
          decelerationRate="fast"
          onMomentumScrollEnd={handleBannerScrollEnd}
          contentContainerStyle={styles.bannerScrollContent}
        >
          {RENDER_BANNERS.map((banner, index) => (
            <View key={index} style={[styles.bannerContainer, { overflow: "hidden" }]}>
              <Image
                source={{ uri: banner.image }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[PRIMARY_BLUE, 'rgba(43, 113, 158, 0.8)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.availableRow}>
                <View style={styles.greenDot} />
                <Text style={styles.availableText}>{banner.badge}</Text>
              </View>

              <Text style={styles.bannerTitle}>{banner.title}</Text>

              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>

              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>{banner.buttonText}</Text>
              </TouchableOpacity>

              <View style={styles.bannerFooter}>
                <View style={styles.bannerFooterItem}>
                  <Ionicons name={banner.icon1 as any} size={14} color="#FFF" />
                  <Text style={styles.bannerFooterText}>{banner.text1}</Text>
                </View>

                <View style={styles.bannerFooterItem}>
                  <Ionicons name={banner.icon2 as any} size={14} color="#FFF" />
                  <Text style={styles.bannerFooterText}>{banner.text2}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.reduce((result: any[], value, index, array) => {
            if (index % 2 === 0) result.push(array.slice(index, index + 2));
            return result;
          }, []).map((col, i) => (
            <View key={i} style={styles.categoryColumn}>
              {col.map((item: any, j: number) => (
                <TouchableOpacity
                  key={j}
                  style={styles.categoryCard}
                  onPress={() => router.push('/category/1')}
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color={PRIMARY_BLUE}
                    />
                  </View>
                  <View style={styles.catTextRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.categoryPrice}>{item.price}</Text>
                    </View>
                    <View style={styles.arrowIcon}>
                      <Feather name="arrow-up-right" size={14} color="#111" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Popular near you */}
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
          Popular near you
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularScroll}
        >
          {POPULAR_SERVICES.map((item) => {
            const qty = getQty(item.id);
            return (
              <View key={item.id} style={styles.popularCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.popularImage}
                  resizeMode="cover"
                />
                <View style={styles.popularContent}>
                  <View style={styles.popularTopRow}>
                    <Text style={styles.popularTitle}>{item.service}</Text>
                    <View style={styles.ratingBox}>
                      <Ionicons name="star" size={12} color="#F5A623" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.popularSubtitle} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <View style={styles.tagPill}>
                    <Text style={styles.tagText}>{item.booked}</Text>
                  </View>
                  <View style={styles.popularBottomRow}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                    {qty === 0 ? (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                          addItem({
                            id: item.id,
                            service: item.service,
                            description: item.description,
                            price: item.price,
                            icon: item.icon,
                            image: item.image,
                          })
                        }
                      >
                        <Text style={styles.addButtonText}>+ Add</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qtyControls}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQty(item.id, -1)}
                        >
                          <Ionicons name="remove" size={14} color={PRIMARY_BLUE} />
                        </TouchableOpacity>
                        <Text style={styles.qtyNumber}>{qty}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQty(item.id, 1)}
                        >
                          <Ionicons name="add" size={14} color={PRIMARY_BLUE} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Need it done now? */}
        <View style={styles.urgentContainer}>
          <View style={styles.urgentHeader}>
            <View>
              <Text style={styles.urgentTitle}>Need it done now?</Text>
              <Text style={styles.urgentSubtitle}>Available in 15-30 mins</Text>
            </View>
            <Ionicons name="flash" size={24} color="#E74C3C" />
          </View>
          <View style={styles.urgentRow}>
            {[
              {
                id: "urgent_1",
                service: "Instant Cleaning",
                description: "Quick home clean in 30 min",
                price: 349,
                icon: "sparkles-outline",
              },
              {
                id: "urgent_2",
                service: "Kitchen Help",
                description: "Dishes, counters & more",
                price: 249,
                icon: "restaurant-outline",
              },
            ].map((item) => {
              const inCart = getQty(item.id) > 0;
              return (
                <View key={item.id} style={styles.urgentCard}>
                  <Text style={styles.urgentCardTitle}>{item.service}</Text>
                  <Text style={styles.urgentCardPrice}>₹{item.price}</Text>
                  <TouchableOpacity
                    style={[styles.bookNowBtn, inCart && styles.bookNowBtnActive]}
                    onPress={() => {
                      if (!inCart) {
                        addItem({
                          id: item.id,
                          service: item.service,
                          description: item.description,
                          price: item.price,
                          icon: item.icon,
                        });
                      }
                      router.push("/checkout");
                    }}
                  >
                    <Ionicons
                      name={inCart ? "cart" : "flash"}
                      size={13}
                      color="#FFF"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.bookNowText}>
                      {inCart ? "Go to Checkout" : "Book Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Spacer for bottom tab */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  staticHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: BG_LIGHT,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginHorizontal: 6,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBtn: {
    marginRight: 16,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: BG_LIGHT,
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C4C4C4",
    alignItems: "center",
    justifyContent: "center",
  },
  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111",
  },
  /* -----------------------------------------
     BANNER CAROUSEL
  ------------------------------------------ */

  bannerScrollContent: {
    paddingRight: 20,
  },

  bannerContainer: {
    width: width - 40,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
  },

  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2ECC71",
    marginRight: 6,
  },

  availableText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  bannerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },

  bannerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  bannerButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
    fontWeight: "700",
  },

  bannerFooter: {
    flexDirection: "row",
    alignItems: "center",
  },

  bannerFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  bannerFooterText: {
    color: "#FFFFFF",
    fontSize: 11,
    marginLeft: 4,
  },
  /* Categories */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  seeAllText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: "600",
  },
  categoriesScroll: {
    paddingRight: 20,
    marginBottom: 24,
  },
  categoryColumn: {
    marginRight: 12,
  },
  categoryCard: {
    width: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F2F7F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  catTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  categoryPrice: {
    fontSize: 11,
    color: "#7A828A",
  },
  arrowIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  /* Popular */
  popularScroll: {
    paddingBottom: 24,
    paddingRight: 20, // Add padding at the end of the scroll
  },
  popularCard: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  popularImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  popularImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 14,
  },
  popularContent: {
    flex: 1,
  },
  popularTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    marginLeft: 4,
  },
  popularSubtitle: {
    fontSize: 12,
    color: "#7A828A",
    marginTop: 2,
    marginBottom: 6,
  },
  tagPill: {
    backgroundColor: "#EBF3F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
    color: PRIMARY_BLUE,
  },
  popularBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
  },
  addButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF3F8",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  qtyNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: PRIMARY_BLUE,
    marginHorizontal: 6,
    minWidth: 14,
    textAlign: "center",
  },
  /* Urgent */
  urgentContainer: {
    backgroundColor: "#FDF4F4",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  urgentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  urgentTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#7F2723",
  },
  urgentSubtitle: {
    fontSize: 13,
    color: "#C0392B",
    marginTop: 4,
  },
  urgentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  urgentCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  urgentCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  urgentCardPrice: {
    fontSize: 11,
    color: "#7A828A",
    marginBottom: 14,
  },
  bookNowBtn: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowBtnActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  bookNowText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
