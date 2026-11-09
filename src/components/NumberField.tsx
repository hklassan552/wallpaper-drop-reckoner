import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  value: string;
  unit: string;
  step: number;
  onChangeText: (text: string) => void;
  onStep: (delta: number) => void;
};

/** label + numeric input + unit suffix + two 44x44 steppers. */
function NumberFieldBase({ label, value, unit, step, onChangeText, onStep }: Props) {
  const decrease = useCallback(() => onStep(-step), [onStep, step]);
  const increase = useCallback(() => onStep(step), [onStep, step]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.field}>
        <Pressable
          style={styles.stepper}
          hitSlop={HIT}
          onPress={decrease}
          accessibilityRole="button"
          accessibilityLabel={`decrease ${label}`}>
          <Minus size={18} color={theme.colors.primary} strokeWidth={1.5} />
        </Pressable>

        <View style={styles.valueWrap}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType="decimal-pad"
            selectTextOnFocus
            underlineColorAndroid="transparent"
            selectionColor={theme.colors.primary}
            accessibilityLabel={label}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>

        <Pressable
          style={styles.stepper}
          hitSlop={HIT}
          onPress={increase}
          accessibilityRole="button"
          accessibilityLabel={`increase ${label}`}>
          <Plus size={18} color={theme.colors.primary} strokeWidth={1.5} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  label: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginBottom: 5,
  },
  field: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 2,
  },
  stepper: {
    width: 40,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
  },
  valueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  input: {
    minWidth: 42,
    paddingVertical: 0,
    textAlign: 'right',
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  unit: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
});

export const NumberField = memo(NumberFieldBase);
export default NumberField;
