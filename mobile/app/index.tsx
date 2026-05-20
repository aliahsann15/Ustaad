import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { useAuthStore } from '../store/useAuthStore';
import { Image } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.4);

  const navigateToNext = () => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth-gateway');
    }
  };

  useEffect(() => {
    // Logo entrance animation
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1.0, { damping: 15, stiffness: 100 }, () => {
      // Hold splash screen for 1.8 seconds before transition
      setTimeout(() => runOnJS(navigateToNext)(), 1800);
    });

    // Ambient glow pulse animation
    glowOpacity.value = withTiming(0.7, { duration: 1500 });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Watermark Textures (Asymmetric Construction & Security Badges) */}
      <View style={styles.watermarkTopRight}>
        <MaterialIcons name="construction" size={140} color="rgba(245, 158, 11, 0.04)" />
      </View>
      <View style={styles.watermarkBottomLeft}>
        <MaterialIcons name="verified" size={140} color="rgba(245, 158, 11, 0.04)" />
      </View>

      {/* Ambient Pulsing Glow behind Logo (Feathered Concentric Gradient Structure) */}
      <Animated.View style={[styles.ambientGlowOuter, glowAnimatedStyle]}>
        <View style={styles.ambientGlowMiddle}>
          <View style={styles.ambientGlowInner}>
            <View style={styles.ambientGlowCenter} />
          </View>
        </View>
      </Animated.View>

      {/* Central Branding Container */}
      <Animated.View style={[styles.brandContainer, logoAnimatedStyle]}>
        {/* Squircle Logo Icon with Handyman graphic */}
        <View style={styles.logoIcon}>
          {/* <MaterialIcons name="handyman" size={46} color="#1C1C1E" /> */}
          <Image
            source={require('../assets/logomark.png')}
            style={styles.logoImage}
          />
        </View>

        {/* Brand Typography */}
        <View style={styles.textWrapper}>
          <Typography variant="h1" color={theme.colors.primary} align="center" style={styles.brandTitle}>
            Ustaad
          </Typography>
          <Typography variant="caption" color="#D8DADC" align="center" style={styles.brandSubtitle}>
            TRUSTED EXPERT SERVICES
          </Typography>
        </View>
      </Animated.View>

      {/* Bottom Footer Content */}
      <View style={styles.footer}>
        {/* Loading Indicator */}
        <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />
        
        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Typography variant="caption" color="rgba(148, 163, 184, 0.4)" style={styles.versionText}>
            Version {process.env.EXPO_PUBLIC_APP_VERSION}
          </Typography>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Pure brand charcoal dark canvas
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkTopRight: {
    position: 'absolute',
    top: 40,
    right: -20,
    transform: [{ rotate: '45deg' }],
  },
  watermarkBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: -20,
    transform: [{ rotate: '-12deg' }],
  },
  ambientGlowOuter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(245, 158, 11, 0.015)',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS platform blur support
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 60,
  },
  ambientGlowMiddle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(245, 158, 11, 0.025)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlowInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlowCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
  },
  brandContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: 28, // Squircle profile
    // backgroundColor: theme.colors.primary, // #F59E0B Amber
    backgroundColor: theme.colors.background, // #D8C3AD Background color of the app
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '12deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    transform: [{ rotate: '-12deg' }],
    width: 72,
    height: 72,
  },
  textWrapper: {
    marginTop: 28,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 40,
    fontFamily: theme.typography.fontFamilies.bold,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 11,
    letterSpacing: 3,
    opacity: 0.6,
    marginTop: 6,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    gap: 16,
  },
  loader: {
    marginBottom: 8,
  },
  versionContainer: {
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 6,
  },
});
