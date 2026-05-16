import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h2" color={theme.colors.textPrimary}>Recent Activity</Typography>
        <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.md }}>
          No recent bookings.
        </Typography>
      </View>
    </SafeAreaView>
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
  },
});
