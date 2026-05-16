import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthScreen() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    // Simulate Firebase OTP send
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) return;
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      setAuthenticated(true, phoneNumber, 'mock_token_123');
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Typography variant="h1" color={theme.colors.textPrimary}>
            {step === 'PHONE' ? 'Welcome to Ustaad' : 'Verify Phone'}
          </Typography>
          <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
            {step === 'PHONE' 
              ? 'Enter your mobile number to get started.' 
              : `Enter the 6-digit code sent to ${phoneNumber}`}
          </Typography>
        </View>

        <View style={styles.form}>
          {step === 'PHONE' ? (
            <TextInput
              style={styles.input}
              placeholder="+92 3XX XXXXXXX"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoFocus
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />
          )}

          <Button
            title={step === 'PHONE' ? 'Send OTP' : 'Verify & Continue'}
            onPress={step === 'PHONE' ? handleSendOtp : handleVerifyOtp}
            loading={loading}
            disabled={step === 'PHONE' ? phoneNumber.length < 10 : otp.length < 6}
            style={{ marginTop: theme.spacing.xl }}
          />
        </View>

        {/* Dev Menu for UI Testing */}
        <View style={{ marginTop: theme.spacing.xxl }}>
          <Typography variant="caption" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
            --- Dev Testing Shortcuts ---
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            <Button title="Home" variant="outline" size="sm" onPress={() => { setAuthenticated(true, '123', 'token'); router.replace('/(tabs)'); }} />
            <Button title="Match" variant="outline" size="sm" onPress={() => router.push('/matching')} />
            <Button title="Quote" variant="outline" size="sm" onPress={() => router.push('/quote')} />
            <Button title="Track" variant="outline" size="sm" onPress={() => router.push('/tracking')} />
          </View>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  form: {
    // Form styles
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.textPrimary,
  },
});
