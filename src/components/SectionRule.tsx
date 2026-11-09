import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = { caption?: string; color?: string; width?: number | `${number}%` };

/** 1px editorial hairline with an optional uppercase caption above it. */
function SectionRuleBase({ caption, color = theme.colors.secondary, width = '100%' }: Props) {
  return (
    <View style={styles.wrap}>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <View style={[styles.rule, { backgroundColor: color, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  rule: { height: 1, borderRadius: 1 },
});

export const SectionRule = memo(SectionRuleBase);
export default SectionRule;
