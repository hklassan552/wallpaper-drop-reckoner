import { useMemo } from 'react';
import { computeDrops } from '../game/dropEngine';
import type { DropResult, RollSpec, Settings, Wall } from '../game/dropEngine';

/** Memoised engine output — recomputed only when the room or the roll spec changes. */
export function useDropCalc(
  walls: Wall[],
  roll: RollSpec,
  settings: Settings,
): DropResult {
  return useMemo(
    () => computeDrops(walls, roll, settings),
    [walls, roll, settings],
  );
}

export default useDropCalc;
