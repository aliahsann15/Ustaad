import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../../constants/theme';
import { Typography } from '../../../components/Typography';
import { Header } from '../../../components/Header';
import { Page } from '../../../components/Page';

const TERM_SECTIONS = [
  {
    number: '1.',
    title: 'ACCEPTANCE OF TERMS',
    body:
      'Ustaad provides a marketplace connecting service providers with customers. By accessing or using our services, you confirm that you can form a binding contract with Ustaad.',
  },
  {
    number: '2.',
    title: 'USER CONDUCT',
    body:
      'Users must provide accurate information and maintain the security of their account. Any fraudulent activity or harassment of service providers is strictly prohibited and will lead to immediate termination.',
  },
  {
    number: '3.',
    title: 'SERVICE STANDARDS',
    body:
      'All service requests are coordinated through our trusted provider network. We expect both customers and experts to communicate respectfully, confirm job details clearly, and follow agreed service timelines.',
  },
];

const PRIVACY_FEATURES = [
  {
    key: 'security',
    title: 'Data Security',
    body: 'We use industry-standard encryption to keep your data safe and private.',
    icon: 'shield' as const,
  },
  {
    key: 'transparency',
    title: 'Transparency',
    body: 'We never sell your personal data to third parties for marketing.',
    icon: 'visibility-off' as const,
  },
];

const COLLECTED_INFO = [
  'Account details (name, email, phone number)',
  'Location data for service matching',
  'Transaction history and service reviews',
  'Device information and app usage logs',
];

export default function TermsPrivacyScreen() {
  const router = useRouter();

  return (
    <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
      <Header title="Terms & Privacy Policy" isSubScreen onBackPress={() => router.replace('/more')} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Typography variant="h2" weight="bold" style={styles.cardTitle}>
            Terms of Service
          </Typography>

          <Typography variant="body" color={theme.colors.textSecondary} style={styles.intro}>
            Welcome to Ustaad. By using our platform, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
          </Typography>

          <View style={styles.sectionList}>
            {TERM_SECTIONS.map((section) => (
              <View key={section.title} style={styles.termBlock}>
                <Typography variant="body" weight="bold" style={styles.termHeading}>
                  {section.number} {section.title}
                </Typography>
                <Typography variant="body" color={theme.colors.textSecondary} style={styles.termBody}>
                  {section.body}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Typography variant="h2" weight="bold" style={styles.cardTitle}>
            Privacy Policy
          </Typography>

          <Typography variant="body" color={theme.colors.textSecondary} style={styles.intro}>
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information within the Ustaad ecosystem.
          </Typography>

          <View style={styles.featureList}>
            {PRIVACY_FEATURES.map((feature) => (
              <View key={feature.key} style={styles.featureCard}>
                <MaterialIcons name={feature.icon} size={26} color={theme.colors.primary} />
                <View style={styles.featureText}>
                  <Typography variant="body" weight="bold" style={styles.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.textSecondary} style={styles.featureBody}>
                    {feature.body}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          <Typography variant="body" weight="bold" style={styles.collectHeading}>
            INFORMATION WE COLLECT
          </Typography>

          <View style={styles.bulletList}>
            {COLLECTED_INFO.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <TextBullet />
                <Typography variant="body" color={theme.colors.textPrimary} style={styles.bulletText}>
                  {item}
                </Typography>
              </View>
            ))}
          </View>

          <Typography variant="body" color={theme.colors.textSecondary} style={styles.lastUpdated}>
            <Typography variant="body" color={theme.colors.textSecondary} style={styles.lastUpdatedItalic}>
              Last updated: October 2023.
            </Typography>{' '}
            We reserve the right to update these policies at any time. Significant changes will be notified via app alerts.
          </Typography>
        </View>

        <View style={styles.supportButtonWrap}>
          <View style={styles.supportButton}>
            <MaterialIcons name="support-agent" size={20} color="#7A4A00" />
            <Typography variant="body" weight="bold" color="#7A4A00" style={styles.supportButtonLabel}>
              Contact Legal Support
            </Typography>
          </View>
        </View>
      </View>
    </Page>
  );
}

function TextBullet() {
  return <View style={styles.bulletDot} />;
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
    paddingTop: theme.spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6EDF5',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.textPrimary,
  },
  intro: {
    fontSize: 15,
    lineHeight: 23,
  },
  sectionList: {
    gap: theme.spacing.lg,
  },
  termBlock: {
    gap: 8,
  },
  termHeading: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textPrimary,
    letterSpacing: 0.2,
  },
  termBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  featureList: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  featureCard: {
    minHeight: 84,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4C9A2',
    backgroundColor: '#F7F7F8',
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  featureBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  collectHeading: {
    marginTop: theme.spacing.xs,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textPrimary,
    letterSpacing: 0.4,
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.textPrimary,
    marginTop: 8,
    marginLeft: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  lastUpdatedItalic: {
    fontStyle: 'italic',
  },
  supportButtonWrap: {
    paddingTop: theme.spacing.xs,
  },
  supportButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  supportButtonLabel: {
    color: '#000000',
    fontSize: 15,
  },
});