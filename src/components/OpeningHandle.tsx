import React, { memo, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Vibration, View } from 'react-native';
import { AppWindow, DoorOpen } from 'lucide-react-native';
import theme from '../constants/theme';
import { HANDLE_SIZE, SNAP_TOLERANCE, SPRING_SNAP } from '../constants/config';
import type { OpeningType } from '../game/dropEngine';

type Props = {
  id: string;
  type: OpeningType;
  centerX: number;
  centerY: number;
  minX: number;
  maxX: number;
  snapTargets: number[];
  onCommit: (id: string, centerX: number) => void;
};

function snapTo(value: number, targets: number[]): number {
  let best = value;
  let bestDistance = SNAP_TOLERANCE;
  for (let i = 0; i < targets.length; i += 1) {
    const distance = Math.abs(targets[i] - value);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = targets[i];
    }
  }
  return best;
}

/**
 * 56x56 drag handle built on core RN PanResponder (no third-party gesture lib).
 * Everything the gesture callbacks read lives in a ref, never in state (rule #8).
 */
function OpeningHandleBase({
  id,
  type,
  centerX,
  centerY,
  minX,
  maxX,
  snapTargets,
  onCommit,
}: Props) {
  const pan = useRef(new Animated.Value(0)).current;
  const delta = useRef(0);

  const live = useRef({ id, centerX, minX, maxX, snapTargets, onCommit });
  live.current = { id, centerX, minX, maxX, snapTargets, onCommit };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          delta.current = 0;
          pan.setValue(0);
        },
        onPanResponderMove: (_evt, gesture) => {
          const ctx = live.current;
          const next = Math.max(
            ctx.minX,
            Math.min(ctx.maxX, ctx.centerX + gesture.dx),
          );
          delta.current = next - ctx.centerX;
          pan.setValue(delta.current);
        },
        onPanResponderRelease: () => {
          const ctx = live.current;
          const raw = ctx.centerX + delta.current;
          const snapped = Math.max(
            ctx.minX,
            Math.min(ctx.maxX, snapTo(raw, ctx.snapTargets)),
          );
          if (Math.abs(snapped - raw) > 0.5) {
            Vibration.vibrate(12);
          }
          Animated.spring(pan, {
            toValue: snapped - ctx.centerX,
            tension: SPRING_SNAP.tension,
            friction: SPRING_SNAP.friction,
            useNativeDriver: true,
          }).start(() => {
            delta.current = 0;
            ctx.onCommit(ctx.id, snapped);
            pan.setValue(0);
          });
        },
        onPanResponderTerminate: () => {
          delta.current = 0;
          Animated.spring(pan, {
            toValue: 0,
            tension: SPRING_SNAP.tension,
            friction: SPRING_SNAP.friction,
            useNativeDriver: true,
          }).start();
        },
      }),
    [pan],
  );

  const Icon = type === 'door' ? DoorOpen : AppWindow;
  const tone = type === 'door' ? theme.colors.primary : theme.colors.accent;

  return (
    <Animated.View
      {...responder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel={`move ${type}`}
      style={[
        styles.handle,
        {
          left: centerX - HANDLE_SIZE / 2,
          top: centerY - HANDLE_SIZE / 2,
          transform: [{ translateX: pan }],
        },
      ]}>
      <View style={[styles.inner, { borderColor: tone }]}>
        <Icon size={22} color={tone} strokeWidth={1.5} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const OpeningHandle = memo(OpeningHandleBase);
export default OpeningHandle;
