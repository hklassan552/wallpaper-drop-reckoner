import React, { memo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type ChipItem = { key: string; label: string };

type ChipProps = {
  item: ChipItem;
  active: boolean;
  onChange: (key: string) => void;
  grow: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ChipBase({ item, active, onChange, grow }: ChipProps) {
  const handlePress = useCallback(() => onChange(item.key), [item.key, onChange]);

  return (
    <Pressable
      style={[styles.chip, grow ? styles.chipGrow : null, active ? styles.chipActive : null]}
      hitSlop={HIT}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.label}>
      <Text
        style={[styles.chipLabel, active ? styles.chipLabelActive : null]}
        numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const Chip = memo(ChipBase);

type Props = {
  items: ChipItem[];
  value: string;
  onChange: (key: string) => void;
  grow?: boolean;
  scrollable?: boolean;
};

/** 40px selectable chips - inactive white + hairline, active plum tint. */
function ChipRowBase({
  items,
  value,
  onChange,
  grow = true,
  scrollable = false,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ChipItem }) => (
      <View style={styles.scrollCell}>
        <Chip item={item} active={item.key === value} onChange={onChange} grow={false} />
      </View>
    ),
    [onChange, value],
  );

  const keyExtractor = useCallback((item: ChipItem) => item.key, []);

  if (scrollable) {
    return (
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        style={styles.scrollRow}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    );
  }

  return (
    <View style={styles.row}>
      {items.map(item => (
        <Chip
          key={item.key}
          item={item}
          active={item.key === value}
          onChange={onChange}
          grow={grow}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scrollRow: { height: 40, flexGrow: 0 },
  scrollCell: { marginRight: 8 },
  chip: {
    height: 40,
    minWidth: 72,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGrow: { flex: 1, minWidth: undefined },
  chipActive: {
    backgroundColor: 'rgba(125,60,111,0.12)',
    borderColor: theme.colors.primary,
  },
  chipLabel: {
    ...theme.typography.caption,
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  chipLabelActive: { color: theme.colors.primary, fontWeight: '700' },
});

export const ChipRow = memo(ChipRowBase);
export default ChipRow;
