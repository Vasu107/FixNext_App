import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProviders } from '@/context/ProvidersContext';

const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#2B719E';
const BG_LIGHT = '#F8FAFC';



export default function ProviderProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const { providers } = useProviders();

  const provider = providers.find((p) => p.id === String(id)) ?? providers[0];

  const serviceCategories = provider?.serviceCategories ?? [];
  const reviewsList = provider?.reviews_list ?? [];


  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < Math.floor(count) ? 'star' : i < count ? 'star-half' : 'star-outline'}
        size={14}
        color="#F59E0B"
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover / Hero Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: provider.coverImage }} style={styles.coverImage} resizeMode="cover" />
          <View style={styles.coverOverlay} />

          {/* Back & Share buttons */}
          <View style={styles.coverActions}>
            <TouchableOpacity style={styles.coverBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#111" />
            </TouchableOpacity>
            <Text style={styles.coverTitle}>Provider Profile</Text>
            <TouchableOpacity style={styles.coverBtn}>
              <Ionicons name="share-social-outline" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: provider.image }} style={styles.avatar} resizeMode="cover" />
            {provider.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#FFF" />
                <Text style={styles.verifiedText}>Verified Professional</Text>
              </View>
            )}
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameBadgeRow}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewCountText}>({provider.reviews})</Text>
            </View>
          </View>
          <Text style={styles.providerTitle}>{provider.title}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.completedJobs}+</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: PRIMARY_BLUE }]}>{provider.startingAt}</Text>
              <Text style={styles.statLabel}>Starting at</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'about' ? (
          <View style={styles.section}>
            {/* About */}
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{provider.about}</Text>

            {/* Service Categories */}
            <Text style={styles.sectionTitle}>Service Categories</Text>
            <View style={styles.servicesGrid}>
              {serviceCategories.map((svc: any, i: number) => (
                <View key={i} style={styles.serviceChip}>
                  <MaterialCommunityIcons name={svc.icon as any} size={18} color={PRIMARY_BLUE} />
                  <Text style={styles.serviceChipText}>{svc.label}</Text>
                </View>
              ))}
            </View>

            {/* Preview recent review */}
            <View style={styles.reviewsPreviewRow}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
              <TouchableOpacity onPress={() => setActiveTab('reviews')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {reviewsList.slice(0, 1).map((rev: any) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: rev.avatar }} style={styles.reviewAvatar} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewerName}>{rev.name}</Text>
                    <View style={styles.starsRow}>{renderStars(rev.rating)}</View>
                  </View>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                <Text style={styles.reviewText}>{rev.text}</Text>
                <Text style={styles.reviewPrice}>Starting at {rev.startingAt}</Text>
              </View>
            ))}
            {reviewsList.length === 0 && (
              <Text style={{ color: '#888', fontStyle: 'italic', marginTop: 10 }}>No reviews yet.</Text>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {reviewsList.length === 0 && (
              <Text style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>No reviews yet.</Text>
            )}
            {reviewsList.map((rev: any) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: rev.avatar }} style={styles.reviewAvatar} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewerName}>{rev.name}</Text>
                    <View style={styles.starsRow}>{renderStars(rev.rating)}</View>
                  </View>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                <Text style={styles.reviewText}>{rev.text}</Text>
                <Text style={styles.reviewPrice}>Starting at {rev.startingAt}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={[styles.bookingFooter, { paddingBottom: 16 + insets.bottom }]}>
        <View>
          <Text style={styles.footerPriceLabel}>Starting at</Text>
          <Text style={styles.footerPrice}>{provider.startingAt}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push(`/book-service/${id ?? '1'}` as any)}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },

  /* Cover */
  coverContainer: {
    height: 220,
    position: 'relative',
  },
  coverImage: {
    ...StyleSheet.absoluteFill,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  coverActions: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#FFF',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },

  /* Profile Info */
  profileInfo: {
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF9EC',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  reviewCountText: {
    fontSize: 12,
    color: '#7A828A',
  },
  providerTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#7A828A',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0E7EF',
  },

  /* Tabs */
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_BLUE,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A828A',
  },
  activeTabText: {
    color: PRIMARY_BLUE,
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
    marginTop: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF4FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  serviceChipText: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Review Cards */
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: '#AAB2BC',
  },
  reviewText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reviewPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },

  /* Booking Footer */
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#7A828A',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  bookBtn: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
