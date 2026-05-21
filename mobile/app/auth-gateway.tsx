import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';

export default function AuthGatewayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  const handleContinueAsGuest = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Brand Header */}
      <View style={styles.brandHeader}>
        <Typography variant="h1" color={theme.colors.textPrimary} weight="bold">
          Ustaad
        </Typography>
        <View style={styles.brandDot} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Asymmetric Bento-Style Illustration Container */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/user.png')}
            style={styles.illustrationImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.imageOverlay}>
            <View style={styles.badge}>
              <Typography variant="caption" color="#FFFFFF" weight="bold">
                Trusted Experts
              </Typography>
            </View>
          </View>
        </View>

        {/* Messaging */}
        <View style={styles.textContainer}>
          <Typography variant="h1" align="center" style={styles.title}>
            Experience Excellence
          </Typography>
          <Typography variant="body" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
            Log in to view your booking history and manage your profile. Your next service is just a tap away.
          </Typography>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            variant="primary"
            onPress={handleSignIn}
            style={styles.pillButton}
            icon="LogIn"
          />
          <Button
            title="Create Account"
            variant="outline"
            textColor={theme.colors.textPrimary}
            onPress={handleCreateAccount}
            style={[styles.pillButton, styles.outlineButton]}
            icon="UserPlus"
          />
        </View>

        {/* Guest Link */}
        <TouchableOpacity 
          onPress={handleContinueAsGuest} 
          activeOpacity={0.7} 
          style={styles.guestLinkContainer}
        >
          <Typography 
            variant="body" 
            color={theme.colors.textSecondary} 
            weight="medium"
            style={styles.guestText}
          >
            Continue as Guest
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: -30,
    marginTop: 30,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: 2,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.1,
    maxHeight: 320,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(28, 28, 30, 0.15)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(28, 28, 30, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  pillButton: {
    height: 54,
    borderRadius: theme.borderRadius.full,
  },
  outlineButton: {
    borderColor: theme.colors.textPrimary,
  },
  guestLinkContainer: {
    paddingVertical: 8,
  },
  guestText: {
    textDecorationLine: 'underline',
  },
});
