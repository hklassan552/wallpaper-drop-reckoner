import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  cutDrop: string;
  dropsPerRoll: string;
  rolls: string;
  invalid: boolean;
};

/** Three hairline-divided cells. The teal roll total pulses whenever it changes. */
function StatStripBase({ cutDrop, dropsPerRoll, rolls, invalid }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulse.setValue(1);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 110, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
  }, [pulse, rolls]);

  if (invalid) {
    return (
      <View style={[styles.strip, styles.stripInvalid]}>
        <Text style={styles.invalidText}>DROP LONGER THAN ROLL</Text>
      </View>
    );
  }

  return (
    <View style={styles.strip}>
      <View style={styles.cell}>
        <Text style={styles.label}>CUT DROP</Text>
        <Text style={[styles.value, styles.valuePlum]} numberOfLines={1}>
          {cutDrop}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <Text style={styles.label}>PER ROLL</Text>
        <Text style={[styles.value, styles.valueInk]} numberOfLines={1}>
          {dropsPerRoll}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <Text style={styles.label}>ROLLS</Text>
        <Animated.Text
          style={[styles.value, styles.valueTeal, { transform: [{ scale: pulse }] }]}
          numberOfLines={1}>
          {rolls}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.secondary,
  },
  stripInvalid: {
    justifyContent: 'center',
    backgroundColor: 'rgba(192,86,78,0.08)',
  },
  invalidText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    fontSize: 12,
  },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { width: 1, height: 32, backgroundColor: theme.colors.secondary },
  label: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginBottom: 3,
  },
  value: {
    fontFamily: theme.typography.value.fontFamily,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  valuePlum: { fontSize: 15, color: theme.colors.primary },
  valueInk: { fontSize: 15, color: theme.colors.text },
  valueTeal: { fontSize: 20, color: theme.colors.accent },
});

export const StatStrip = memo(StatStripBase);
export default StatStrip;
