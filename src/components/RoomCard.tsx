import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CARD_STAGGER_MS, SPRING_SOFT } from '../constants/config';
import usePressScale from '../hooks/usePressScale';
import DamaskMotif from './DamaskMotif';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  id: string;
  name: string;
  meta: string;
  rolls: number;
  batch?: string;
  index: number;
  onPress: (id: string) => void;
};

/**
 * Editorial shelf row. Primitives only, so memo() actually prevents re-renders
 * while the shelf scrolls (list-perf 2.5).
 */
function RoomCardBase({ id, name, meta, rolls, batch, index, onPress }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      delay: index * CARD_STAGGER_MS,
      tension: SPRING_SOFT.tension,
      friction: SPRING_SOFT.friction,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ opacity: enter, transform: [{ translateY }] }}>
      <Pressable
        style={styles.press}
        hitSlop={HIT}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${rolls} rolls`}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, { transform: [{ scale }] }]}>
          <View style={styles.motif} pointerEvents="none">
            <DamaskMotif
              rows={1}
              cols={3}
              size={10}
              gap={7}
              color="rgba(125,60,111,0.10)"
              align="flex-end"
            />
          </View>

          <View style={styles.body}>
            <View style={styles.textCol}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {meta}
              </Text>
              {batch ? (
                <View style={styles.batchPill}>
                  <Text style={styles.batchText}>{`BATCH ${batch}`}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.rollPill}>
              <Text style={styles.rollText}>{`${rolls} ROLLS`}</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 108, marginBottom: 12 },
  card: {
    width: '100%',
    height: 108,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 16,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.shadows.card.shadowColor,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    shadowOffset: theme.shadows.card.shadowOffset,
    elevation: theme.shadows.card.elevation,
  },
  motif: { position: 'absolute', top: 10, right: 12 },
  body: { flexDirection: 'row', alignItems: 'center' },
  textCol: { flex: 1, paddingRight: 10 },
  name: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: 0.4,
  },
  meta: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  batchPill: {
    alignSelf: 'flex-start',
    marginTop: 7,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(125,60,111,0.10)',
    justifyContent: 'center',
  },
  batchText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.primary,
  },
  rollPill: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(47,167,155,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(47,167,155,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollText: {
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.6,
  },
});

export const RoomCard = memo(RoomCardBase);
export default RoomCard;
