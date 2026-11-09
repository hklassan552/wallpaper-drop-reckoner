import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { SPRING_PRESS } from '../constants/config';

/**
 * Press feedback: the Pressable stays the PARENT, the Animated.View goes INSIDE it.
 * useNativeDriver is safe here — transform only.
 */
export function usePressScale(down = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: down,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [down, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
