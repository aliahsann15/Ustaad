import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { useAuthStore } from '../store/useAuthStore';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const navigateToNext = () => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1, { damping: 10 }, () => {
        // After animation completes, hold for 1s then navigate
        setTimeout(() => runOnJS(navigateToNext)(), 1500);
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        {/* Placeholder for animated Wrench -> Spark icon */}
        <View style={styles.iconPlaceholder}>
          <Typography variant="h1" color={theme.colors.primary}>🔧✨</Typography>
        </View>
        <Typography variant="h1" color="#FFFFFF" style={{ marginTop: theme.spacing.lg }}>
        Ustaad
        </Typography>
        <Typography variant="body" color={theme.colors.primary} style={{ marginTop: theme.spacing.sm }}>
          AI Service Orchestrator
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.navBackground, // 30% Secondary color for deep, premium feel
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
