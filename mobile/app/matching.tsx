import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { useBookingStore } from '../store/useBookingStore';
import { Platform } from 'react-native';

export default function MatchingScreen() {
  const router = useRouter();
  const currentRequest = useBookingStore(state => state.currentRequest);
  const addAgentLog = useBookingStore(state => state.addAgentLog);
  const agentLogs = useBookingStore(state => state.agentLogs);
  
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

    // Simulate Agent Workflow Traces
    const simulateAgent = async () => {
      const logs = [
        `[OBSERVE] Received request: "${currentRequest}"`,
        `[REASON] Extracting intent... Looks like an AC Repair issue with High Urgency.`,
        `[TOOL_CALL] Scanning Google Maps within 5km radius...`,
        `[REASON] No suitable verified provider found in 5km. Expanding search to 10km.`,
        `[OBSERVE] Found 3 matching providers.`,
        `[TOOL_CALL] Calculating dynamic pricing based on distance and urgency...`,
        `[ACT] Match found: Ali Raza (AC Technician).`
      ];

      for (let i = 0; i < logs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        addAgentLog(logs[i]);
      }

      setTimeout(() => {
        router.replace('/quote');
      }, 1500);
    };

    simulateAgent();
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

      {/* Agent Terminal Bottom Sheet */}
      <View style={styles.terminalSection}>
        <View style={styles.terminalHeader}>
          <Ionicons name="terminal" size={20} color={theme.colors.primary} />
          <Typography variant="body" weight="bold" color="#FFFFFF" style={{ marginLeft: theme.spacing.sm }}>
            Agent Trace Terminal
          </Typography>
        </View>
        <ScrollView style={styles.terminalLogs} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
          {agentLogs.map((log, index) => (
            <Typography key={index} variant="caption" color={theme.colors.success} style={{ marginBottom: theme.spacing.sm, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
              {log}
            </Typography>
          ))}
        </ScrollView>
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
  terminalSection: {
    height: '40%',
    backgroundColor: '#000000',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: theme.spacing.sm,
  },
  terminalLogs: {
    flex: 1,
  }
});
