import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = { lineOne: string; lineTwo: string; tagline: string };

/** Asymmetric, left-flush editorial title block (MenuLayout M4). */
function MastheadBase({ lineOne, lineTwo, tagline }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { opacity: enter, transform: [{ translateY }] }]}>
      <Text style={styles.lineOne}>{lineOne}</Text>
      <Text style={styles.lineTwo}>{lineTwo}</Text>
      <View style={styles.rule} />
      <Text style={styles.tagline}>{tagline}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start' },
  lineOne: {
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text,
  },
  lineTwo: {
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  rule: {
    width: 56,
    height: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 12,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
});

export const Masthead = memo(MastheadBase);
export default Masthead;
