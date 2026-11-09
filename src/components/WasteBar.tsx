import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { WASTE_BAR_MS } from '../constants/config';

type Props = { used: number; spare: number; offcut: number };

const SEGMENT_COLORS = [theme.colors.primary, theme.colors.secondary, theme.colors.accent];

/**
 * Stacked 3-segment bar. Width is a layout property, so useNativeDriver MUST stay false
 * here (animation-gpu-properties).
 */
function WasteBarBase({ used, spare, offcut }: Props) {
  const grow = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const target = useRef([used, spare, offcut]);
  target.current = [used, spare, offcut];

  useEffect(() => {
    const animations = grow.map(value =>
      Animated.timing(value, {
        toValue: 1,
        duration: WASTE_BAR_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    );
    grow.forEach(value => value.setValue(0));
    Animated.sequence(animations).start();
  }, [grow, offcut, spare, used]);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {target.current.map((pct, i) => (
          <Animated.View
            key={SEGMENT_COLORS[i]}
            pointerEvents="none"
            style={{
              backgroundColor: SEGMENT_COLORS[i],
              width: grow[i].interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', `${Math.max(0, Math.min(100, pct))}%`],
              }),
            }}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.legendText}>{`USED ${used}%`}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: theme.colors.secondary }]} />
          <Text style={styles.legendText}>{`SPARE ${spare}%`}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: theme.colors.accent }]} />
          <Text style={styles.legendText}>{`OFFCUT ${offcut}%`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  track: {
    width: '100%',
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  legendText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
  },
});

export const WasteBar = memo(WasteBarBase);
export default WasteBar;
