import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = identifier.trim().length > 0 && password.length >= 6;

  const handleLogin = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      // Mock / Real API Integration
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/auth/login-mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: identifier }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthenticated(true, identifier, data.token || 'mock_token', data.user?._id || 'mock_id');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Auth Error', data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Fallback local auth for testing
      setAuthenticated(true, identifier, 'local_token', 'local_user_id');
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth-gateway');
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Premium TopAppBar Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Typography variant="h3" color="#FFFFFF" style={styles.headerTitle}>
            Login
          </Typography>
        </View>
        <Typography variant="h2" color="#FFFFFF" style={styles.brandText}>
          Ustaad
        </Typography>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 84, paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Text Section */}
          <View style={styles.welcomeSection}>
            <Typography variant="h1" style={styles.title}>
              Welcome Back
            </Typography>
            <Typography variant="body" color="#64748B" style={styles.subtitle}>
              Please enter your details to sign in.
            </Typography>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Phone/Email input */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Phone or Email
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="e.g. +92 300 1234567"
                placeholderTextColor="rgba(28, 28, 30, 0.3)"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputWrapper}>
              <View style={styles.passwordHeader}>
                <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                  Password
                </Typography>
                <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                  <Typography variant="caption" color={theme.colors.primary} style={styles.forgotLink}>
                    Forgot Password?
                  </Typography>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(28, 28, 30, 0.3)"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.visibilityToggle}
                >
                  <MaterialIcons
                    name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={!isFormValid}
              style={styles.submitBtn}
              icon="ArrowRight"
            />
          </View>

          {/* Stitch Designed Team Illustration Card */}
          <View style={styles.illustrationCard}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9_eRv6yR1ahcFvKAp7PaUy45obdoWrxMnvu_BkiE2we-_Pv6R0xQfy3xR2NyYCoAIvncPSAtxgk9wF7wUj0EM4cNCn_Y73uBnB2mbEWaGggGHVJFcyiOGPacZrnFGVnNIO0v1rrKqztyaL9b6LKtK19w3HrT9rcvimgYFEDcseAuR-qXQTJRTt4OdZ9f7dysceT-KUjx1VR3_xgR0sqfNUmDujWRVGuJL8mNKia69JcOK1WAtnfDNSERxcatzVnk9OkaFUodhk9s' }}
              style={styles.illustrationImage}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Signup Redirection */}
          <View style={styles.signupRedirect}>
            <Typography variant="body" color="#534434">
              Don't have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Typography variant="body" color={theme.colors.primary} weight="bold" style={styles.boldLink}>
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Dev testing shortcuts */}
          <View style={styles.devShortcuts}>
            <Typography variant="caption" color="#94A3B8" style={styles.devLabel}>
              ─── Testing Bypass ───
            </Typography>
            <View style={styles.bypassRow}>
              <TouchableOpacity
                onPress={() => {
                  setAuthenticated(true, '+92 300 1234567', 'bypass_token', 'bypass_user');
                  router.replace('/(tabs)');
                }}
                style={styles.bypassBtn}
              >
                <Typography variant="caption" color={theme.colors.primary} weight="bold">
                  Quick Login (Mock)
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate soft grey background matching the specs
  },
  keyboardView: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E', // Charcoal brand color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C1C1E',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  passwordInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  submitBtn: {
    height: 52,
    borderRadius: 26,
    marginTop: 8,
  },
  illustrationCard: {
    marginTop: 28,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  illustrationImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  signupRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  boldLink: {
    fontSize: 15,
  },
  devShortcuts: {
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  devLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
  },
  bypassRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bypassBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
}) as any;
