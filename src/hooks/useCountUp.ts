import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** Counts 0 -> target over `ms`. The driving value lives in a ref (rule #8). */
export function useCountUp(target: number, ms: number): number {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setDisplay(0);
      return undefined;
    }
    anim.setValue(0);
    const id = anim.addListener(({ value }) => {
      setDisplay(Math.round(value));
    });
    Animated.timing(anim, {
      toValue: target,
      duration: ms,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => {
      anim.removeListener(id);
    };
  }, [anim, ms, target]);

  return display;
}

export default useCountUp;
