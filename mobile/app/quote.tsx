import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

export default function QuoteScreen() {
  const router = useRouter();

  const handleConfirm = () => {
    router.replace('/tracking');
  };

  const handleCancel = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Header title="Match Found" isSubScreen={true} />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={60} color={theme.colors.success} />
        </View>

        <Card style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={styles.avatarPlaceholder}>
              <Typography variant="h2" color="#FFF">AR</Typography>
            </View>
            <View style={{ marginLeft: theme.spacing.md }}>
              <Typography variant="h3">Ali Raza</Typography>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={theme.colors.primary} />
                <Typography variant="caption" weight="bold" style={{ marginLeft: 4 }}>4.9 (120 jobs)</Typography>
              </View>
            </View>
            <View style={styles.badge}>
              <Typography variant="caption" color="#FFF" weight="bold">Verified</Typography>
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
            <Typography variant="body" style={{ marginLeft: theme.spacing.sm }}>8.5 km away (Est. 20 mins)</Typography>
          </View>
          <View style={styles.detailsRow}>
            <Ionicons name="build" size={20} color={theme.colors.textSecondary} />
            <Typography variant="body" style={{ marginLeft: theme.spacing.sm }}>AC Technician, Electrician</Typography>
          </View>
        </Card>

        <Card style={styles.pricingCard}>
          <Typography variant="h3" style={{ marginBottom: theme.spacing.md }}>Estimated Pricing</Typography>
          
          <View style={styles.priceRow}>
            <Typography variant="body" color={theme.colors.textSecondary}>Base Visit Fee</Typography>
            <Typography variant="body">Rs. 500</Typography>
          </View>
          <View style={styles.priceRow}>
            <Typography variant="body" color={theme.colors.textSecondary}>Distance Surcharge (8.5km)</Typography>
            <Typography variant="body">Rs. 200</Typography>
          </View>
          <View style={styles.priceRow}>
            <Typography variant="body" color={theme.colors.textSecondary}>Urgency Adjustment (High)</Typography>
            <Typography variant="body">Rs. 300</Typography>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Typography variant="h2">Total Estimated</Typography>
            <Typography variant="h2" color={theme.colors.primary}>Rs. 1000</Typography>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button title="Confirm Booking" onPress={handleConfirm} style={{ marginBottom: theme.spacing.md }} />
          <Button title="Find Someone Else" variant="outline" onPress={handleCancel} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
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
});
