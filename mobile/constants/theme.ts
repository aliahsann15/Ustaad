export const theme = {
  colors: {
    // 60% Dominant (Clean, modern canvas)
    background: '#F8FAFC',
    card: '#FFFFFF',
    
    // 30% Secondary (Trust, stability, text)
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    navBackground: '#1E293B',
    
    // 10% Accent (Energy, action, urgency)
    primary: '#F59E0B',
    primaryHover: '#D97706',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  typography: {
    fontFamilies: {
      regular: 'System', // Will use Inter/System font
      medium: 'System',
      bold: 'System',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    }
  }
};
