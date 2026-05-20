import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { Typography } from '../../components/Typography';
import { theme } from '../../constants/theme';

export default function ChangeLanguageScreen() {
  return (
    <View style={styles.container}>
      <Header title="Change Language" />
      <View style={styles.content}>
        <Typography variant="body" color={theme.colors.textPrimary}>
          Language selection will be implemented here.
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
