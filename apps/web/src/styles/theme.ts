export const theme = {
  colors: {
    primary: '#4A6FA5',
    primaryHover: '#3A5F95',
    secondary: '#F5F0E8',
    background: '#FAFAF8',
    surface: '#FFFFFF',
    text: '#2C2C2C',
    textMuted: '#6B6B6B',
    border: '#E0DDD8',
    error: '#C0392B',
    success: '#27AE60',
  },
  fonts: {
    body: "'Noto Serif KR', 'Georgia', serif",
    heading: "'Noto Serif KR', 'Georgia', serif",
    mono: "'Courier New', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.10)',
    lg: '0 8px 24px rgba(0,0,0,0.12)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
} as const;

export type Theme = typeof theme;
