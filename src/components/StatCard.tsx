import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { IconCmp } from './ScreenHeader';

type Props = {
  Icon: IconCmp;
  value: string | number;
  label: string;
  valueColor: string;
};

/**
 * Shared by every screen (rule #21). Vector lucide icon on a fixed 22px canvas inside a
 * 44x44 wrap, so each pill in a row is visually identical apart from its colour.
 * Width is '100%' - never flex:1 inside a flex:1 slot (rule #19a).
 */
function StatCardBase({ Icon, value, label, valueColor }: Props) {
  if (value === 0 || value === '0' || value === '') {
    return null;
  }

  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={1.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    shadowOffset: theme.shadows.card.shadowOffset,
    elevation: theme.shadows.card.elevation,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  label: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
