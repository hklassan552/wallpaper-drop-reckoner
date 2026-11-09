import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CARD_STAGGER_MS, SPRING_SOFT } from '../constants/config';

type Props = {
  index: number;
  cutDrop: string;
  offsetRatio: number;
  isSeam: boolean;
};

/** One numbered drop. The teal bar offset visualises the half-drop stagger. */
function DropTicketBase({ index, cutDrop, offsetRatio, isSeam }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      delay: (index - 1) * CARD_STAGGER_MS,
      tension: SPRING_SOFT.tension,
      friction: SPRING_SOFT.friction,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const translateX = enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const markerOffset = Math.round(Math.max(0, Math.min(1, offsetRatio)) * 34);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { opacity: enter, transform: [{ translateX }] }]}>
      <View style={[styles.card, isSeam ? styles.cardSeam : null]}>
        {isSeam ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>SEAM HERE</Text>
          </View>
        ) : null}

        <Text style={styles.number}>{String(index)}</Text>
        <Text style={styles.length} numberOfLines={1}>
          {cutDrop}
        </Text>

        <View style={styles.markerTrack}>
          <View style={[styles.marker, { marginLeft: markerOffset }]} />
        </View>

        <Text style={styles.caption}>{offsetRatio > 0 ? 'HALF DROP' : 'STRAIGHT'}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 92, height: 150, marginRight: 10 },
  card: {
    width: 92,
    height: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg - 2,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    overflow: 'hidden',
  },
  cardSeam: { borderColor: theme.colors.primary },
  ribbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(125,60,111,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonText: {
    fontFamily: theme.typography.micro.fontFamily,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.primary,
  },
  number: {
    fontFamily: theme.typography.title.fontFamily,
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  length: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  markerTrack: {
    width: 56,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceAlt,
    marginTop: 12,
    overflow: 'hidden',
  },
  marker: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  caption: {
    fontFamily: theme.typography.micro.fontFamily,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    marginTop: 8,
  },
});

export const DropTicket = memo(DropTicketBase);
export default DropTicket;
