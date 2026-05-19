import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  size = 'md',
  textColor,
  style,
  disabled,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return '#1C1C1E'; // Charcoal text for high contrast on Amber background
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };
      case 'lg':
        return { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl };
      case 'md':
      default:
        return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor || getTextColor()} />
      ) : (
        <Typography weight="bold" color={textColor || getTextColor()} style={{ textAlign: 'center' }}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryContainer: {
    backgroundColor: theme.colors.navBackground,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
});
