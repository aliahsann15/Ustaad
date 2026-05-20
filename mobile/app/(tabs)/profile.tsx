import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Button } from '../../components/Button';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const logout = useAuthStore((state) => state.logout);

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleLogoutPress = () => {
  logout();
  router.replace('/auth-gateway');
};

  // Keep screen awake while this screen is mounted
  useEffect(() => {
    (async () => {
      try {
        await activateKeepAwakeAsync();
      } catch (e) {
        console.warn('Keep awake activation failed', e);
      }
    })();
    return () => deactivateKeepAwake();
  }, []);

  // Duplicate login handler removed – the correct handler is defined earlier.


  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        {isAuthenticated ? (
          <View style={styles.authenticatedContent}>
            {/* User Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarPlaceholder}>
                <Typography variant="h1" color="#FFFFFF" weight="bold">
                  {phoneNumber ? phoneNumber.slice(-1) : 'U'}
                </Typography>
              </View>
              <Typography variant="h3" color={theme.colors.textPrimary} style={styles.userName}>
                Ustaad Customer
              </Typography>
              <Typography variant="body" color={theme.colors.textSecondary}>
                {phoneNumber ? `+${phoneNumber}` : 'Guest User'}
              </Typography>
            </View>
            {/* Edit Profile Button */}
            <Button
              title="Edit Profile"
              variant="primary"
              onPress={() => router.push('/profile/edit')}
              style={styles.editProfileButton}
            />

            {/* Settings Sections */}
            <View style={styles.sectionsContainer}>
              <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/profile/addresses')} activeOpacity={0.8}>
                <MaterialIcons name="location-on" size={24} color={theme.colors.textSecondary} />
                <Typography variant="body" color={theme.colors.textPrimary} style={styles.sectionLabel}>Saved Addresses</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/profile/payments')} activeOpacity={0.8}>
                <MaterialIcons name="payment" size={24} color={theme.colors.textSecondary} />
                <Typography variant="body" color={theme.colors.textPrimary} style={styles.sectionLabel}>Payment Methods</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/profile/language')} activeOpacity={0.8}>
                <MaterialIcons name="language" size={24} color={theme.colors.textSecondary} />
                <Typography variant="body" color={theme.colors.textPrimary} style={styles.sectionLabel}>App Language</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/profile/settings')} activeOpacity={0.8}>
                <MaterialIcons name="settings" size={24} color={theme.colors.textSecondary} />
                <Typography variant="body" color={theme.colors.textPrimary} style={styles.sectionLabel}>App Settings</Typography>
              </TouchableOpacity>
            </View>

            <Button
              title="Logout"
              variant="outline"
              textColor={theme.colors.error}
              onPress={handleLogoutPress}
              style={styles.logoutButton}
              icon="LogOut"
            />
          </View>
        ) : (
          <View style={styles.unauthenticatedContent}>
            <Typography 
              variant="h3" 
              color={theme.colors.textPrimary} 
              align="center"
              style={styles.messageTitle}
            >
              Sign In to View Profile
            </Typography>
            <Typography 
              variant="body" 
              color={theme.colors.textSecondary} 
              align="center"
              style={styles.messageBody}
            >
              Please log in to manage your personal details, home addresses, payment options, and language settings.
            </Typography>
            <Button
              title="Sign In"
              variant="primary"
              onPress={handleLoginPress}
              style={styles.loginButton}
              icon="LogIn"
            />
          </View>
        )}
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
    flex: 1,
    padding: theme.spacing.xl,
  },
  authenticatedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  profileCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginTop: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontFamily: theme.typography.fontFamilies.bold,
    marginBottom: theme.spacing.xs,
  },
  sectionsContainer: {
    width: '100%',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionLabel: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.textPrimary,
  },
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  editProfileButton: {
    width: '100%',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  unauthenticatedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  messageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    marginBottom: theme.spacing.sm,
  },
  messageBody: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  loginButton: {
    width: '100%',
    height: 52,
    borderRadius: theme.borderRadius.full,
  },
});
