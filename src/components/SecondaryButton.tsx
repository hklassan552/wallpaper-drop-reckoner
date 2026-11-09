import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconCmp } from './ScreenHeader';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Tone = 'plum' | 'teal';

type Props = {
  label: string;
  onPress: () => void;
  tone?: Tone;
  Icon?: IconCmp;
  flex?: boolean;
};

const TONES: Record<Tone, { fill: string; border: string; text: string }> = {
  plum: {
    fill: 'rgba(125,60,111,0.08)',
    border: 'rgba(125,60,111,0.35)',
    text: theme.colors.primary,
  },
  teal: {
    fill: 'rgba(47,167,155,0.10)',
    border: 'rgba(47,167,155,0.45)',
    text: theme.colors.accent,
  },
};

/** h48 outlined button. Same fixed 24x24 icon size as PrimaryButton (rule #20). */
function SecondaryButtonBase({
  label,
  onPress,
  tone = 'plum',
  Icon,
  flex = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const palette = TONES[tone];

  return (
    <Pressable
      style={flex ? styles.pressFlex : styles.press}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anim,
          {
            transform: [{ scale }],
            backgroundColor: palette.fill,
            borderColor: palette.border,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={palette.text} strokeWidth={1.5} /> : null}
          <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  pressFlex: { flex: 1, height: 48 },
  anim: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: theme.typography.button.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 24,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
