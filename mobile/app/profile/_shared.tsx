import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

type ProfileSectionScreenProps = {
  title: string;
  description: string;
};

export default function ProfileSectionScreen({ title, description }: ProfileSectionScreenProps) {
  const router = useRouter();

  return (
    <Page style={styles.container}>
      <Header title={title} isSubScreen onBackPress={() => router.back()} />
      <View style={styles.content}>
        <Typography variant="h1" align="center" color={theme.colors.textPrimary} style={styles.title}>
          {title}
        </Typography>
        <Typography variant="body" align="center" color={theme.colors.textSecondary} style={styles.description}>
          {description}
        </Typography>
        <Button title="Go Back" onPress={() => router.back()} style={styles.button} />
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
  },
  description: {
    maxWidth: 320,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.sm,
  },
});
