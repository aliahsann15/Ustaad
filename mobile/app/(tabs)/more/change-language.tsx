import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ChangeLanguageScreen() {
  const router = useRouter();
  const languages = ['English', 'Hindi', 'Spanish', 'Arabic'];
  const selectLanguage = (lang: string) => {
    // TODO: implement language change logic
    console.log('Selected language', lang);
    router.back();
  };
  return (
    <View style={styles.container}>
      <Header title="Change Language" />
      <View style={styles.listContainer}>
        {languages.map((lang) => (
          <TouchableOpacity key={lang} style={styles.row} onPress={() => selectLanguage(lang)} activeOpacity={0.8}>
            <MaterialIcons name="language" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>
              {lang}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    width: '100%',
    padding: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  rowLabel: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.textPrimary,
  },
});
