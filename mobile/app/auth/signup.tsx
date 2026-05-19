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
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    fullName.trim().length >= 2 &&
    phone.trim().length >= 9 &&
    password.length >= 6;

  const handleSignup = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      // Mock signup flow -> routes user directly as authenticated
      setTimeout(() => {
        setAuthenticated(true, phone, 'signup_mock_token', 'signup_mock_user');
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      Alert.alert('Registration Error', 'An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  const handleSetLocation = () => {
    setLocationSet(true);
    Alert.alert('Location Updated', 'Your device coordinates have been set successfully.');
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
      <Header title="Create Account" isSubScreen={true} onBackPress={handleBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: 16, paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Text Section */}
          <View style={styles.welcomeSection}>
            <Typography variant="h1" style={styles.title}>
              Join Ustaad
            </Typography>
            <Typography variant="body" color="#64748B" style={styles.subtitle}>
              Start your journey with the most reliable experts in your area.
            </Typography>
          </View>

          {/* Form fields with inline icon decorations */}
          <View style={styles.formContainer}>
            {/* Full Name field */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Full Name
              </Typography>
              <View style={styles.fieldWithIcon}>
                <MaterialIcons name="person" size={20} color="#94A3B8" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(28, 28, 30, 0.3)"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Phone field */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Phone Number
              </Typography>
              <View style={styles.fieldWithIcon}>
                <MaterialIcons name="call" size={20} color="#94A3B8" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+92 300 0000000"
                  placeholderTextColor="rgba(28, 28, 30, 0.3)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password field */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Password
              </Typography>
              <View style={styles.fieldWithIcon}>
                <MaterialIcons name="lock" size={20} color="#94A3B8" style={styles.fieldIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Min. 8 characters"
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

            {/* Service Location Card */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Service Location
              </Typography>
              <TouchableOpacity
                onPress={handleSetLocation}
                style={[
                  styles.locationCard,
                  locationSet && styles.locationCardActive,
                ]}
              >
                <View
                  style={[
                    styles.locationIconBadge,
                    locationSet && styles.locationIconBadgeActive,
                  ]}
                >
                  <MaterialIcons
                    name="my-location"
                    size={20}
                    color={locationSet ? '#FFFFFF' : theme.colors.primary}
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Typography variant="body" weight="bold" color="#1C1C1E">
                    {locationSet ? 'Current Location Set' : 'Set current location'}
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    {locationSet ? 'Latitude/Longitude stored' : 'Find experts near you automatically'}
                  </Typography>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              disabled={!isFormValid}
              style={styles.submitBtn}
              icon="ArrowRight"
            />
          </View>

          {/* Login Redirection */}
          <View style={styles.loginRedirect}>
            <Typography variant="body" color="#534434">
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Typography variant="body" color={theme.colors.primary} weight="bold" style={styles.boldLink}>
                Login
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Privacy Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Typography variant="caption" align="center" color="#64748B" style={styles.disclaimerText}>
              By creating an account, you agree to Ustaad's{' '}
              <Typography variant="caption" color="#1C1C1E" style={styles.disclaimerLink}>
                Terms of Service
              </Typography>{' '}
              and{' '}
              <Typography variant="caption" color="#1C1C1E" style={styles.disclaimerLink}>
                Privacy Policy
              </Typography>
              .
            </Typography>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate background matching specs
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
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 36, // Balance the back button for centering title
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
  fieldWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 15,
    color: '#1C1C1E',
  },
  passwordInput: {
    paddingRight: 48,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  locationCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  locationCardActive: {
    borderColor: theme.colors.primary,
  },
  locationIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconBadgeActive: {
    backgroundColor: theme.colors.primary,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  submitBtn: {
    height: 52,
    borderRadius: 26,
    marginTop: 8,
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  boldLink: {
    fontSize: 15,
  },
  disclaimerContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  disclaimerLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
}) as any;
