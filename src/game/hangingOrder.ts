import type { MatchType, RollSpec, Wall } from './dropEngine';
import { dropsForWall } from './dropEngine';

export interface DropTicketData {
  index: number;
  cutDrop: number;
  offset: number;
  isSeam: boolean;
}

/** Numbers the drops 1..N left to right and marks the last one as the planned seam. */
export function buildHangingOrder(
  wall: Wall | undefined,
  roll: RollSpec,
  cutDrop: number,
): DropTicketData[] {
  if (!wall) {
    return [];
  }
  const count = dropsForWall(wall, roll.rollWidth);
  const half = roll.matchType === ('offset' as MatchType) ? roll.patternRepeat / 2 : 0;
  const tickets: DropTicketData[] = [];
  for (let i = 0; i < count; i += 1) {
    tickets.push({
      index: i + 1,
      cutDrop,
      offset: i % 2 === 1 ? half : 0,
      isSeam: i === count - 1 && count > 1,
    });
  }
  return tickets;
}
