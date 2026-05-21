import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme';
import { Typography } from '../components/Typography';
import { Header } from '../components/Header';
import { Page } from '../components/Page';

const PROFILE_IMAGE_URI = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';

const STATS = [
  { key: 'rating', value: '4.8', label: 'Rating', icon: 'star' as const },
  { key: 'jobs', value: '150+', label: 'Jobs Done', icon: 'work' as const },
  { key: 'response', value: '15 mins', label: 'Response', icon: 'schedule' as const },
];

const SPECIALIZATIONS = ['Water Tank Repair', 'Tap Installation', 'Pipe Leakage', 'Drain Cleaning'];

export default function ProviderProfileScreen() {
  const router = useRouter();

  return (
    <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
      <Header title="Provider Profile" isSubScreen onBackPress={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: PROFILE_IMAGE_URI }} style={styles.avatar} contentFit="cover" />

            <View style={styles.badgeBubble}>
              <MaterialIcons name="verified" size={16} color="#8B5E00" />
            </View>
          </View>

          <Typography variant="h2" weight="bold" align="center" style={styles.name}>
            Asif Plumber
          </Typography>
          <Typography variant="body" weight="bold" align="center" style={styles.role}>
            EXPERT SANITATION SPECIALIST
          </Typography>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            {STATS.map((stat, index) => (
              <React.Fragment key={stat.key}>
                <View style={styles.statItem}>
                  <View style={styles.statValueRow}>
                    <MaterialIcons name={stat.icon} size={16} color="#A16207" />
                    <Typography variant="body" weight="bold" style={styles.statValue}>
                      {stat.value}
                    </Typography>
                  </View>
                  <Typography variant="caption" color={theme.colors.textSecondary} align="center" style={styles.statLabel}>
                    {stat.label}
                  </Typography>
                </View>

                {index < STATS.length - 1 ? <View style={styles.statDivider} /> : null}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Specializations
          </Typography>

          <View style={styles.chipWrap}>
            {SPECIALIZATIONS.map((item) => (
              <View key={item} style={styles.chip}>
                <Typography variant="body" weight="bold" style={styles.chipText}>
                  {item}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contactCard}>
          <Typography variant="h3" weight="bold" style={styles.cardTitle}>
            Contact Information
          </Typography>

          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <MaterialIcons name="call" size={22} color="#A16207" />
            </View>
            <View style={styles.contactTextWrap}>
              <Typography variant="caption" color={theme.colors.textSecondary} style={styles.contactLabel}>
                Phone Number
              </Typography>
              <Typography variant="body" weight="bold" style={styles.contactValue}>
                +92 300 9876543
              </Typography>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <MaterialIcons name="email" size={22} color="#A16207" />
            </View>
            <View style={styles.contactTextWrap}>
              <Typography variant="caption" color={theme.colors.textSecondary} style={styles.contactLabel}>
                Email Address
              </Typography>
              <Typography variant="body" weight="bold" style={styles.contactValue}>
                asif.plumber@ustaad.com
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Typography variant="h3" weight="bold" style={styles.aboutTitle}>
            About Asif
          </Typography>

          <Typography variant="body" color={theme.colors.textSecondary} style={styles.aboutBody}>
            With over 12 years of experience in high-end residential plumbing, I provide reliable, quick-response services across the metropolitan area. Committed to quality parts and transparent pricing.
          </Typography>
        </View>

        <View style={styles.footerActionWrap}>
          <View style={styles.bookButton}>
            <MaterialIcons name="event" size={22} color="#5F3F00" />
            <Typography variant="body" weight="bold" style={styles.bookButtonText}>
              Book Now
            </Typography>
          </View>
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
  pageContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#DDE7F1',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 18,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  avatarWrap: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 5,
    borderColor: '#F59E0B',
    overflow: 'visible',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
    backgroundColor: '#E2E8F0',
  },
  badgeBubble: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FBBF24',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
  },
  role: {
    marginTop: 4,
    color: '#6B5B4E',
    letterSpacing: 0.8,
    fontSize: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E7EDF4',
    marginVertical: theme.spacing.md,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 19,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8EDF3',
  },
  sectionBlock: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9BE97',
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: '#2D2D2D',
    fontSize: 15,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE7F1',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 21,
    lineHeight: 27,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactValue: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 1,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE7F1',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  aboutTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 26,
  },
  aboutBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  footerActionWrap: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  bookButton: {
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: '#F7A810',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#D38A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  bookButtonText: {
    color: '#5F3F00',
    fontSize: 16,
  },
});