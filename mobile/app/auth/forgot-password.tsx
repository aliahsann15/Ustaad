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
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const isFormValid = identifier.trim().length > 0;

  const handleSendCode = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      // Mock code sending flow
      setTimeout(() => {
        setLoading(false);
        setCodeSent(true);
        Alert.alert(
          'Verification Code Sent',
          `A password reset code has been sent to ${identifier}.`,
          [{ text: 'OK', onPress: () => router.push('/auth/login') }]
        );
      }, 1500);
    } catch (error) {
      Alert.alert('Error', 'Failed to send recovery code. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <Page style={styles.container} scroll>
      <Header title="Recover Password" isSubScreen={true} onBackPress={handleBack} />

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
              Recover Password
            </Typography>
            <Typography variant="body" color="#64748B" style={styles.subtitle}>
              Don't worry, it happens. Enter your registered email or phone number and we'll send you a verification code to reset your account.
            </Typography>
          </View>

          {/* Stitch Designed Security Illustration Container */}
          <View style={styles.illustrationCard}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRKZW_OeF5wfOsJqBtkbzQtKuky8uwF84jUFdKCtruVADCYaDGqldKm13l4gb7_N1IeMA-UE7kbQGHRia0OgBPKVpZKQdu1CSMOTDmXpJkeTsz6LJ5Wiut4ZKpVo0vtSFhZrkVlquZ8cdazo18NFqjPS5N8Avt1SxnQlLFK6eEJc6tcWcM-omTZER7l93Va_EtmDzz3LNniQM5amIWNmNQh4ERweq1PotZ6sm9TFwyPqtANe1omTAnUjRUs2GPVSKR4XUvBSrnk7c' }}
              style={styles.illustrationImage}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email/Phone input */}
            <View style={styles.inputWrapper}>
              <Typography variant="caption" color="#64748B" style={styles.inputLabel}>
                Email or Phone Number
              </Typography>
              <View style={styles.fieldWithIcon}>
                <MaterialIcons name="contact-mail" size={20} color="#94A3B8" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. name@example.com"
                  placeholderTextColor="rgba(28, 28, 30, 0.3)"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Submit Button */}
            <Button
              title={codeSent ? "Code Sent!" : "Send Code"}
              onPress={handleSendCode}
              loading={loading}
              disabled={!isFormValid || codeSent}
              style={[styles.submitBtn, codeSent && styles.submitBtnSuccess]}
              icon="ArrowRight"
            />
          </View>

          {/* Redirect to Login */}
          <View style={styles.loginRedirect}>
            <Typography variant="body" color="#534434">
              Remember your password?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Typography variant="body" color={theme.colors.primary} weight="bold" style={styles.boldLink}>
                Log In
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom decorative color border line */}
      <View style={[styles.bottomDecorativeLine, { paddingBottom: insets.bottom }]} />
    </Page>
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
    width: 36, // Balance back button to center "Ustaad" text
  },
  scrollContent: {
    paddingHorizontal: 0,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  illustrationCard: {
    marginVertical: 12,
    borderRadius: 24,
    height: 180,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  formContainer: {
    gap: 16,
    marginTop: 12,
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
  submitBtn: {
    height: 52,
    borderRadius: 26,
    marginTop: 8,
  },
  submitBtnSuccess: {
    backgroundColor: '#10B981', // green background when success
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  boldLink: {
    fontSize: 15,
  },
  bottomDecorativeLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F59E0B', // Accent Amber line
    opacity: 0.2,
  },
}) as any;
