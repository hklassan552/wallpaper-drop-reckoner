import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconCmp } from './ScreenHeader';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  disabled?: boolean;
};

/**
 * h60 plum-gradient CTA. Pressable is the PARENT, the Animated.View sits INSIDE it (rule #8).
 * The icon is a fixed 24x24 with a matching lineHeight 24 and gap 10 (rule #20).
 */
function PrimaryButtonBase({ label, onPress, Icon, disabled = false }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anim,
          { transform: [{ scale }] },
          disabled ? styles.disabled : null,
        ]}>
        <LinearGradient
          colors={theme.gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? (
              <Icon size={24} color={theme.colors.onPrimary} strokeWidth={1.5} />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 60 },
  anim: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    shadowColor: theme.shadows.cta.shadowColor,
    shadowOpacity: theme.shadows.cta.shadowOpacity,
    shadowRadius: theme.shadows.cta.shadowRadius,
    shadowOffset: theme.shadows.cta.shadowOffset,
    elevation: theme.shadows.cta.elevation,
  },
  disabled: { opacity: 0.45 },
  fill: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 24,
    color: theme.colors.onPrimary,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
