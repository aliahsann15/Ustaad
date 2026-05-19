import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, phoneNumber, logout } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    phoneNumber: state.phoneNumber,
    logout: state.logout,
  }));

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleLogoutPress = () => {
    logout();
    router.replace('/auth-gateway');
  };

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
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: theme.borderRadius.full,
    borderColor: theme.colors.error,
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
