/**
 * The calculation engine — pure functions only, no React.
 * All lengths are metres internally; units.ts handles display.
 */

export type MatchType = 'straight' | 'offset';
export type OpeningType = 'door' | 'window';
export type UnitSystem = 'metric' | 'imperial';

export interface Opening {
  id: string;
  type: OpeningType;
  width: number;
  height: number;
  x: number;
  sillHeight: number;
}

export interface Wall {
  id: string;
  width: number;
  height: number;
  openings: Opening[];
}

export interface RollSpec {
  rollLength: number;
  rollWidth: number;
  patternRepeat: number;
  matchType: MatchType;
}

export interface Settings {
  unit: UnitSystem;
  trimAllowance: number;
  spareRoll: boolean;
  preset: string;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  roll: RollSpec;
  batch?: string;
}

export type CalcState = 'empty' | 'drafting' | 'solved' | 'invalid';

export interface DropResult {
  state: CalcState;
  invalid: boolean;
  cutDrop: number;
  dropsPerRoll: number;
  totalDrops: number;
  dropsPerWall: number[];
  rollsNeeded: number;
  spareRolls: number;
  rollsToBuy: number;
  offcutPerRoll: number;
  totalWaste: number;
  paperedArea: number;
  usedPct: number;
  sparePct: number;
  offcutPct: number;
}

export function isFullHeightDoor(o: Opening, wall: Wall): boolean {
  return o.type === 'door' && o.sillHeight <= 0.02 && o.height >= wall.height - 0.2;
}

export function openingArea(wall: Wall): number {
  return wall.openings.reduce((sum, o) => sum + o.width * o.height, 0);
}

export function netWidth(wall: Wall): number {
  const doorWidth = wall.openings
    .filter(o => isFullHeightDoor(o, wall))
    .reduce((sum, o) => sum + o.width, 0);
  return Math.max(0, wall.width - doorWidth);
}

export function cutDropLength(
  wallHeight: number,
  repeat: number,
  matchType: MatchType,
  trim: number,
): number {
  const base = wallHeight + trim;
  if (repeat <= 0) {
    return base;
  }
  if (matchType === 'straight') {
    return Math.ceil(base / repeat) * repeat;
  }
  return Math.ceil((base + repeat / 2) / repeat) * repeat;
}

export function dropsForWall(wall: Wall, rollWidth: number): number {
  if (rollWidth <= 0) {
    return 0;
  }
  return Math.ceil(netWidth(wall) / rollWidth);
}

export function computeDrops(
  walls: Wall[],
  roll: RollSpec,
  settings: Settings,
): DropResult {
  const trim = settings.trimAllowance;
  const tallest = walls.reduce((max, w) => Math.max(max, w.height), 0);
  const cutDrop = cutDropLength(tallest, roll.patternRepeat, roll.matchType, trim);
  const dropsPerWall = walls.map(w => dropsForWall(w, roll.rollWidth));
  const totalDrops = dropsPerWall.reduce((a, b) => a + b, 0);
  const invalid = walls.length > 0 && cutDrop > roll.rollLength;

  const dropsPerRoll = invalid ? 0 : Math.max(1, Math.floor(roll.rollLength / cutDrop));
  const rollsNeeded = dropsPerRoll > 0 ? Math.ceil(totalDrops / dropsPerRoll) : 0;
  const spareRolls = settings.spareRoll && totalDrops >= 10 ? 1 : 0;
  const rollsToBuy = rollsNeeded > 0 ? rollsNeeded + spareRolls : 0;
  const offcutPerRoll = dropsPerRoll > 0 ? roll.rollLength - dropsPerRoll * cutDrop : 0;

  const totalPaper = rollsToBuy * roll.rollLength;
  const usedPaper = totalDrops * cutDrop;
  const sparePaper = spareRolls * roll.rollLength;
  const offcutPaper = Math.max(0, totalPaper - usedPaper - sparePaper);
  const totalWaste = Math.max(0, totalPaper - usedPaper);

  const paperedArea = walls.reduce(
    (sum, w) => sum + Math.max(0, w.width * w.height - openingArea(w)),
    0,
  );

  let usedPct = 0;
  let sparePct = 0;
  let offcutPct = 0;
  if (totalPaper > 0) {
    usedPct = Math.round((usedPaper / totalPaper) * 100);
    sparePct = Math.round((sparePaper / totalPaper) * 100);
    offcutPct = Math.max(0, 100 - usedPct - sparePct);
  }

  let state: CalcState = 'solved';
  if (walls.length === 0) {
    state = 'empty';
  } else if (invalid) {
    state = 'invalid';
  } else if (roll.rollWidth <= 0 || roll.rollLength <= 0 || totalDrops === 0) {
    state = 'drafting';
  }

  return {
    state,
    invalid,
    cutDrop,
    dropsPerRoll,
    totalDrops,
    dropsPerWall,
    rollsNeeded,
    spareRolls,
    rollsToBuy,
    offcutPerRoll,
    totalWaste,
    paperedArea,
    usedPct,
    sparePct,
    offcutPct,
  };
}

export function roomRollTotal(room: Room, settings: Settings): number {
  return computeDrops(room.walls, room.roll, settings).rollsToBuy;
}
