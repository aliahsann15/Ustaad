import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page } from '../components/Page';
import { useBookingStore } from '../store/useBookingStore';

export default function TrackingScreen() {
  const router = useRouter();
  const matchedProvider = useBookingStore((state) => state.matchedProvider);

  // Mock coordinates for Islamabad, Pakistan
  const customerRegion = {
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  
  const providerLocation = {
    latitude: matchedProvider?.location?.lat || 33.6700,
    longitude: matchedProvider?.location?.lng || 73.0300,
  };

  const insets = useSafeAreaInsets();

  return (
    <Page style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Live Tracking" isSubScreen={true} />
      
      {/* Map View */}
      <MapView 
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={customerRegion}
      >
        <Marker coordinate={{ latitude: customerRegion.latitude, longitude: customerRegion.longitude }} title="You" />
        <Marker coordinate={providerLocation} title="Ali Raza" description="En Route">
           <View style={styles.providerMarker}>
             <Ionicons name="car" size={20} color="#FFF" />
           </View>
         </Marker>
      </MapView>

      {/* Floating Header info */}
      <View style={styles.headerSafe}>
        <View style={styles.headerPill}>
          <View style={styles.pulsingDot} />
          <Typography variant="body" weight="bold" color={theme.colors.textPrimary}>Provider En-Route</Typography>
        </View>
      </View>

      {/* Bottom Information Card */}
      <View style={[styles.bottomSheet, { bottom: insets.bottom + 80 }]}> 
        <Card style={styles.trackingCard}>
          <View style={styles.etaRow}>
            <View>
              <Typography variant="h2">18 mins</Typography>
              <Typography variant="caption">Estimated Arrival</Typography>
            </View>
            <View style={styles.contactActions}>
              <View style={[styles.circleButton, { backgroundColor: '#25D366' }]}>
                 <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
              </View>
              <View style={[styles.circleButton, { backgroundColor: theme.colors.navBackground }]}>
                 <Ionicons name="call" size={24} color="#FFF" />
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.providerRow}>
            <View style={styles.avatar}>
              <Typography variant="h3" color="#FFF">
                {matchedProvider?.name
                  ? matchedProvider.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
                  : 'AR'}
              </Typography>
            </View>
            <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
              <Typography variant="h3">{matchedProvider?.name || 'Ali Raza'}</Typography>
              <Typography variant="caption">
                {matchedProvider?.skills?.length ? `${matchedProvider.skills.join(' • ')}` : 'AC Technician • Toyota Corolla (AB-1234)'}
              </Typography>
            </View>
          </View>

          <Button title="Mark as Completed" style={{ marginTop: theme.spacing.lg }} onPress={() => router.replace('/(tabs)')} />
        </Card>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerSafe: {
    position: 'absolute',
    top: 135,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  providerMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.navBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: theme.spacing.md,
  },
  trackingCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactActions: {
    flexDirection: 'row',
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.navBackground,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
