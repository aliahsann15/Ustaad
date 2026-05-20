import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { useBookingStore } from '../../store/useBookingStore';

const SERVICE_SUGGESTIONS = [
  { label: 'Plumber', query: 'I need a Plumber' },
  { label: 'Electrician', query: 'I need an Electrician' },
  { label: 'AC Repair', query: 'My AC needs repair' },
  { label: 'Carpenter', query: 'I need a Carpenter' },
  { label: 'Painter', query: 'I need a Painter' },
  { label: 'Cleaner', query: 'I need a deep cleaning service' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [requestText, setRequestText] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const setRequest = useBookingStore((state) => state.setRequest);

  const handleSubmit = () => {
    if (requestText.trim().length === 0) return;
    setRequest(requestText);
    router.push('/matching');
  };

  const handleQuickSelect = (chip: { label: string; query: string }) => {
    setSelectedChip(chip.label);
    setRequestText(`I need a ${chip.label}...`);
  };

  const handleMicPressIn = () => {
    setMicActive(true);
    Animated.spring(micScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handleMicPressOut = () => {
    setMicActive(false);
    Animated.spring(micScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        {/* ─── Shared Header ─── */}
        <Header title="Ustaad" />

        {/* ─── Main Scrollable Content ─── */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: 16, paddingBottom: insets.bottom + 180 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Localized Greeting ─── */}
            <View style={styles.greetingSection}>
              <Typography style={styles.greetingDisplay}>
                Assalam-o-Alaikum!
              </Typography>
              <Typography style={styles.greetingSubtitle}>
                Aap ko aaj kis cheez ki zaroorat hai?
              </Typography>
            </View>

            {/* ─── Service Suggestion Pills ─── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsContainer}
              style={styles.pillsScroll}
            >
              {SERVICE_SUGGESTIONS.map((chip) => {
                const isSelected = selectedChip === chip.label;
                return (
                  <TouchableOpacity
                    key={chip.label}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => handleQuickSelect(chip)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {chip.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ─── Illustration / Hero Area ─── */}
            <View style={styles.heroSection}>
              {/* Circular illustration container */}
              <View style={styles.illustrationCircle}>
                <MaterialIcons name="build" size={80} color={theme.colors.primary} style={{ opacity: 0.3 }} />
                <View style={styles.illustrationOverlay} />
                {/* Tool icons decorating the circle */}
                <View style={[styles.iconBadge, { top: 16, right: 20 }]}>
                  <MaterialIcons name="electrical-services" size={18} color={theme.colors.primary} />
                </View>
                <View style={[styles.iconBadge, { bottom: 20, left: 16 }]}>
                  <MaterialIcons name="plumbing" size={18} color="#515f74" />
                </View>
                <View style={[styles.iconBadge, { top: 40, left: 8 }]}>
                  <MaterialIcons name="cleaning-services" size={18} color={theme.colors.primary} />
                </View>
                {/* Center content */}
                <View style={styles.illustrationCenter}>
                  <MaterialIcons name="handyman" size={48} color={theme.colors.primary} />
                </View>
              </View>

              <Typography style={styles.heroTitle}>
                Expert help is a tap away
              </Typography>
              <Typography style={styles.heroBody}>
                Tell Ustaad what&apos;s broken, and we&apos;ll find the right professional for you instantly.
              </Typography>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ─── Floating Search Bar + Mic FAB ─── */}
        <View style={[styles.searchBarWrapper, { bottom: insets.bottom + 88 }]}>
          <View style={styles.searchRow}>
            {/* Input */}
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Ask Ustaad: e.g., Meray ghar ka fan kharab hai"
                placeholderTextColor="rgba(25,28,30,0.4)"
                value={requestText}
                onChangeText={setRequestText}
                onSubmitEditing={handleSubmit}
                returnKeyType="send"
              />
            </View>

            {/* Mic / Send FAB */}
            <Animated.View style={{ transform: [{ scale: micScale }] }}>
              <TouchableOpacity
                style={[styles.micFab, micActive && styles.micFabActive, requestText.length > 0 && styles.micFabSend]}
                onPressIn={handleMicPressIn}
                onPressOut={handleMicPressOut}
                onPress={requestText.length > 0 ? handleSubmit : undefined}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name={requestText.length > 0 ? 'arrow-forward' : 'mic'}
                  size={28}
                  color="#613b00"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },

  // ── Scroll Content ──
  scrollContent: {
    paddingHorizontal: 16,
  },

  // ── Greeting ──
  greetingSection: {
    marginBottom: 24,
  },
  greetingDisplay: {
    fontSize: 32,
    fontWeight: '700',
    color: '#191c1e',
    lineHeight: 40,
    letterSpacing: -0.5,
    fontFamily: 'System',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#534434',
    lineHeight: 28,
  },

  // ── Pills ──
  pillsScroll: {
    marginBottom: 32,
    marginHorizontal: -16,
  },
  pillsContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  pillSelected: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1e',
    letterSpacing: 0.1,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },

  // ── Hero / Illustration ──
  heroSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  illustrationCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#eceef0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  illustrationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(236,238,240,0.9)',
  },
  illustrationCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1e',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  heroBody: {
    fontSize: 14,
    fontWeight: '400',
    color: '#534434',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  // ── Search Bar ──
  searchBarWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 40,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    height: 60,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    fontSize: 15,
    color: '#191c1e',
    fontFamily: 'System',
  },
  micFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  micFabActive: {
    backgroundColor: '#D97706',
  },
  micFabSend: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#1C1C1E',
  },
});
