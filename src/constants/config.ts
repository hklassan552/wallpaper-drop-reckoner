import { Dimensions } from 'react-native';
import type { Room, RollSpec, Settings } from '../game/dropEngine';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/* ---------- timing ---------- */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;
export const FADE_MS = 320;
export const UNFURL_MS = 260;
export const UNFURL_STAGGER_MS = 24;
export const WASTE_BAR_MS = 300;
export const COUNTUP_MS = 600;
export const CARD_STAGGER_MS = 60;

export const SPRING_SOFT = { tension: 48, friction: 10 };
export const SPRING_PRESS = { tension: 300, friction: 12 };
export const SPRING_SNAP = { tension: 220, friction: 14 };
export const SPRING_PLATE = { tension: 52, friction: 9 };

/* ---------- board geometry (rules #4 / #5) ---------- */
export const PAD = 6;
export const BORDER = 1;
export const BOARD_FRAME = PAD + BORDER; // 7
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CANVAS_W = BOARD_MAX_W - 2 * BOARD_FRAME;
export const SKETCH_H = Math.round(Math.min(168, Math.max(118, SCREEN_H * 0.21)));
export const HANDLE_SIZE = 56;
export const SNAP_TOLERANCE = 12;

/* ---------- defaults ---------- */
export const DEFAULT_ROLL: RollSpec = {
  rollLength: 10.05,
  rollWidth: 0.53,
  patternRepeat: 0.32,
  matchType: 'straight',
};

export const ROLL_PRESETS: { key: string; label: string; spec: Partial<RollSpec> }[] = [
  { key: 'euro', label: 'EURO', spec: { rollLength: 10.05, rollWidth: 0.53 } },
  { key: 'wide', label: 'WIDE', spec: { rollLength: 10.05, rollWidth: 0.68 } },
  { key: 'custom', label: 'CUSTOM', spec: {} },
];

export const DEFAULT_SETTINGS: Settings = {
  unit: 'metric',
  trimAllowance: 0.1,
  spareRoll: true,
  preset: 'euro',
};

export const TRIM_STEPS = [0.05, 0.1, 0.15];

export const WALL_DEFAULT = { width: 3.6, height: 2.45 };

/* ---------- demo shelf (first launch is never empty) ---------- */
export const DEMO_ROOMS: Room[] = [
  {
    id: 'room-hallway',
    name: 'HALLWAY',
    batch: 'B-2471',
    roll: { rollLength: 10.05, rollWidth: 0.53, patternRepeat: 0.32, matchType: 'straight' },
    walls: [
      {
        id: 'w1',
        width: 3.2,
        height: 2.45,
        openings: [
          { id: 'o1', type: 'door', width: 0.86, height: 2.04, x: 1.1, sillHeight: 0 },
        ],
      },
      { id: 'w2', width: 1.4, height: 2.45, openings: [] },
      {
        id: 'w3',
        width: 3.2,
        height: 2.45,
        openings: [
          { id: 'o2', type: 'window', width: 1.2, height: 1.1, x: 0.9, sillHeight: 0.95 },
        ],
      },
      { id: 'w4', width: 1.4, height: 2.45, openings: [] },
    ],
  },
  {
    id: 'room-back-bedroom',
    name: 'BACK BEDROOM',
    batch: 'B-1908',
    roll: { rollLength: 10.05, rollWidth: 0.53, patternRepeat: 0.64, matchType: 'offset' },
    walls: [
      { id: 'w1', width: 4.1, height: 2.6, openings: [] },
      {
        id: 'w2',
        width: 3.3,
        height: 2.6,
        openings: [
          { id: 'o3', type: 'window', width: 1.5, height: 1.25, x: 0.85, sillHeight: 0.9 },
        ],
      },
      {
        id: 'w3',
        width: 4.1,
        height: 2.6,
        openings: [
          { id: 'o4', type: 'door', width: 0.9, height: 2.1, x: 2.6, sillHeight: 0 },
        ],
      },
    ],
  },
];

export const STEP_KEYS = ['walls', 'roll', 'drops'] as const;
export type StepKey = (typeof STEP_KEYS)[number];
export const STEP_LABELS: Record<StepKey, string> = {
  walls: 'WALLS',
  roll: 'ROLL',
  drops: 'DROPS',
};
