import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { theme } from '../../../constants/theme';
import { Typography } from '../../../components/Typography';
import { Header } from '../../../components/Header';
import { Page } from '../../../components/Page';

type FaqItem = {
	id: string;
	title: string;
	answer: string;
};

type FaqSection = {
	id: string;
	label: string;
	icon: keyof typeof MaterialIcons.glyphMap;
	items: FaqItem[];
};

const FAQ_SECTIONS: FaqSection[] = [
	{
		id: 'booking',
		label: 'Booking',
		icon: 'event-available',
		items: [
			{
				id: 'booking-1',
				title: 'How do I book a professional?',
				answer:
					'Simply search for the service you need, choose a highly-rated professional, and select an available time slot that works best for you.',
			},
			{
				id: 'booking-2',
				title: 'Can I cancel my booking?',
				answer:
					'Yes, cancellations are free up to 24 hours before the service. Later cancellations may incur a small convenience fee to compensate the professional.',
			},
		],
	},
	{
		id: 'payments',
		label: 'Payments',
		icon: 'payments',
		items: [
			{
				id: 'payments-1',
				title: 'What payment methods are accepted?',
				answer:
					'We accept all major credit cards, debit cards, and popular digital wallets. You can also pay via Ustaad Credits for instant checkout.',
			},
		],
	},
	{
		id: 'account',
		label: 'Account',
		icon: 'account-circle',
		items: [
			{
				id: 'account-1',
				title: 'How do I reset my password?',
				answer:
					"Go to Profile > Settings > Security and select 'Change Password'. We will send a verification code to your registered mobile number.",
			},
		],
	},
];

function FaqAccordion({
	title,
	answer,
	expanded,
	onPress,
}: {
	title: string;
	answer: string;
	expanded: boolean;
	onPress: () => void;
}) {
	const [contentHeight, setContentHeight] = useState(0);
	const progress = useSharedValue(expanded ? 1 : 0);
	const arrowProgress = useSharedValue(expanded ? 1 : 0);

	useEffect(() => {
		progress.value = withTiming(expanded ? 1 : 0, {
			duration: 280,
			easing: Easing.out(Easing.cubic),
		});
		arrowProgress.value = withTiming(expanded ? 1 : 0, {
			duration: 280,
			easing: Easing.out(Easing.cubic),
		});
	}, [arrowProgress, expanded, progress]);

	const bodyStyle = useAnimatedStyle(() => ({
		height: contentHeight * progress.value,
		opacity: progress.value,
	}));

	const arrowStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${arrowProgress.value * 180}deg` }],
	}));

	return (
		<TouchableOpacity
			style={[styles.accordionCard, expanded && styles.accordionCardExpanded]}
			activeOpacity={0.9}
			onPress={onPress}
		>
			<View style={styles.accordionHeader}>
				<Typography variant="body" weight="bold" style={styles.accordionTitle}>
					{title}
				</Typography>
				<Animated.View style={arrowStyle}>
					<MaterialIcons name="keyboard-arrow-down" size={26} color={theme.colors.textSecondary} />
				</Animated.View>
			</View>

			<Animated.View style={[styles.accordionBodyContainer, bodyStyle]}>
				<View
					onLayout={(event) => {
						const measuredHeight = event.nativeEvent.layout.height;
						if (measuredHeight !== contentHeight) {
							setContentHeight(measuredHeight);
						}
					}}
					style={styles.accordionBodyMeasure}
				>
					<Typography variant="body" color={theme.colors.textSecondary} style={styles.accordionBody}>
						{answer}
					</Typography>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
}

export default function FaqsScreen() {
	const router = useRouter();
	const [activeFaqId, setActiveFaqId] = useState<string | null>('booking-1');

	return (
		<Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
			<Header title="FAQs" isSubScreen onBackPress={() => router.replace('/more')} />

			<View style={styles.content}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={22} color={theme.colors.textSecondary} />
					<Typography variant="body" color={theme.colors.textSecondary} style={styles.searchPlaceholder}>
						How can we help you today?
					</Typography>
				</View>

				<View style={styles.sections}>
					{FAQ_SECTIONS.map((section) => (
						<View key={section.id} style={styles.sectionBlock}>
							<View style={styles.sectionLabelRow}>
								<MaterialIcons name={section.icon} size={16} color={theme.colors.textSecondary} />
								<Typography variant="body" weight="medium" style={styles.sectionLabel}>
									{section.label}
								</Typography>
							</View>

							<View style={styles.faqList}>
								{section.items.map((item, index) => (
									<FaqAccordion
										key={item.id}
										title={item.title}
										answer={item.answer}
										expanded={activeFaqId === item.id}
										onPress={() => {
											setActiveFaqId((current) => (current === item.id ? null : item.id));
										}}
									/>
								))}
							</View>
						</View>
					))}
				</View>

				<TouchableOpacity
					style={styles.supportButton}
					onPress={() => router.push('/more/contact-support')}
					activeOpacity={0.85}
				>
					<MaterialIcons name="support-agent" size={20} color="#FFFFFF" />
					<Typography variant="body" weight="bold" color="#FFFFFF" style={styles.supportButtonLabel}>
						Contact Support
					</Typography>
				</TouchableOpacity>
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
        paddingVertical: theme.spacing.sm,
	},
	searchBox: {
		height: 54,
		borderRadius: 27,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E2E8F0',
		paddingHorizontal: theme.spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 2,
	},
	searchPlaceholder: {
		fontSize: 15,
		flex: 1,
	},
	sections: {
		gap: theme.spacing.lg,
	},
	sectionBlock: {
		gap: theme.spacing.sm,
	},
	sectionLabelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
		paddingLeft: theme.spacing.xs,
	},
	sectionLabel: {
		color: theme.colors.textPrimary,
		fontSize: 16,
	},
	faqList: {
		gap: theme.spacing.md,
	},
	accordionCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#E2E8F0',
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.md,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 6,
		elevation: 2,
	},
	accordionCardExpanded: {
		borderColor: '#D6E3F3',
	},
	accordionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: theme.spacing.sm,
	},
	accordionTitle: {
		flex: 1,
		fontSize: 16,
		color: theme.colors.textPrimary,
		lineHeight: 22,
	},
	accordionBody: {
		marginTop: theme.spacing.md,
		fontSize: 14,
		lineHeight: 22,
	},
	accordionBodyContainer: {
		overflow: 'hidden',
	},
	accordionBodyMeasure: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
	},
	supportButton: {
		height: 54,
		borderRadius: 27,
		backgroundColor: theme.colors.primary,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.xs,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 4,
	},
	supportButtonLabel: {
		fontSize: 15,
	},
});