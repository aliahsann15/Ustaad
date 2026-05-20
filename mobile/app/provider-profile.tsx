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

        <View style={styles.aboutCard}>
          <Typography variant="h3" weight="bold" style={styles.aboutTitle}>
            About Asif
          </Typography>

          <Typography variant="body" color={theme.colors.textSecondary} style={styles.aboutBody}>
            With over 12 years of experience in high-end residential plumbing, I provide reliable, quick-response services across the metropolitan area. Committed to quality parts and transparent pricing.
          </Typography>
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
    paddingBottom: theme.spacing.md,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E7EDF4',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  avatarWrap: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
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
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: theme.colors.card,
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
    backgroundColor: '#EEF2F7',
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
    gap: 4,
    paddingVertical: 2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
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
    fontSize: 21,
    lineHeight: 27,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8C5AE',
    backgroundColor: '#F4F1ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: '#2F2F2F',
    fontSize: 14,
  },
  aboutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7EDF4',
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
});