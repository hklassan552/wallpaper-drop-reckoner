import React, { memo } from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type ShellVariant = 'loader' | 'menu' | 'game' | 'order' | 'report';

type Props = { variant: ShellVariant; children: React.ReactNode };

const GRADIENTS: Record<ShellVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  order: theme.gradients.order,
  report: theme.gradients.report,
};

const DIRECTIONS: Record<ShellVariant, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  loader: { start: { x: 0.1, y: 0 }, end: { x: 0.9, y: 1 } },
  menu: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  game: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  order: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  report: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

/**
 * The single background image (bg_game) + a per-screen gradient overlay.
 * Loader is deliberately dark plum so it never reads as the blush Menu.
 */
function AppShellBase({ variant, children }: Props) {
  const dark = variant === 'loader';
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={GRADIENTS[variant]}
          start={DIRECTIONS[variant].start}
          end={DIRECTIONS[variant].end}
          style={StyleSheet.absoluteFill}
        />
        {dark ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.blobTeal} />
            <View style={styles.blobBlush} />
          </View>
        ) : (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.blobLight} />
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { flex: 1 },
  content: { flex: 1 },
  blobTeal: {
    position: 'absolute',
    top: -80,
    left: -90,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: 'rgba(47,167,155,0.18)',
  },
  blobBlush: {
    position: 'absolute',
    bottom: -60,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(233,213,223,0.12)',
  },
  blobLight: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(47,167,155,0.10)',
  },
});

export const AppShell = memo(AppShellBase);
export default AppShell;
