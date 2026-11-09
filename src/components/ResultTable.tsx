import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type ResultRow = { label: string; value: string };

type Props = { rows: ResultRow[]; dense?: boolean };

/** Editorial 2-column table divided by 1px hairline rules. */
function ResultTableBase({ rows, dense = false }: Props) {
  return (
    <View style={styles.table}>
      {rows.map((row, i) => (
        <View
          key={row.label}
          style={[
            styles.row,
            dense ? styles.rowDense : null,
            i === rows.length - 1 ? styles.rowLast : null,
          ]}>
          <Text style={styles.label} numberOfLines={1}>
            {row.label}
          </Text>
          <Text style={styles.value} numberOfLines={1}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { width: '100%' },
  row: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  rowDense: { height: 30 },
  rowLast: { borderBottomWidth: 0 },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    flex: 1,
  },
  value: {
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
});

export const ResultTable = memo(ResultTableBase);
export default ResultTable;
