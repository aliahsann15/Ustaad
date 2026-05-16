import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';

export default function MatchingScreen() {
  const router = useRouter();
  
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.8);

  useEffect(() => {
    // Radar Pulse Animation
    pulseScale.value = withRepeat(
      withTiming(2, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    const startMatching = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate radar time
      router.replace('/quote');
    };

    startMatching();
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Visual Radar Area */}
      <View style={styles.radarSection}>
        <View style={styles.radarCenter}>
          <Animated.View style={[styles.pulseRing, animatedPulseStyle]} />
          <View style={styles.radarCore}>
            <Ionicons name="search" size={40} color="#FFFFFF" />
          </View>
        </View>
        <Typography variant="h2" color="#FFFFFF" style={{ marginTop: theme.spacing.xxl }}>
          Antigravity Agent is working...
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.navBackground, // Deep Slate for matching mode
  },
  radarSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryHover,
    zIndex: 1,
  },
});
