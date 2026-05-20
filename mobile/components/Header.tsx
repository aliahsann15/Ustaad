import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Typography } from './Typography';

export const HEADER_HEIGHT = 56;
export const HEADER_VERTICAL_GAP = 8;
export const HEADER_MIN_TOP = 12;

interface HeaderProps {
  title: string;
  isSubScreen?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isSubScreen = false, onBackPress }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topOffset = Math.max(insets.top, HEADER_MIN_TOP) + HEADER_VERTICAL_GAP;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
      <View style={styles.content}>
        {isSubScreen ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
        <Typography 
          variant="h3" 
          color="#FFFFFF" 
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Typography>
        {isSubScreen ? <View style={styles.headerSpacer} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.navBackground,
    borderRadius: 28, // Premium capsule shape
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 36, // Keep title perfectly centered
  },
});
