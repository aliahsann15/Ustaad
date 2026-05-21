import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { getCurrentUser } from '../../lib/api';

const PROFILE_PLACEHOLDER = require('../../assets/images/user.png');

export default function ProfileScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const memberLabel = 'Gold Member';

  useEffect(() => {
    if (!isAuthenticated) return;

    void getCurrentUser({ token, userId })
      .then((user: any) => {
        setProfileName(typeof user?.name === 'string' ? user.name.trim() : '');
        setProfileEmail(typeof user?.email === 'string' ? user.email.trim() : '');
        setProfilePhone(typeof user?.phoneNumber === 'string' ? user.phoneNumber.trim() : '');
        setProfileAddress(typeof user?.address === 'string' ? user.address.trim() : '');
        setProfileImage(typeof user?.profileImage === 'string' && user.profileImage.trim() ? user.profileImage.trim() : null);
      })
      .catch(() => {});
  }, [isAuthenticated, token, userId]);

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleLogoutPress = () => {
    logout();
    router.replace('/auth-gateway');
  };


  return (
    <Page style={styles.container} scroll contentContainerStyle={styles.pageContent}>
      <Header title="Profile" />
      <View style={styles.content}>
        {isAuthenticated ? (
          <View style={styles.authenticatedContent}>
            <Card style={styles.profileHeroCard}>
              <View style={styles.avatarWrap}>
                <Image source={profileImage ? { uri: profileImage } : PROFILE_PLACEHOLDER} style={styles.avatarImage} contentFit="cover" />

                <View style={styles.memberBadgeDot}>
                  <MaterialIcons name="verified" size={12} color="#FFFFFF" />
                </View>
              </View>

              <Typography variant="h3" color={theme.colors.textPrimary} align="center" style={styles.userName}>
                {getDisplayValue('Full Name', profileName)}
              </Typography>

              <View style={styles.memberPill}>
                <MaterialIcons name="workspace-premium" size={14} color="#8B5E00" />
                <Typography variant="caption" weight="bold" color="#8B5E00" style={styles.memberPillText}>
                  {memberLabel}
                </Typography>
              </View>
            </Card>

            <View style={styles.sectionGroup}>
              <Typography variant="h3" weight="bold" style={styles.sectionHeading}>
                Account Settings
              </Typography>

              <View style={styles.menuStack}>
                <Card style={styles.infoCard}>
                  <View style={styles.sectionLabelRow}>
                    <MaterialIcons name="person-outline" size={22} color="#9A6A10" />
                    <Typography variant="body" weight="bold" style={styles.sectionLabel}>
                      PERSONAL INFORMATION
                    </Typography>
                  </View>

                  <InfoRow label="Full Name" value={profileName} />
                  <InfoRow label="Email" value={profileEmail} />
                  <InfoRow label="Phone" value={profilePhone} />
                </Card>

                <Card style={styles.addressCard}>
                  <View style={styles.sectionLabelRow}>
                    <MaterialIcons name="location-on" size={22} color="#9A6A10" />
                    <Typography variant="body" weight="bold" style={styles.sectionLabel}>
                      PRIMARY ADDRESS
                    </Typography>
                  </View>

                  <Typography variant="h3" color={theme.colors.textPrimary} style={styles.addressValue}>
                    {getDisplayValue('Primary Address', profileAddress)}
                  </Typography>
                </Card>

                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/profile/edit')} activeOpacity={0.86}>
                  <View style={styles.actionLeft}>
                    <MaterialIcons name="edit" size={22} color="#9A6A10" />
                    <Typography variant="body" weight="bold" color={theme.colors.textPrimary} style={styles.actionTitle}>
                      Edit Profile
                    </Typography>
                  </View>
                  <MaterialIcons name="chevron-right" size={28} color="#8B6A45" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/profile/settings')} activeOpacity={0.86}>
                  <View style={styles.actionLeft}>
                    <MaterialIcons name="lock-outline" size={22} color="#9A6A10" />
                    <Typography variant="body" weight="bold" color={theme.colors.textPrimary} style={styles.actionTitle}>
                      Change Password
                    </Typography>
                  </View>
                  <MaterialIcons name="chevron-right" size={28} color="#8B6A45" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionGroup}>
              <Typography variant="h3" weight="bold" style={styles.sectionHeading}>
                Support
              </Typography>

              <View style={styles.supportCard}>
                <SupportRow
                  icon="help-outline"
                  title="Help Center"
                  onPress={() => router.push('/more/faqs')}
                />
                <View style={styles.supportDivider} />
                <SupportRow
                  icon="policy"
                  title="Privacy Policy"
                  onPress={() => router.push('/more/terms-privacy')}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.logoutPill} onPress={handleLogoutPress} activeOpacity={0.86}>
              <MaterialIcons name="logout" size={20} color="#B91C1C" />
              <Typography variant="body" weight="bold" color="#B91C1C" style={styles.logoutText}>
                Logout
              </Typography>
            </TouchableOpacity>
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
              Please log in to manage your personal details, address, and support preferences.
            </Typography>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} activeOpacity={0.86}>
              <MaterialIcons name="login" size={20} color="#000000" />
              <Typography variant="body" weight="bold" color="#000000" style={styles.loginButtonText}>
                Sign In
              </Typography>
            </TouchableOpacity>
          </View>
        )}
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
    paddingVertical: theme.spacing.lg,
  },
  pageContent: {
    flexGrow: 1,
  },
  authenticatedContent: {
    gap: theme.spacing.lg,
  },
  profileHeroCard: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 34,
    paddingBottom: 28,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DDE7F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#E5E7EB',
    borderWidth: 5,
    borderColor: '#F59E0B',
  },
  memberBadgeDot: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A36B00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontFamily: theme.typography.fontFamilies.bold,
    marginBottom: 12,
    fontSize: 24,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F6DAB4',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  memberPillText: {
    fontSize: 13,
  },
  sectionGroup: {
    gap: 14,
  },
  sectionHeading: {
    color: '#5B4636',
    fontSize: 22,
    lineHeight: 28,
  },
  menuStack: {
    width: '100%',
    gap: 16,
  },
  infoCard: {
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionLabel: {
    color: '#9A6A10',
    letterSpacing: 0.6,
    fontSize: 14,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: 13,
  },
  infoValue: {
    color: '#1F1F1F',
    fontSize: 17,
    lineHeight: 22,
  },
  addressCard: {
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  addressValue: {
    fontSize: 18,
    lineHeight: 26,
  },
  actionCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
  },
  supportCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
  },
  supportRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  supportTitle: {
    color: '#1F1F1F',
    fontSize: 14,
  },
  supportDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 16,
  },
  logoutPill: {
    width: '100%',
    minHeight: 66,
    borderRadius: 18,
    backgroundColor: '#FBD7D3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
  },
  unauthenticatedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: 200,
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
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loginButtonText: {
    fontSize: 15,
  },
});

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Typography variant="caption" style={styles.infoLabel}>
        {label}
      </Typography>
      <Typography variant="body" style={styles.infoValue}>
        {getDisplayValue(label, value)}
      </Typography>
    </View>
  );
}

function getDisplayValue(label: string, value: string) {
  const trimmed = value.trim();
  if (trimmed) return trimmed;
  return `Add ${label.toLowerCase()} by editing profile`;
}

function SupportRow({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.supportRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.supportLeft}>
        <MaterialIcons name={icon} size={22} color="#5E5E5E" />
        <Typography variant="body" style={styles.supportTitle}>
          {title}
        </Typography>
      </View>
      <MaterialIcons name="open-in-new" size={18} color="#8B6A45" />
    </TouchableOpacity>
  );
}
