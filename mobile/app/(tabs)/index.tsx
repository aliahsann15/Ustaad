import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { useBookingStore } from '../../store/useBookingStore';
import { Header } from '../../components/Header';

export default function HomeScreen() {
  const router = useRouter();
  const [requestText, setRequestText] = useState('');
  const setRequest = useBookingStore(state => state.setRequest);

  const handleSubmit = () => {
    if (requestText.trim().length === 0) return;
    setRequest(requestText);
    router.push('/matching');
  };

  const handleQuickSelect = (service: string) => {
    setRequest(service);
    router.push('/matching');
  };

  return (
    <View style={styles.container}>
      <Header title="Welcome!" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.content}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          {/* Hero Section / Vertically Centered Title & Suggestions */}
          <View style={styles.topArea}>
            <Typography variant="h1" color={theme.colors.textPrimary} style={styles.heroText}>
              Assalam-o-Alaikum!
            </Typography>
            <Typography variant="body" style={styles.brandSubtext}>
              What's bothering you today? Let's get it fixed!
            </Typography>

            {/* Quick Suggestions as Pills under the Center Content */}
            <View style={styles.suggestions}>
              <TouchableOpacity
                style={styles.suggestionPill}
                onPress={() => handleQuickSelect('I need a Plumber')}
              >
                <Typography variant="caption" weight="medium" style={styles.pillText}>Plumber</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionPill}
                onPress={() => handleQuickSelect('I need an Electrician')}
              >
                <Typography variant="caption" weight="medium" style={styles.pillText}>Electrician</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionPill}
                onPress={() => handleQuickSelect('My AC needs repair')}
              >
                <Typography variant="caption" weight="medium" style={styles.pillText}>AC Repair</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Area: Input Row (Input + Outside Mic) */}
          <View style={styles.bottomArea}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="My AC is not working in G-13"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={requestText}
                  onChangeText={setRequestText}
                  multiline
                />
              </View>
              <TouchableOpacity
                style={[styles.fab, requestText.length > 0 ? styles.fabActive : null]}
                onPress={handleSubmit}
              >
                <Ionicons
                  name={requestText.length > 0 ? "arrow-forward" : "mic"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16, // Exactly matches the header's marginHorizontal
    paddingTop: theme.spacing.xl,
    paddingBottom: 101, // 85px (Tab bar height) + 16px (matches side gutters) = 101px
    justifyContent: 'space-between',
  },
  topArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilies.bold,
    lineHeight: 36,
  },
  brandSubtext: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  bottomArea: {
    width: '100%',
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#00000079',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    maxHeight: 120, // Max height for 5 lines of text
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.textPrimary,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.navBackground, // Charcoal
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4, // Snug gap between input and outer action button
    shadowColor: theme.colors.navBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabActive: {
    backgroundColor: theme.colors.primary, // Switch to Amber when active
    shadowColor: theme.colors.primary,
  },
  suggestions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  suggestionPill: {
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
  }
});
