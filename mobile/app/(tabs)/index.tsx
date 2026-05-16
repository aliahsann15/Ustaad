import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { useBookingStore } from '../../store/useBookingStore';

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" color={theme.colors.textPrimary}>Good Morning!</Typography>
          <Typography variant="body" color={theme.colors.textSecondary}>Need something fixed?</Typography>
        </View>

        {/* Hero Section / Input */}
        <View style={styles.heroSection}>
          <Typography variant="h1" color={theme.colors.textPrimary} style={styles.heroText}>
            What do you need fixed today?
          </Typography>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. My AC is leaking water in G-13"
              placeholderTextColor={theme.colors.textSecondary}
              value={requestText}
              onChangeText={setRequestText}
              multiline
            />
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

        {/* Quick Suggestions */}
        <Typography variant="h3" style={{ marginBottom: theme.spacing.md }}>Suggested Services</Typography>
        <View style={styles.suggestions}>
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => handleQuickSelect('I need a Plumber')}
          >
            <Card style={styles.suggestionCard}>
              <Ionicons name="water" size={32} color={theme.colors.primary} />
              <Typography variant="caption" style={{ marginTop: theme.spacing.sm }}>Plumber</Typography>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => handleQuickSelect('I need an Electrician')}
          >
            <Card style={styles.suggestionCard}>
              <Ionicons name="flash" size={32} color={theme.colors.primary} />
              <Typography variant="caption" style={{ marginTop: theme.spacing.sm }}>Electrician</Typography>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => handleQuickSelect('My AC needs repair')}
          >
            <Card style={styles.suggestionCard}>
              <Ionicons name="snow" size={32} color={theme.colors.primary} />
              <Typography variant="caption" style={{ marginTop: theme.spacing.sm }}>AC Repair</Typography>
            </Card>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  heroSection: {
    marginBottom: theme.spacing.xxl,
  },
  heroText: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    minHeight: 60,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.textPrimary,
    paddingRight: theme.spacing.md,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.navBackground, // Default to deep slate
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'space-between',
  },
  suggestionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  suggestionCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
  }
});
