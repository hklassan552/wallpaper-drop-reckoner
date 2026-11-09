import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import theme from '../constants/theme';
import {
  BOARD_FRAME,
  CANVAS_W,
  SKETCH_H,
  UNFURL_MS,
  UNFURL_STAGGER_MS,
} from '../constants/config';
import type { MatchType, Wall } from '../game/dropEngine';
import OpeningHandle from './OpeningHandle';

const MAX_BANDS = 32;

type Props = {
  wall?: Wall;
  dropCount: number;
  matchType: MatchType;
  onMoveOpening: (openingId: string, x: number) => void;
};

/**
 * Flat wall elevation. The drop bands are plain Views so each can unfurl on its own
 * (transform only -> useNativeDriver stays true); the outline and the openings are SVG.
 */
function WallSketchBase({ wall, dropCount, matchType, onMoveOpening }: Props) {
  const bandCount = Math.max(1, Math.min(MAX_BANDS, dropCount || 1));
  const dropW = Math.floor(CANVAS_W / bandCount);
  const svgW = dropW * bandCount;
  const svgH = SKETCH_H;
  const cardW = svgW + 2 * BOARD_FRAME;

  const unfurl = useRef(
    Array.from({ length: MAX_BANDS }, () => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    for (let i = 0; i < bandCount; i += 1) {
      unfurl[i].setValue(0);
      animations.push(
        Animated.timing(unfurl[i], {
          toValue: 1,
          duration: UNFURL_MS,
          delay: i * UNFURL_STAGGER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      );
    }
    Animated.parallel(animations).start();
  }, [bandCount, matchType, unfurl, wall]);

  const scaleX = wall && wall.width > 0 ? svgW / wall.width : 0;
  const scaleY = wall && wall.height > 0 ? svgH / wall.height : 0;

  const snapTargets = useMemo(() => {
    const targets: number[] = [0, svgW];
    for (let i = 1; i < bandCount; i += 1) {
      targets.push(i * dropW);
    }
    return targets;
  }, [bandCount, dropW, svgW]);

  const handleCommit = useCallback(
    (openingId: string, centerX: number) => {
      if (scaleX <= 0 || !wall) {
        return;
      }
      const opening = wall.openings.find(o => o.id === openingId);
      if (!opening) {
        return;
      }
      onMoveOpening(openingId, centerX / scaleX - opening.width / 2);
    },
    [onMoveOpening, scaleX, wall],
  );

  const bands = useMemo(
    () => Array.from({ length: bandCount }, (_, i) => i),
    [bandCount],
  );

  if (!wall) {
    return (
      <View style={[styles.card, styles.cardEmpty, { width: cardW, height: svgH + 2 * BOARD_FRAME }]}>
        <Text style={styles.emptyTitle}>ADD YOUR FIRST WALL</Text>
        <Text style={styles.emptyHint}>WIDTH AND HEIGHT, THEN THE ROLL SPEC</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { width: cardW, height: svgH + 2 * BOARD_FRAME }]}>
      <View style={{ width: svgW, height: svgH }}>
        {bands.map(i => (
          <Animated.View
            key={`band-${i}`}
            pointerEvents="none"
            style={[
              styles.band,
              {
                left: i * dropW,
                width: dropW,
                height: svgH,
                backgroundColor:
                  i % 2 === 0 ? theme.colors.surfaceAlt : theme.colors.bg,
                transformOrigin: 'top',
                transform: [{ scaleY: unfurl[i] }],
              },
            ]}>
            <Text style={styles.bandNumber}>{String(i + 1)}</Text>
          </Animated.View>
        ))}

        <Svg
          width={svgW}
          height={svgH}
          style={StyleSheet.absoluteFill}
          pointerEvents="none">
          {bands.slice(1).map(i => (
            <Line
              key={`seam-${i}`}
              x1={i * dropW}
              y1={0}
              x2={i * dropW}
              y2={svgH}
              stroke={theme.colors.secondary}
              strokeWidth={1}
            />
          ))}

          <Line
            x1={0}
            y1={svgH - 0.75}
            x2={svgW}
            y2={svgH - 0.75}
            stroke="#F2E6EB"
            strokeWidth={1.5}
          />

          {wall.openings.map(o => {
            const w = Math.max(6, o.width * scaleX);
            const h = Math.max(6, o.height * scaleY);
            const x = Math.max(0, Math.min(svgW - w, o.x * scaleX));
            const y =
              o.type === 'door'
                ? svgH - h
                : Math.max(0, svgH - (o.sillHeight + o.height) * scaleY);
            const isDoor = o.type === 'door';
            return (
              <Rect
                key={o.id}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={2}
                fill={isDoor ? 'rgba(44,30,41,0.12)' : 'rgba(47,167,155,0.14)'}
                stroke={isDoor ? theme.colors.text : theme.colors.accent}
                strokeWidth={1.5}
              />
            );
          })}

          <Rect
            x={0.75}
            y={0.75}
            width={svgW - 1.5}
            height={svgH - 1.5}
            rx={2}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={1.5}
          />
        </Svg>

        {wall.openings.map(o => {
          const h = Math.max(6, o.height * scaleY);
          const y =
            o.type === 'door'
              ? svgH - h / 2
              : Math.max(0, svgH - (o.sillHeight + o.height) * scaleY) + h / 2;
          return (
            <OpeningHandle
              key={`handle-${o.id}`}
              id={o.id}
              type={o.type}
              centerX={Math.max(0, Math.min(svgW, o.x * scaleX + (o.width * scaleX) / 2))}
              centerY={Math.min(svgH - 20, y)}
              minX={(o.width * scaleX) / 2}
              maxX={svgW - (o.width * scaleX) / 2}
              snapTargets={snapTargets}
              onCommit={handleCommit}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl - 4,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 6,
    overflow: 'hidden',
    shadowColor: theme.shadows.card.shadowColor,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    shadowOffset: theme.shadows.card.shadowOffset,
    elevation: theme.shadows.card.elevation,
  },
  cardEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: 'rgba(125,60,111,0.35)',
  },
  emptyTitle: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: 0.6,
  },
  emptyHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 6,
  },
  band: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    paddingTop: 6,
  },
  bandNumber: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
});

export const WallSketch = memo(WallSketchBase);
export default WallSketch;
