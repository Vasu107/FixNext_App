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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useProviders } from '@/context/ProvidersContext';

const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#2B719E';
const BG_LIGHT = '#F8FAFC';

const CATEGORY_DATA: Record<string, {
  name: string;
  tagline: string;
  description: string;
  badge: string;
  image: string;
  bgColor: [string, string];
}> = {
  '1': {
    name: 'Cleaning',
    tagline: 'Sparkling clean homes made easy.',
    description: 'Choose from our range of specialized cleaning services. From deep bathroom cleaning to window dusting, our verified professionals ensure your home stays hygienic and fresh.',
    badge: 'PREMIUM HOME CARE',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop',
    bgColor: ['#2B719E', '#1A4A6B'],
  },
  '2': {
    name: 'Plumbing',
    tagline: 'Expert plumbing at your doorstep.',
    description: 'Professional plumbers to handle all your pipe, leak, and drainage issues quickly and efficiently. Fully equipped with the right tools.',
    badge: 'EXPERT PLUMBERS',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
    bgColor: ['#1D6E6E', '#0E4545'],
  },
  '3': {
    name: 'AC Repair',
    tagline: 'Cool air, right on time.',
    description: 'Keep your AC running at peak performance with our certified technicians. We handle servicing, gas refilling, and full repairs.',
    badge: 'CERTIFIED TECHNICIANS',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
    bgColor: ['#1A5276', '#0D2E46'],
  },
};


export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showFilter, setShowFilter] = useState(false);
  const { providers } = useProviders();

  const catId = String(id ?? '1');
  const category = CATEGORY_DATA[catId] ?? CATEGORY_DATA['1'];

  const categoryProviders = providers.filter(p => p.catId === catId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: category.image }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.1)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{category.badge}</Text>
          </View>
          <Text style={styles.heroTitle}>{category.tagline}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{category.description}</Text>

        {/* Providers header */}
        <View style={styles.providersHeaderRow}>
          <Text style={styles.providersCount}>
            Showing <Text style={{ color: PRIMARY_BLUE, fontWeight: '800' }}>{categoryProviders.length}</Text> professionals
          </Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Ionicons name="options-outline" size={16} color={PRIMARY_BLUE} />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Provider Cards */}
        {categoryProviders.map((provider) => (
          <View key={provider.id} style={styles.providerCard}>
            {/* Provider Image */}
            <View style={styles.providerImageWrapper}>
              <Image
                source={{ uri: provider.image }}
                style={styles.providerImage}
                resizeMode="cover"
              />
              {provider.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFF" />
                  <Text style={styles.verifiedText}>Verified Professional</Text>
                </View>
              )}
            </View>

            {/* Provider Info */}
            <View style={styles.providerInfo}>
              {/* Name & Rating */}
              <View style={styles.nameRatingRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{provider.rating}</Text>
                  <Text style={styles.reviewsText}>({provider.reviews})</Text>
                </View>
              </View>

              {/* Specialty */}
              <View style={styles.specialtyRow}>
                <MaterialCommunityIcons name="tag-outline" size={14} color="#7A828A" />
                <Text style={styles.specialtyText}>{provider.specialty}</Text>
              </View>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Experience</Text>
                  <Text style={styles.statValue}>{provider.experience}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Starting at</Text>
                  <Text style={[styles.statValue, { color: PRIMARY_BLUE }]}>{provider.startingAt}</Text>
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity style={styles.viewProfileBtn} onPress={() => router.push(`/provider-profile/${provider.id}`)}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
  },
  providersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  providersCount: {
    fontSize: 14,
    color: '#555',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  filterText: {
    fontSize: 13,
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  providerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  providerImageWrapper: {
    height: 180,
    position: 'relative',
  },
  providerImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  providerInfo: {
    padding: 16,
  },
  nameRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  providerName: {
    fontSize: 17,
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
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  reviewsText: {
    fontSize: 12,
    color: '#7A828A',
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  specialtyText: {
    fontSize: 13,
    color: '#7A828A',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#7A828A',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5EBF0',
  },
  viewProfileBtn: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
