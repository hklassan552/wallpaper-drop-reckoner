/**
 * NORDIC_MINIMAL preset copy with the brief's plum/teal accent overrides.
 * The `name` field MUST stay exactly as in preset.ts.
 */
import { Platform } from 'react-native';

export const SERIF = Platform.select({ android: 'serif', default: 'Georgia' }) as string;
export const SANS = Platform.select({ android: 'sans-serif', default: 'System' }) as string;
export const SANS_MEDIUM = Platform.select({
  android: 'sans-serif-medium',
  default: 'System',
}) as string;

export const theme = {
  name: 'nordic-minimal',

  colors: {
    bg: '#FBF4F4',
    bgDeep: '#F2E6EB',
    surface: '#FFFFFF',
    surfaceAlt: '#F7EEF1',
    secondary: '#E9D5DF',
    primary: '#7D3C6F',
    primaryDeep: '#5E2B53',
    accent: '#2FA79B',
    accentSoft: '#7FE8C5',
    text: '#2C1E29',
    textSecondary: '#6B5A66',
    textMuted: '#9A8B95',
    danger: '#C0564E',
    inkOverlay: 'rgba(44,30,41,0.93)',
    onPrimary: '#FBF4F4',
  },

  gradients: {
    loader: ['rgba(44,30,41,0.93)', 'rgba(125,60,111,0.88)', 'rgba(44,30,41,0.95)'],
    menu: ['rgba(251,244,244,0.95)', 'rgba(247,238,241,0.93)', 'rgba(233,213,223,0.96)'],
    game: ['rgba(251,244,244,0.96)', 'rgba(242,230,235,0.94)'],
    order: ['rgba(251,244,244,0.96)', 'rgba(242,230,235,0.95)'],
    report: ['rgba(242,230,235,0.95)', 'rgba(251,244,244,0.95)', 'rgba(233,213,223,0.96)'],
    cta: ['#7D3C6F', '#5E2B53'],
    progress: ['#2FA79B', '#7FE8C5'],
  },

  typography: {
    hero: { fontFamily: SERIF, fontSize: 64, fontWeight: '700' as const, letterSpacing: -1 },
    display: { fontFamily: SERIF, fontSize: 42, fontWeight: '700' as const, letterSpacing: 1 },
    title: { fontFamily: SERIF, fontSize: 30, fontWeight: '700' as const, letterSpacing: 1 },
    section: { fontFamily: SERIF, fontSize: 18, fontWeight: '600' as const, letterSpacing: 0.2 },
    body: { fontFamily: SANS, fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.1 },
    value: { fontFamily: SANS, fontSize: 16, fontWeight: '700' as const, letterSpacing: 0.2 },
    button: { fontFamily: SANS, fontSize: 15, fontWeight: '700' as const, letterSpacing: 1.4 },
    caption: { fontFamily: SANS, fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.6 },
    micro: { fontFamily: SANS, fontSize: 10, fontWeight: '600' as const, letterSpacing: 2 },
  },

  radius: { sm: 8, md: 12, lg: 18, xl: 24, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#7D3C6F',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    cta: {
      shadowColor: '#7D3C6F',
      shadowOpacity: 0.34,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 7,
    },
    panel: {
      shadowColor: '#7D3C6F',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -6 },
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
export default theme;
