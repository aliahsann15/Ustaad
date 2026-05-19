import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

export default function ActivityScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Header title="History" />
      <View style={styles.content}>
        {isAuthenticated ? (
          <View style={styles.authenticatedContent}>
            <Typography variant="body" color={theme.colors.textSecondary}>
              No recent bookings.
            </Typography>
          </View>
        ) : (
          <View style={styles.unauthenticatedContent}>
            <Typography 
              variant="h3" 
              color={theme.colors.textPrimary} 
              align="center"
              style={styles.messageTitle}
            >
              Sign In to View History
            </Typography>
            <Typography 
              variant="body" 
              color={theme.colors.textSecondary} 
              align="center"
              style={styles.messageBody}
            >
              Please log in to check your previous service bookings, dynamic tracking status, and ratings.
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
    justifyContent: 'center',
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
