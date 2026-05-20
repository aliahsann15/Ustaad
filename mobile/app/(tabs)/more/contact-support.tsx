import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../../constants/theme';
import { Typography } from '../../../components/Typography';
import { Header } from '../../../components/Header';
import { Page } from '../../../components/Page';

type SupportAction = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const SUPPORT_ACTIONS: SupportAction[] = [
  {
    key: 'chat',
    title: 'Chat with us',
    subtitle: 'Quick response for active bookings',
    icon: 'chat-bubble-outline',
  },
  {
    key: 'email',
    title: 'Email Support',
    subtitle: 'For detailed queries and feedback',
    icon: 'email',
  },
  {
    key: 'call',
    title: 'Call Helpline',
    subtitle: 'Speak with our team 24/7',
    icon: 'call',
  },
];

export default function ContactSupportScreen() {
  const router = useRouter();

  return (
    <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
      <Header title="Contact Customer Support" isSubScreen onBackPress={() => router.replace('/more')} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Typography variant="h1" weight="bold" align="center" style={styles.title}>
            How can we help?
          </Typography>
          <Typography variant="body" align="center" color={theme.colors.textSecondary} style={styles.subtitle}>
            Our dedicated team is here to ensure your experience with Ustaad is seamless and professional.
          </Typography>
        </View>

        <View style={styles.actions}>
          {SUPPORT_ACTIONS.map((action) => (
            <TouchableOpacity key={action.key} style={styles.actionCard} activeOpacity={0.85}>
              <View style={styles.iconWrap}>
                <MaterialIcons name={action.icon} size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Typography variant="body" weight="bold" style={styles.actionTitle}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color={theme.colors.textSecondary}>
                  {action.subtitle}
                </Typography>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
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
  },
  hero: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.xs,
  },
  actions: {
    gap: theme.spacing.md,
  },
  actionCard: {
    minHeight: 92,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF3E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
});