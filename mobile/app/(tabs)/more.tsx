import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function MoreScreen() {
  const router = useRouter();
  const navigate = (path: string) => () => router.push(path);

  return (
    <View style={styles.container}>
      <Header title="More" />
      <View style={styles.content}>
        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.row} onPress={navigate('/more/change-language')} activeOpacity={0.8}>
            <MaterialIcons name="language" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>Change Language</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={navigate('/more/contact-support')} activeOpacity={0.8}>
            <MaterialIcons name="support-agent" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>Contact Customer Support</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={navigate('/more/help-center')} activeOpacity={0.8}>
            <MaterialIcons name="help-outline" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>Help Center / FAQs</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={navigate('/more/about')} activeOpacity={0.8}>
            <MaterialIcons name="info" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>About Ustaad App</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={navigate('/more/terms-privacy')} activeOpacity={0.8}>
            <MaterialIcons name="description" size={24} color={theme.colors.textSecondary} />
            <Typography variant="body" color={theme.colors.textPrimary} style={styles.rowLabel}>Terms & Privacy Policy</Typography>
          </TouchableOpacity>
        </View>
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
  },
  listContainer: {
    width: '100%',
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
