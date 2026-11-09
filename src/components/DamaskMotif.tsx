import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  rows?: number;
  cols?: number;
  color?: string;
  size?: number;
  gap?: number;
  align?: 'flex-start' | 'flex-end' | 'center';
};

/** Decorative rotated-square lattice — the editorial damask motif. Never interactive. */
function DamaskMotifBase({
  rows = 3,
  cols = 4,
  color = 'rgba(125,60,111,0.10)',
  size = 14,
  gap = 10,
  align = 'flex-start',
}: Props) {
  const grid = useMemo(
    () => Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => `${r}-${c}`)),
    [cols, rows],
  );

  return (
    <View style={[styles.wrap, { alignItems: align }]} pointerEvents="none">
      {grid.map(row => (
        <View key={row[0]} style={[styles.row, { marginBottom: gap }]}>
          {row.map(cell => (
            <View
              key={cell}
              style={{
                width: size,
                height: size,
                marginRight: gap,
                borderWidth: 1,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'flex-start' },
  row: { flexDirection: 'row' },
});

export const DamaskMotif = memo(DamaskMotifBase);
export default DamaskMotif;
