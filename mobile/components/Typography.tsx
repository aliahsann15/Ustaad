import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'bold';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = theme.colors.textPrimary,
  align = 'left',
  weight = 'regular',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles[variant],
        { color, textAlign: align },
        weight === 'bold' && styles.bold,
        weight === 'medium' && styles.medium,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: theme.typography.fontFamilies.bold,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamilies.medium,
    fontWeight: '600',
  },
  body: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
  },
  caption: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  bold: {
    fontWeight: 'bold',
  },
  medium: {
    fontWeight: '600',
  },
});
