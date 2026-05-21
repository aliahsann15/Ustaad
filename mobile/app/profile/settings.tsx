import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export default function AppSettingsScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => {
    const lengthScore = Math.min(newPassword.length / 12, 1);
    const varietyScore = [/[a-z]/.test(newPassword), /[A-Z]/.test(newPassword), /\d/.test(newPassword), /[^A-Za-z0-9]/.test(newPassword)].filter(Boolean).length / 4;
    return Math.min(1, lengthScore * 0.6 + varietyScore * 0.4);
  }, [newPassword]);

  const strengthColor = useMemo(() => {
    if (!newPassword) return '#D1D5DB';
    if (strength < 0.34) return '#EF4444';
    if (strength < 0.67) return '#F59E0B';
    return '#10B981';
  }, [newPassword, strength]);

  const handleUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing information', 'Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Password too short', 'New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure both new password fields match.');
      return;
    }

    Alert.alert('Password updated', 'Your password has been changed successfully.');
    router.back();
  };

  return (
    <Page scroll style={styles.container}>
      <Header title="Change Password" isSubScreen onBackPress={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Typography variant="body" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
            Ensure your account stays secure with a strong, unique password.
          </Typography>
        </View>

        <Card style={styles.formCard}>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secure={!showCurrent}
            onToggle={() => setShowCurrent((value) => !value)}
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Minimum 8 characters"
            secure={!showNew}
            onToggle={() => setShowNew((value) => !value)}
          />

          <View style={styles.strengthRow}>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthFill, { width: `${Math.max(strength * 100, newPassword ? 10 : 0)}%`, backgroundColor: strengthColor }]} />
            </View>
            <Typography variant="body" color={theme.colors.textSecondary} style={styles.strengthLabel}>
              Strength
            </Typography>
          </View>

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secure={!showConfirm}
            onToggle={() => setShowConfirm((value) => !value)}
          />
        </Card>

        <View style={styles.noteCard}>
          <MaterialIcons name="info-outline" size={20} color="#5C6B82" />
          <Typography variant="body" color="#5C6B82" style={styles.noteText}>
            Changing your password will log you out of all other devices. Make sure you remember your new credentials before proceeding.
          </Typography>
        </View>

        <Button title="Update Password" onPress={handleUpdate} icon="ArrowRight" iconPosition="right" style={styles.submitButton} />
      </View>
    </Page>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secure: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Typography variant="h3" weight="bold" style={styles.fieldLabel}>
        {label}
      </Typography>

      <View style={styles.passwordInputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          style={styles.passwordInput}
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.eyeButton}>
          <MaterialIcons name={secure ? 'visibility' : 'visibility-off'} size={28} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: 24,
    paddingBottom: theme.spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  heroIconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FBF2E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
  },
  subtitle: {
    maxWidth: 320,
    fontSize: 18,
    lineHeight: 26,
  },
  formCard: {
    gap: 22,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: '#5C4633',
    fontSize: 18,
  },
  passwordInputWrap: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#F3F5F8',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 18,
    paddingVertical: 0,
  },
  eyeButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#F59E0B',
  },
  strengthLabel: {
    fontSize: 17,
  },
  noteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8E3F4',
    backgroundColor: '#EDF4FD',
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
  },
  submitButton: {
    minHeight: 60,
    borderRadius: 34,
  },
});
