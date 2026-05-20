import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../../constants/theme';
import { Typography } from '../../../components/Typography';
import { Header } from '../../../components/Header';
import { Page } from '../../../components/Page';

// const SOCIAL_ACTIONS = [
//   { key: 'web', icon: 'language' as const },
//   { key: 'share', icon: 'share' as const },
//   { key: 'email', icon: 'email' as const },
// ];


export default function AboutUstaadScreen() {
    const router = useRouter();

    return (
        <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
            <Header title="About Ustaad App" isSubScreen onBackPress={() => router.replace('/more')} />

            <View style={styles.content}>
                <View style={styles.hero}>
                    <View style={styles.logoWrap}>
                        <Image source={require('../../../assets/logomark.png')} style={styles.logoImage} contentFit="cover" />
                    </View>

                    <Typography variant="h1" weight="bold" align="center" style={styles.title}>
                        Ustaad
                    </Typography>
                    <Typography variant="body" color={theme.colors.textSecondary} align="center" style={styles.version}>
                        Version {process.env.EXPO_PUBLIC_APP_VERSION} (Build {process.env.EXPO_PUBLIC_APP_BUILD})
                    </Typography>
                </View>

                <View style={styles.missionCard}>
                    <View style={styles.missionTag}>
                        <MaterialIcons name="auto-awesome" size={14} color={theme.colors.primary} />
                        <Typography variant="caption" weight="bold" style={styles.missionTagText}>
                            OUR MISSION
                        </Typography>
                    </View>

                    <Typography variant="h3" weight="bold" style={styles.missionTitle}>
                        Connecting the best talent with your home needs.
                    </Typography>

                    <Typography variant="body" color={theme.colors.textSecondary} style={styles.missionBody}>
                        Ustaad is more than an app; it&apos;s a bridge to reliability. We meticulously vet every expert on our platform to ensure your plumbing, electrical, and maintenance needs are met with institutional trust and professional excellence.
                    </Typography>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statCard, styles.statDarkCard]}>
                        <MaterialIcons name="verified-user" size={26} color="#F59E0B" />
                        <Typography variant="h2" weight="bold" style={[styles.statValue, styles.statDarkText]}>
                            50k+
                        </Typography>
                        <Typography variant="body" weight="bold" style={[styles.statLabel, styles.statDarkText]}>
                            Verified Experts
                        </Typography>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialIcons name="sentiment-satisfied-alt" size={26} color="#6B7280" />
                        <Typography variant="h2" weight="bold" style={styles.statValue}>
                            4.9/5
                        </Typography>
                        <Typography variant="body" weight="bold" style={styles.statLabel}>
                            User Rating
                        </Typography>
                    </View>
                </View>

                {/* <View style={styles.followBlock}>
          <Typography variant="body" weight="bold" style={styles.followTitle}>
            Follow our journey
          </Typography>

          <View style={styles.socialRow}>
            {SOCIAL_ACTIONS.map((action) => (
              <TouchableOpacity key={action.key} style={styles.socialButton} activeOpacity={0.8}>
                <MaterialIcons name={action.icon} size={22} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

                <View style={styles.linksList}>
                    <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={() => router.push("/more/terms-privacy")}>
                        <Typography variant="body" color={theme.colors.textPrimary}>
                            Terms & Privacy Policy
                        </Typography>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Typography variant="caption" color={theme.colors.textSecondary} align="center" style={styles.footerText}>
                        © 2024 Ustaad Technologies Inc.
                    </Typography>
                    <Typography variant="caption" color={theme.colors.textSecondary} align="center" style={styles.footerTextItalic}>
                        Crafted with precision.
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
        gap: theme.spacing.lg,
    },
    hero: {
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingTop: theme.spacing.xs,
    },
    logoWrap: {
        marginTop: theme.spacing.sm,
    },
    logoImage: {
        width: 72,
        height: 72,
    },
    title: {
        fontSize: 28,
        lineHeight: 34,
        color: theme.colors.textPrimary,
    },
    version: {
        fontSize: 15,
        lineHeight: 21,
    },
    missionCard: {
        backgroundColor: '#FFF8F0',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E9EEF5',
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    missionTag: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FAE6C4',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    missionTagText: {
        color: '#8B5E00',
        fontSize: 12,
        letterSpacing: 0.4,
    },
    missionTitle: {
        color: theme.colors.textPrimary,
        fontSize: 24,
        lineHeight: 31,
    },
    missionBody: {
        fontSize: 15,
        lineHeight: 23,
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    statCard: {
        flex: 1,
        minHeight: 150,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: theme.spacing.md,
        justifyContent: 'flex-end',
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    statDarkCard: {
        backgroundColor: '#2F3338',
        borderColor: '#2F3338',
    },
    statValue: {
        fontSize: 32,
        lineHeight: 38,
        color: theme.colors.textPrimary,
    },
    statLabel: {
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.textPrimary,
    },
    statDarkText: {
        color: '#FFFFFF',
    },
    followBlock: {
        gap: theme.spacing.md,
    },
    followTitle: {
        color: '#534434',
        fontSize: 16,
    },
    socialRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    socialButton: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 1,
    },
    linksList: {
        gap: 8,
    },
    linkRow: {
        height: 56,
        borderRadius: 14,
        // backgroundColor: '#F7F7F8',
        backgroundColor: theme.colors.card,
        paddingHorizontal: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footer: {
        alignItems: 'center',
        gap: 2,
        paddingTop: theme.spacing.xs,
    },
    footerText: {
        fontSize: 12,
    },
    footerTextItalic: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});