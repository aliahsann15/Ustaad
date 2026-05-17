import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Header } from '../components/Header';

export default function AuthScreen() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [phoneNumber, setPhoneNumber] = useState('92');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const formatDisplay = (num: string) => {
    // Structure: +92 3XX XXXXXXX
    if (num.length <= 2) return '+' + num;
    if (num.length <= 5) return `+${num.slice(0, 2)} ${num.slice(2)}`;
    return `+${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 12)}`;
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Ensure 92 is always at the start
    let final = cleaned;
    if (!cleaned.startsWith('92')) {
      if (cleaned.length < 2) final = '92';
      else final = '92' + cleaned;
    }
    
    // Limit to 12 digits (+92 + 10 digits)
    setPhoneNumber(final.slice(0, 12));
  };

  const isPhoneValid = phoneNumber.length === 12 && phoneNumber.startsWith('923');

  const handleLogin = async () => {
    if (!isPhoneValid) return;
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login-mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAuthenticated(true, phoneNumber, data.token, data.user._id);
        router.replace('/(tabs)');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Network error. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Welcome" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Typography variant="body" color={theme.colors.textSecondary}>
            Enter your mobile number to get started with Ustaad.
          </Typography>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="+92 3XX XXXXXXX"
            keyboardType="phone-pad"
            value={formatDisplay(phoneNumber)}
            onChangeText={handlePhoneChange}
            autoFocus
            maxLength={15} // +92 + 2 spaces + 10 digits
          />

          <Button
            title="Join Ustaad"
            onPress={handleLogin}
            loading={loading}
            disabled={!isPhoneValid}
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
