import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Page } from '../components/Page';

const STAGES = ['Request Sent', 'Matching', 'Confirmed'] as const;

const PROVIDERS = [
  {
    key: 'top',
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    size: 46,
    base: { x: 0, y: -78 },
    amplitude: { x: 8, y: 7 },
    phase: 0,
  },
  {
    key: 'left',
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    size: 36,
    base: { x: -70, y: 16 },
    amplitude: { x: 6, y: 5 },
    phase: 0.35,
  },
  {
    key: 'right',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    size: 42,
    base: { x: 62, y: 56 },
    amplitude: { x: 7, y: 6 },
    phase: 0.65,
  },
] as const;

function usePulseStyle(progress: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.55, 1.55]) }],
    opacity: interpolate(progress.value, [0, 0.2, 1], [0.82, 0.35, 0]),
  }));
}

function useBubbleStyle(
  orbit: SharedValue<number>,
  bobble: SharedValue<number>,
  baseX: number,
  baseY: number,
  amplitudeX: number,
  amplitudeY: number,
  phase: number,
) {
  return useAnimatedStyle(() => {
    const theta = (orbit.value + phase) * Math.PI * 2;
    const bounce = bobble.value;

    return {
      transform: [
        { translateX: baseX + Math.cos(theta) * amplitudeX + bounce * amplitudeX * 0.35 },
        { translateY: baseY + Math.sin(theta) * amplitudeY + bounce * amplitudeY * 0.35 },
        { scale: interpolate(bounce, [0, 1], [0.96, 1.04]) },
      ],
      opacity: interpolate(bounce, [0, 1], [0.9, 1]),
    };
  });
}

export default function MatchingScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<(typeof STAGES)[number]>('Request Sent');

  const pulseOne = useSharedValue(0);
  const pulseTwo = useSharedValue(0);
  const pulseThree = useSharedValue(0);
  const orbit = useSharedValue(0);
  const bobble = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    pulseOne.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pulseTwo.value = withRepeat(
      withDelay(1000, withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) })),
      -1,
      false
    );
    pulseThree.value = withRepeat(
      withDelay(2000, withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) })),
      -1,
      false
    );

    orbit.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.linear }),
      -1,
      false
    );

    bobble.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    progress.value = withTiming(0.5, { duration: 1400, easing: Easing.out(Easing.cubic) });

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStage('Matching'), 900));
    timers.push(
      setTimeout(() => {
        setStage('Confirmed');
        progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
        timers.push(setTimeout(() => router.replace('/quote'), 1200));
      }, 4200)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [bobble, orbit, pulseOne, pulseThree, pulseTwo, progress, router]);

  const pulseStyleOne = usePulseStyle(pulseOne);
  const pulseStyleTwo = usePulseStyle(pulseTwo);
  const pulseStyleThree = usePulseStyle(pulseThree);

  const bubbleStyleTop = useBubbleStyle(orbit, bobble, PROVIDERS[0].base.x, PROVIDERS[0].base.y, PROVIDERS[0].amplitude.x, PROVIDERS[0].amplitude.y, PROVIDERS[0].phase);
  const bubbleStyleLeft = useBubbleStyle(orbit, bobble, PROVIDERS[1].base.x, PROVIDERS[1].base.y, PROVIDERS[1].amplitude.x, PROVIDERS[1].amplitude.y, PROVIDERS[1].phase);
  const bubbleStyleRight = useBubbleStyle(orbit, bobble, PROVIDERS[2].base.x, PROVIDERS[2].base.y, PROVIDERS[2].amplitude.x, PROVIDERS[2].amplitude.y, PROVIDERS[2].phase);

  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0.12, progress.value) * 50}%`,
  }));

  const stageIndex = STAGES.indexOf(stage);

  const getStageColor = (index: number) => {
    if (index < stageIndex) return theme.colors.textPrimary;
    if (index === stageIndex) return theme.colors.primary;
    return theme.colors.textSecondary;
  };

  const getDotColor = (index: number) => {
    if (index <= stageIndex) return theme.colors.primary;
    return '#D8DADF';
  };

  const handleCancelPress = () => {
    Alert.alert('Cancel Request', 'Are you sure you want to cancel your request?', [
      { text: 'Keep Waiting', style: 'cancel' },
      { text: 'Cancel Request', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <Page style={styles.container}>
      <View style={styles.content}>
        <View style={styles.radarWrap}>
          <Animated.View style={[styles.radarPulse, styles.radarPulseLarge, pulseStyleThree]} />
          <Animated.View style={[styles.radarPulse, styles.radarPulseMedium, pulseStyleTwo]} />
          <Animated.View style={[styles.radarPulse, styles.radarPulseSmall, pulseStyleOne]} />

          <Animated.View style={[styles.providerBubble, styles.providerTop, bubbleStyleTop]}>
            <Image source={{ uri: PROVIDERS[0].uri }} style={styles.providerImageLg} contentFit="cover" />
          </Animated.View>

          <Animated.View style={[styles.providerBubble, styles.providerLeft, bubbleStyleLeft]}>
            <Image source={{ uri: PROVIDERS[1].uri }} style={styles.providerImageSm} contentFit="cover" />
          </Animated.View>

          <Animated.View style={[styles.providerBubble, styles.providerRight, bubbleStyleRight]}>
            <Image source={{ uri: PROVIDERS[2].uri }} style={styles.providerImageMd} contentFit="cover" />
          </Animated.View>

          <View style={styles.searchButton}>
            <MaterialIcons name="search" size={30} color="#5B3A00" />
          </View>
        </View>
        <View style={styles.messageBlock}>
          <Typography variant="h2" weight="bold" align="center" style={styles.title}>
            Finding your Ustaad...
          </Typography>
          <Typography variant="body" align="center" color={theme.colors.textSecondary} style={styles.description}>
            Connecting you with the best available professional in your area. This usually takes less than a minute.
          </Typography>
        </View>

        <View style={styles.stepper}>
          <Animated.View style={[styles.progressFill, progressFillStyle]} />
          {STAGES.map((label, index) => {
            const isActive = index === stageIndex;
            return (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepDot, { backgroundColor: getDotColor(index) }]}>
                  {index < stageIndex ? <MaterialIcons name="check" size={14} color="#FFFFFF" /> : index === stageIndex ? <View style={styles.activeDot} /> : null}
                </View>
                <Typography
                  variant="caption"
                  weight={isActive ? 'bold' : 'medium'}
                  color={getStageColor(index)}
                  style={[styles.stepLabel, isActive && styles.stepLabelActive]}
                >
                  {label}
                </Typography>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.cancelButton} onPress={handleCancelPress}>
          <Typography variant="body" weight="bold" style={styles.cancelButtonText}>
            Cancel Request
          </Typography>
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  radarWrap: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  radarPulse: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  radarPulseLarge: {
    width: 270,
    height: 270,
  },
  radarPulseMedium: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  radarPulseSmall: {
    width: 170,
    height: 170,
    backgroundColor: 'rgba(245, 158, 11, 0.24)',
  },
  searchButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  providerBubble: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 8,
  },
  providerImageLg: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  providerImageMd: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  providerImageSm: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  providerTop: {
    top: 18,
    left: 127,
  },
  providerLeft: {
    top: 171,
    left: 52,
  },
  providerRight: {
    top: 192,
    right: 60,
  },
  messageBlock: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
  },
  description: {
    maxWidth: 280,
    fontSize: 15,
    lineHeight: 22,
  },
  stepper: {
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    paddingTop: 10,
    paddingBottom: 2,
  },
  progressFill: {
    position: 'absolute',
    left: 16,
    top: 20,
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
  },
  stepItem: {
    width: 92,
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.primary,
  },
  cancelButton: {
    minWidth: 180,
    height: 54,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#9C846B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});
