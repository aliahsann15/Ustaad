import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuthStore } from '../../store/useAuthStore';

export default function MoreScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = (path: any) => () => router.push(path);

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleLogoutPress = () => {
    logout();
    router.replace('/auth-gateway');
  };

  return (
    <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
      <Header title="More" />
      <View style={styles.content}>
        <View style={styles.topCard}>
          <View style={styles.cornerGlow}></View>
          <Typography variant="h2" weight="bold">Ustaad</Typography>
          <Typography variant="body" color={theme.colors.textSecondary} style={styles.version}>Version {process.env.EXPO_PUBLIC_APP_VERSION}</Typography>
        </View>

        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.card} onPress={navigate('/more/change-language')} activeOpacity={0.85}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="language" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Typography variant="body" weight="bold">Change Language</Typography>
              <Typography variant="caption">English, Urdu</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={navigate('/more/contact-support')} activeOpacity={0.85}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="support-agent" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Typography variant="body" weight="bold">Contact Customer Support</Typography>
              <Typography variant="caption">Get help with your bookings</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={navigate('/more/faqs')} activeOpacity={0.85}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="help-outline" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Typography variant="body" weight="bold">FAQs</Typography>
              <Typography variant="caption">Common questions and answers</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={navigate('/more/terms-privacy')} activeOpacity={0.85}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="description" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Typography variant="body" weight="bold">Terms & Privacy Policy</Typography>
              <Typography variant="caption">Our usage guidelines</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={navigate('/more/about')} activeOpacity={0.85}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="info" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Typography variant="body" weight="bold">About Ustaad App</Typography>
              <Typography variant="caption">Mission and company values</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {isAuthenticated ? (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.8}>
              <MaterialIcons name="logout" size={20} color="#B91C1C" />
              <Typography variant="body" weight="medium" color="#B91C1C" style={styles.logoutLabel}>
                Logout
              </Typography>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} activeOpacity={0.8}>
              <MaterialIcons name="login" size={20} color={theme.colors.textPrimary} />
              <Typography variant="body" weight="medium" color={theme.colors.textPrimary} style={styles.loginLabel}>
                Login
              </Typography>
            </TouchableOpacity>
          )}

          <Typography variant="caption" color={theme.colors.textSecondary} style={styles.footer}>© 2024 Ustaad Services Inc. All rights reserved.</Typography>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
  },
  pageContent: {
    flexGrow: 1,
  },
  topCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cornerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: theme.colors.primary + '33',
    zIndex: 0,
  },
  version: {
    marginTop: theme.spacing.sm,
  },
  listContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardText: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  logoutLabel: {
    marginLeft: theme.spacing.sm,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  loginLabel: {
    marginLeft: theme.spacing.sm,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
