import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../../constants/theme';
import { Typography } from '../../../components/Typography';
import { Header } from '../../../components/Header';
import { Page } from '../../../components/Page';

type LanguageOption = {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
  rtl?: boolean;
};

const OPTIONS: LanguageOption[] = [
  {
    id: 'en',
    label: 'English',
    subtitle: 'Global Standard',
    icon: '🇬🇧',
    backgroundColor: '#F5F7FB',
    iconColor: '#1C1C1E',
  },
  {
    id: 'ur',
    label: 'اردو',
    subtitle: 'پاکستان کی قومی زبان',
    icon: '🇵🇰',
    backgroundColor: '#F3F7FA',
    iconColor: '#1C1C1E',
    rtl: true,
  },
];

export default function ChangeLanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const selectedOption = useMemo(
    () => OPTIONS.find((option) => option.id === selectedLanguage) ?? OPTIONS[0],
    [selectedLanguage]
  );

  const handleSelect = (optionId: string) => {
    setSelectedLanguage(optionId);
  };

  const handleBackPress = () => {
    router.replace('/more');
  };

  return (
    <Page scroll style={styles.container} contentContainerStyle={styles.pageContent}>
      <Header title="Change Language" isSubScreen onBackPress={handleBackPress} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Typography variant="h1" weight="bold" style={styles.urduTitle}>
            Select a language
          </Typography>
          <Typography variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            Choose your preferred language for a better experience with Ustaad.
          </Typography>
        </View>

        <View style={styles.optionsList}>
          {OPTIONS.map((option) => {
            const isSelected = selectedOption.id === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelect(option.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.flagWrap, { backgroundColor: option.backgroundColor }]}>
                  <Typography style={styles.flagEmoji}>{option.icon}</Typography>
                </View>

                <View style={styles.optionTextBlock}>
                  <Typography
                    variant="body"
                    weight="bold"
                    style={[styles.optionTitle, option.rtl && styles.optionTitleRtl]}
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.textSecondary}
                    style={[styles.optionSubtitle, option.rtl && styles.optionSubtitleRtl]}
                  >
                    {option.subtitle}
                  </Typography>
                </View>

                <View style={[styles.checkWrap, isSelected && styles.checkWrapSelected]}>
                  {isSelected ? (
                    <MaterialIcons name="check" size={24} color={theme.colors.primary} />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.supportCard}>
          <View style={styles.supportIconWrap}>
            <MaterialIcons name="info-outline" size={18} color="#8B5E00" />
          </View>
          <View style={styles.supportTextBlock}>
            <Typography variant="body" weight="bold" color="#8B5E00" style={styles.supportTitle}>
              Bilingual Support
            </Typography>
            <Typography variant="caption" color="#8B5E00" style={styles.supportSubtitle}>
              Changing the language will update the entire interface, including service names and provider descriptions.
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
    gap: theme.spacing.md,
  },
  hero: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  urduTitle: {
    fontSize: 28,
    lineHeight: 34,
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  optionsList: {
    gap: theme.spacing.md,
  },
  optionCard: {
    minHeight: 88,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D7E0EA',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  flagWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  flagEmoji: {
    fontSize: 30,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: '#1C1C1E',
  },
  optionTitleRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
  optionSubtitleRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  checkWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#D8E1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  checkWrapSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF1DB',
  },
  supportCard: {
    borderRadius: 16,
    backgroundColor: '#FFF4E4',
    borderWidth: 1,
    borderColor: '#FFD8A8',
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  supportIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  supportTextBlock: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 15,
    lineHeight: 20,
    color: '#8B5E00',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#8B5E00',
  },
});
