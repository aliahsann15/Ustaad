import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Typography } from './Typography';

interface HeaderProps {
  title: string;
  isSubScreen?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isSubScreen = false, onBackPress }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { marginTop: Math.max(insets.top, 12) + 8 }]}>
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
    backgroundColor: theme.colors.navBackground,
    borderRadius: 28, // Premium capsule shape
    marginHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
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
