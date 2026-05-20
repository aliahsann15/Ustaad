import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/useAuthStore';

// ── Types ──────────────────────────────────────────────────────
type BookingStatus = 'completed' | 'cancelled' | 'in_progress';

interface Booking {
  id: string;
  service: string;
  date: string;
  status: BookingStatus;
  provider: string;
  price: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
}

// ── Mock Data ──────────────────────────────────────────────────
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    service: 'AC Servicing',
    date: 'Oct 24, 2023 • 10:30 AM',
    status: 'completed',
    provider: 'Ali Electrician',
    price: 'Rs. 2,500',
    icon: 'ac-unit',
    iconColor: '#855300',
    iconBg: 'rgba(245,158,11,0.10)',
  },
  {
    id: '2',
    service: 'Pipe Leakage Repair',
    date: 'Oct 20, 2023 • 04:15 PM',
    status: 'cancelled',
    provider: 'Zeeshan Plumber',
    price: 'Rs. 1,200',
    icon: 'plumbing',
    iconColor: '#515f74',
    iconBg: 'rgba(164,178,201,0.15)',
  },
  {
    id: '3',
    service: 'Deep Home Cleaning',
    date: 'Oct 15, 2023 • 09:00 AM',
    status: 'completed',
    provider: 'CleanSquad Pro',
    price: 'Rs. 4,800',
    icon: 'cleaning-services',
    iconColor: '#855300',
    iconBg: 'rgba(245,158,11,0.10)',
  },
  {
    id: '4',
    service: 'Electrical Wiring',
    date: 'Oct 10, 2023 • 02:00 PM',
    status: 'in_progress',
    provider: 'Hamid Electric',
    price: 'Rs. 3,200',
    icon: 'electrical-services',
    iconColor: '#10B981',
    iconBg: 'rgba(16,185,129,0.10)',
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'in_progress', label: 'In Progress' },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  in_progress: { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
};

// ── Booking Card Component ────────────────────────────────────
function BookingCard({ item, onPress }: { item: Booking; onPress: () => void }) {
  const status = STATUS_CONFIG[item.status];
  const isCancelled = item.status === 'cancelled';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top Row: Icon + Title/Date + Status Badge */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardLeft}>
          {/* Service Icon */}
          <View style={[styles.serviceIconBg, { backgroundColor: item.iconBg }]}>
            <MaterialIcons name={item.icon} size={24} color={item.iconColor} />
          </View>
          {/* Title & Date */}
          <View style={styles.cardTitleBlock}>
            <Typography style={styles.cardServiceName}>{item.service}</Typography>
            <Typography style={styles.cardDate}>{item.date}</Typography>
          </View>
        </View>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Typography style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Typography>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Bottom Row: Provider + Price */}
      <View style={styles.cardBottomRow}>
        <View style={styles.providerRow}>
          <View style={styles.providerAvatar}>
            <MaterialIcons name="person" size={16} color="#534434" />
          </View>
          <Typography style={styles.providerName}>{item.provider}</Typography>
        </View>
        <Typography
          style={[styles.cardPrice, isCancelled && styles.cardPriceCancelled]}
        >
          {item.price}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function ActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredBookings =
    activeFilter === 'all'
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === activeFilter);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="History" />

        {/* Unauthenticated Empty State */}
        <View style={styles.unauthContent}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="history" size={48} color="#d8c3ad" />
          </View>
          <Typography style={styles.emptyTitle}>Sign In to View History</Typography>
          <Typography style={styles.emptyBody}>
            Please log in to check your previous service bookings, tracking status, and ratings.
          </Typography>
          <Button
            title="Sign In"
            variant="primary"
            icon="LogIn"
            onPress={() => router.push('/auth/login')}
            style={styles.signInButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="History" />

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: theme.spacing.md, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Filter Chips ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.75}
              >
                <Typography
                  style={[styles.filterChipText, isActive && styles.filterChipTextActive]}
                >
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── Booking Cards ─── */}
        {filteredBookings.length > 0 ? (
          <View style={styles.cardList}>
            {filteredBookings.map((item) => (
              <BookingCard
                key={item.id}
                item={item}
                onPress={() => {}}
              />
            ))}
          </View>
        ) : (
          /* ─── Empty State ─── */
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="history" size={48} color="#d8c3ad" />
            </View>
            <Typography style={styles.emptyTitle}>No History Found</Typography>
            <Typography style={styles.emptyBody}>
              {'You haven\'t requested any services yet.'}
            </Typography>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() => router.push('/')}
              activeOpacity={0.85}
            >
              <Typography style={styles.bookNowText}>Book Now</Typography>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: 16,
  },

  // ── Filter Chips ──
  filterScroll: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1e',
    letterSpacing: 0.1,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // ── Card List ──
  cardList: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  serviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardServiceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#191c1e',
    lineHeight: 24,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#867461',
    lineHeight: 18,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginLeft: 8,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eceef0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#534434',
    letterSpacing: 0.1,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191c1e',
    lineHeight: 24,
  },
  cardPriceCancelled: {
    color: '#867461',
    textDecorationLine: 'line-through',
  },

  // ── Empty State ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eceef0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#191c1e',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    fontWeight: '400',
    color: '#534434',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  bookNowBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 9999,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#613b00',
    letterSpacing: 0.1,
  },

  // ── Unauthenticated State ──
  unauthContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  signInButton: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
  },
});
