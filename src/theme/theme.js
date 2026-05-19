import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
    secondary: { main: '#7C3AED', light: '#8B5CF6', dark: '#6D28D9' },
    success: { main: '#10B981', light: '#34D399' },
    warning: { main: '#F59E0B', light: '#FCD34D' },
    error: { main: '#EF4444', light: '#F87171' },
    info: { main: '#06B6D4', light: '#22D3EE' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, color: '#64748B' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226,232,240,0.8)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 8, height: 6 } },
    },
  },
});

export default theme;
