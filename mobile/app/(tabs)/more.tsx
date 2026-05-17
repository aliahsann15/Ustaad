import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Header title="More" />
      <View style={styles.content}>
        <Typography variant="body" color={theme.colors.textSecondary}>
          Settings, Help, and Legal information.
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
