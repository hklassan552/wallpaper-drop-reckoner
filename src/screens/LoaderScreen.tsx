import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';
import {
  FADE_MS,
  LOADER_BAR_MS,
  LOADER_DURATION_MS,
  SPRING_PLATE,
} from '../constants/config';
import AppShell from '../components/AppShell';
import DamaskMotif from '../components/DamaskMotif';

const BAR_W = 180;

type Props = { onDone: () => void };

/**
 * Dark plum splash - deliberately nothing like the blush Menu (rule #14).
 * No chips, no call-to-action button: brand plate, title, hairline, progress bar.
 */
export default function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const plate = useRef(new Animated.Value(0)).current;
  const plateScaleValue = useRef(new Animated.Value(0.88)).current;
  const title = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(plate, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(title, {
        toValue: 1,
        duration: 420,
        delay: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.spring(plateScaleValue, {
      toValue: 1,
      tension: SPRING_PLATE.tension,
      friction: SPRING_PLATE.friction,
      useNativeDriver: true,
    }).start();

    // width is a layout property -> useNativeDriver MUST be false here
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const exitAt = Math.max(0, LOADER_DURATION_MS - FADE_MS);
    const exitTimer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => done.current());
    }, exitAt);

    return () => clearTimeout(exitTimer);
  }, [bar, fade, plate, plateScaleValue, title]);

  const titleShift = title.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell variant="loader">
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <View style={styles.lattice} pointerEvents="none">
          <DamaskMotif
            rows={3}
            cols={4}
            size={18}
            gap={16}
            color="rgba(233,213,223,0.07)"
            align="center"
          />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.plate,
            { opacity: plate, transform: [{ scale: plateScaleValue }] },
          ]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <View style={styles.hairline} />

        <Animated.View
          pointerEvents="box-none"
          style={{ opacity: title, transform: [{ translateY: titleShift }] }}>
          <Text style={styles.titleOne}>WALLPAPER DROP</Text>
          <Text style={styles.titleTwo}>RECKONER</Text>
          <Text style={styles.subtitle}>COUNT THE DROPS BEFORE YOU CUT</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 44 },
  lattice: { position: 'absolute', top: 86, alignSelf: 'center', opacity: 0.9 },
  plate: {
    padding: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(251,244,244,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(233,213,223,0.22)',
  },
  logo: { width: 148, height: 148 },
  hairline: {
    width: 64,
    height: 1,
    backgroundColor: 'rgba(233,213,223,0.25)',
    marginTop: 22,
    marginBottom: 22,
  },
  titleOne: {
    fontFamily: theme.typography.title.fontFamily,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    color: '#FBF4F4',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 8,
  },
  titleTwo: {
    fontFamily: theme.typography.title.fontFamily,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    color: '#E9D5DF',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    textAlign: 'center',
    color: 'rgba(233,213,223,0.72)',
    marginTop: 16,
  },
  barTrack: {
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(251,244,244,0.14)',
    marginTop: 40,
    overflow: 'hidden',
  },
  barFillWrap: { height: 4, borderRadius: 2, overflow: 'hidden' },
  barFill: { flex: 1 },
  loading: {
    fontFamily: theme.typography.micro.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(233,213,223,0.55)',
    marginTop: 14,
  },
});
