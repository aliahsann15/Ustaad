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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { Page } from '../../components/Page';

export default function LoginScreen() {
  const router = useRouter();
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
    } catch {
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
    <Page style={styles.container} scroll>
      <Header title="Login" isSubScreen={true} onBackPress={handleBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
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

          {/* Signup Redirection */}
          <View style={styles.signupRedirect}>
            <Typography variant="body" color="#534434">
              Don&apos;t have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Typography variant="body" color={theme.colors.primary} weight="bold" style={styles.boldLink}>
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate soft grey background matching the specs
    paddingTop: 44,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  welcomeSection: {
    marginVertical: 40,
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
  signupRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  boldLink: {
    fontSize: 15,
  },
}) as any;
