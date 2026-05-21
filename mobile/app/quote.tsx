import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Page } from '../components/Page';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { createProviderCall } from '../lib/api';

export default function QuoteScreen() {
  const router = useRouter();
  const matchedProvider = useBookingStore((state) => state.matchedProvider);
  const otherProviders = useBookingStore((state) => state.otherProviders);
  const serviceRequestId = useBookingStore((state) => state.serviceRequestId);
  const setActiveCall = useBookingStore((state) => state.setActiveCall);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!matchedProvider?._id) {
      Alert.alert('Missing provider', 'Please select a provider recommendation first.');
      return;
    }

    if (!serviceRequestId) {
      Alert.alert('Missing request', 'The service request is not available yet. Please submit the request again.');
      return;
    }

    try {
      setLoading(true);
      const response = await createProviderCall(
        {
          providerId: matchedProvider._id,
          serviceRequestId,
          callOptions: {
            serviceType: matchedProvider.skills?.[0] || 'service',
          },
        },
        { token, userId },
      ) as any;

      setActiveCall({
        callId: response.call?._id || response.call?.id || response.callId || 'pending-call',
        status: response.call?.status || 'initiated',
        promptText: response.promptText,
        providerName: matchedProvider.name,
        providerPhoneNumber: matchedProvider.phoneNumber,
      });

      router.replace('/tracking');
    } catch (error) {
      Alert.alert('Call failed', (error as Error).message || 'Unable to start the provider call.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.replace('/(tabs)');
  };

  return (
    <Page style={styles.container} scroll>
      <Header title="Provider Recommendation" isSubScreen={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.recommendationHeader}>
          <Typography variant="caption" color={theme.colors.primary} weight="bold">Ustaad Expert Match</Typography>
          <Typography variant="h2" style={{ marginTop: theme.spacing.sm }}>Provider Recommendation</Typography>
        </View>

        <Card style={styles.providerCard}>
          <View style={styles.ribbon}><Typography variant="caption" weight="bold" color="#fff">BEST MATCH</Typography></View>
          <View style={styles.providerHeaderTop}>
            <Image source={matchedProvider?.avatar ? { uri: matchedProvider.avatar } : require('../assets/logomark.png')} style={styles.avatarBig} />
            <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
              <Typography variant="h2">{matchedProvider?.name || 'Asif Plumber'}</Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="star" size={16} color={theme.colors.primary} />
                <Typography variant="body" style={{ marginLeft: 8 }}>{matchedProvider?.rating ? `${matchedProvider.rating.toFixed(1)} (${matchedProvider.reviewCount || 0} reviews)` : '4.9 (124 reviews)'}</Typography>
              </View>
              <Typography variant="body" style={{ marginTop: theme.spacing.sm, color: theme.colors.textSecondary }}>{matchedProvider?.specializationLevel ? `${matchedProvider.specializationLevel} • ${matchedProvider.yearsExperience || 8} Years Exp.` : 'Master Plumber • 8 Years Exp.'}</Typography>
            </View>
          </View>

          <View style={styles.divider} />
          <Typography variant="body" style={{ fontStyle: 'italic', color: theme.colors.textSecondary }}>
            {matchedProvider?.tagline || '"Highly skilled professional known for punctual service and high-quality pipe installations."'}
          </Typography>
        </Card>

        {/* <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>Nearby Professional</Typography>
        <Card style={styles.bannerCard}>
          <Image source={require('../assets/logomark.png')} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.bannerBadge}><Typography variant="caption" color="#fff">2.4 km away</Typography></View>
        </Card> */}

        <Typography variant="h3" style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.sm }}>Alternative Providers</Typography>

        <View>
          {(otherProviders && otherProviders.length ? otherProviders : []).map((item, index) => (
            <Card style={styles.altCard} key={index}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item.avatar ? { uri: item.avatar } : require('../assets/logomark.png')} style={styles.altAvatar} />
                <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  <Typography variant="h3">{item.name}</Typography>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="star" size={14} color={theme.colors.primary} />
                    <Typography variant="body" style={{ marginLeft: 8 }}>{item.rating ? `${item.rating.toFixed(1)} (${item.reviewCount || 0})` : '4.7 (89)'}</Typography>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewButton} onPress={() => router.push((`/provider/${item._id}`) as any)}>
                  <Typography variant="body">View</Typography>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
          {(!otherProviders || otherProviders.length === 0) && (
            <View style={{ paddingVertical: 8 }}>
              <Typography variant="body" color={theme.colors.textSecondary}>No alternatives found.</Typography>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button title="Schedule Service" onPress={handleConfirm} loading={loading} style={{ marginBottom: theme.spacing.md, backgroundColor: '#F6A300' }} />
          <Button title="Cancel Recommendation" variant="outline" onPress={handleCancel} />
        </View>

      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  providerCard: {
    marginBottom: theme.spacing.lg,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationHeader: {
    marginBottom: theme.spacing.lg,
  },
  providerHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBig: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.navBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ribbon: {
    position: 'absolute',
    right: 0,
    top: -6,
    backgroundColor: '#6b3b00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  pricingCard: {
    marginBottom: theme.spacing.xl,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  actions: {
    marginTop: theme.spacing.md,
  }
  ,
  bannerCard: {
    height: 120,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderRadius: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  bannerBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  altCard: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  altAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  viewButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }
});
