import React, { memo, useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ListOrdered } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { STEP_LABELS, STEP_KEYS } from '../constants/config';
import type { StepKey } from '../constants/config';
import type { DropResult, RollSpec, Settings, Wall } from '../game/dropEngine';
import { dropsForWall } from '../game/dropEngine';
import { formatLength, fromFieldValue, toFieldValue, unitSuffix } from '../game/units';
import AppShell from '../components/AppShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import ChipRow from '../components/ChipRow';
import NumberField from '../components/NumberField';
import WallSketch from '../components/WallSketch';
import StatStrip from '../components/StatStrip';
import ResultTable from '../components/ResultTable';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const STEP_ITEMS = STEP_KEYS.map(key => ({ key, label: STEP_LABELS[key] }));

const MATCH_ITEMS = [
  { key: 'straight', label: 'STRAIGHT' },
  { key: 'offset', label: 'OFFSET' },
];

type Props = {
  roomName: string;
  walls: Wall[];
  roll: RollSpec;
  settings: Settings;
  result: DropResult;
  onBack: () => void;
  onAddWall: () => void;
  onChangeWall: (wallId: string, patch: Partial<Wall>) => void;
  onAddOpening: (wallId: string, type: 'door' | 'window') => void;
  onMoveOpening: (wallId: string, openingId: string, x: number) => void;
  onChangeRoll: (patch: Partial<RollSpec>) => void;
  onSeeOrder: () => void;
  onGameOver: () => void;
};

/** Wall Builder / Roll Spec / Drop Cutter - split panel (G3). */
function GameScreenBase({
  roomName,
  walls,
  roll,
  settings,
  result,
  onBack,
  onAddWall,
  onChangeWall,
  onAddOpening,
  onMoveOpening,
  onChangeRoll,
  onSeeOrder,
  onGameOver,
}: Props) {
  const [step, setStep] = useState<StepKey>('walls');
  const [wallIndex, setWallIndex] = useState(0);

  const activeIndex = Math.min(wallIndex, Math.max(0, walls.length - 1));
  const activeWall: Wall | undefined = walls[activeIndex];
  const unit = settings.unit;
  const suffix = unitSuffix(unit);

  const wallItems = useMemo(() => {
    const items = walls.map((w, i) => ({ key: w.id, label: `WALL ${i + 1}` }));
    items.push({ key: 'add-wall', label: 'ADD WALL' });
    return items;
  }, [walls]);

  const handleStep = useCallback((key: string) => setStep(key as StepKey), []);

  const handleWallChip = useCallback(
    (key: string) => {
      if (key === 'add-wall') {
        onAddWall();
        setWallIndex(walls.length);
        return;
      }
      const index = walls.findIndex(w => w.id === key);
      if (index >= 0) {
        setWallIndex(index);
      }
    },
    [onAddWall, walls],
  );

  const handleWidthText = useCallback(
    (text: string) => {
      if (activeWall) {
        onChangeWall(activeWall.id, { width: fromFieldValue(text, unit) });
      }
    },
    [activeWall, onChangeWall, unit],
  );

  const handleWidthStep = useCallback(
    (delta: number) => {
      if (activeWall) {
        onChangeWall(activeWall.id, {
          width: Math.max(0.2, Math.round((activeWall.width + delta) * 100) / 100),
        });
      }
    },
    [activeWall, onChangeWall],
  );

  const handleHeightText = useCallback(
    (text: string) => {
      if (activeWall) {
        onChangeWall(activeWall.id, { height: fromFieldValue(text, unit) });
      }
    },
    [activeWall, onChangeWall, unit],
  );

  const handleHeightStep = useCallback(
    (delta: number) => {
      if (activeWall) {
        onChangeWall(activeWall.id, {
          height: Math.max(1.5, Math.round((activeWall.height + delta) * 100) / 100),
        });
      }
    },
    [activeWall, onChangeWall],
  );

  const addDoor = useCallback(() => {
    if (activeWall) {
      onAddOpening(activeWall.id, 'door');
    }
  }, [activeWall, onAddOpening]);

  const addWindow = useCallback(() => {
    if (activeWall) {
      onAddOpening(activeWall.id, 'window');
    }
  }, [activeWall, onAddOpening]);

  const moveOpening = useCallback(
    (openingId: string, x: number) => {
      if (activeWall) {
        onMoveOpening(activeWall.id, openingId, x);
      }
    },
    [activeWall, onMoveOpening],
  );

  const handleLengthText = useCallback(
    (text: string) => onChangeRoll({ rollLength: fromFieldValue(text, unit) }),
    [onChangeRoll, unit],
  );
  const handleLengthStep = useCallback(
    (delta: number) =>
      onChangeRoll({
        rollLength: Math.max(1, Math.round((roll.rollLength + delta) * 100) / 100),
      }),
    [onChangeRoll, roll.rollLength],
  );

  const handleRepeatText = useCallback(
    (text: string) => onChangeRoll({ patternRepeat: fromFieldValue(text, unit) }),
    [onChangeRoll, unit],
  );
  const handleRepeatStep = useCallback(
    (delta: number) =>
      onChangeRoll({
        patternRepeat: Math.max(0, Math.round((roll.patternRepeat + delta) * 100) / 100),
      }),
    [onChangeRoll, roll.patternRepeat],
  );

  const handleRollWidthText = useCallback(
    (text: string) => onChangeRoll({ rollWidth: fromFieldValue(text, unit) }),
    [onChangeRoll, unit],
  );
  const handleRollWidthStep = useCallback(
    (delta: number) =>
      onChangeRoll({
        rollWidth: Math.max(0.2, Math.round((roll.rollWidth + delta) * 100) / 100),
      }),
    [onChangeRoll, roll.rollWidth],
  );

  const handleMatch = useCallback(
    (key: string) => onChangeRoll({ matchType: key === 'offset' ? 'offset' : 'straight' }),
    [onChangeRoll],
  );

  const dropCount = activeWall ? dropsForWall(activeWall, roll.rollWidth) : 0;
  const stepNumber = STEP_KEYS.indexOf(step) + 1;

  const dropRows = useMemo(
    () => [
      { label: 'CUT DROP', value: formatLength(result.cutDrop, unit) },
      { label: 'DROPS PER ROLL', value: String(result.dropsPerRoll) },
      { label: 'TOTAL DROPS', value: String(result.totalDrops) },
      { label: 'OFFCUT PER ROLL', value: formatLength(result.offcutPerRoll, unit) },
    ],
    [result.cutDrop, result.dropsPerRoll, result.offcutPerRoll, result.totalDrops, unit],
  );

  return (
    <AppShell variant="game">
      <ScreenHeader
        title={roomName}
        subtitle={`STEP ${stepNumber} OF 3`}
        leftSlot={
          <HeaderIconButton Icon={ChevronLeft} onPress={onBack} label="back to shelf" />
        }
        rightSlot={
          <View style={[styles.rollChip, result.invalid ? styles.rollChipBad : null]}>
            <Text
              style={[styles.rollChipText, result.invalid ? styles.rollChipTextBad : null]}>
              {result.invalid ? 'CHECK' : `ROLLS ${result.rollsToBuy}`}
            </Text>
          </View>
        }
      />

      <View style={styles.stepRow}>
        <ChipRow items={STEP_ITEMS} value={step} onChange={handleStep} />
      </View>

      <View style={styles.gameArea}>
        <View style={styles.sketchCaption}>
          <Image source={assets.sprite3} style={styles.captionSprite} resizeMode="contain" />
          <Text style={styles.captionText} numberOfLines={1}>
            {activeWall
              ? `WALL ${activeIndex + 1} ELEVATION * ${dropCount} DROPS`
              : 'NO WALL YET'}
          </Text>
        </View>

        <WallSketch
          wall={activeWall}
          dropCount={dropCount}
          matchType={roll.matchType}
          onMoveOpening={moveOpening}
        />
      </View>

      <View style={styles.panel}>
        {step === 'walls' ? (
          <View style={styles.stepBlock}>
            <ChipRow
              items={wallItems}
              value={activeWall ? activeWall.id : 'add-wall'}
              onChange={handleWallChip}
              scrollable
            />
            <View style={styles.fieldRow}>
              <NumberField
                label={`WIDTH (${suffix})`}
                value={activeWall ? toFieldValue(activeWall.width, unit) : '0.00'}
                unit={suffix}
                step={0.1}
                onChangeText={handleWidthText}
                onStep={handleWidthStep}
              />
              <NumberField
                label={`HEIGHT (${suffix})`}
                value={activeWall ? toFieldValue(activeWall.height, unit) : '0.00'}
                unit={suffix}
                step={0.05}
                onChangeText={handleHeightText}
                onStep={handleHeightStep}
              />
            </View>
            <View style={styles.buttonRow}>
              <SecondaryButton label="ADD DOOR" tone="plum" onPress={addDoor} flex />
              <SecondaryButton label="ADD WINDOW" tone="teal" onPress={addWindow} flex />
            </View>
          </View>
        ) : null}

        {step === 'roll' ? (
          <View style={styles.stepBlock}>
            <View style={styles.fieldRow}>
              <NumberField
                label="ROLL LENGTH"
                value={toFieldValue(roll.rollLength, unit)}
                unit={suffix}
                step={0.5}
                onChangeText={handleLengthText}
                onStep={handleLengthStep}
              />
              <NumberField
                label="PATTERN REPEAT"
                value={toFieldValue(roll.patternRepeat, unit)}
                unit={suffix}
                step={0.04}
                onChangeText={handleRepeatText}
                onStep={handleRepeatStep}
              />
            </View>
            <View style={styles.fieldRowBottom}>
              <NumberField
                label="ROLL WIDTH"
                value={toFieldValue(roll.rollWidth, unit)}
                unit={suffix}
                step={0.01}
                onChangeText={handleRollWidthText}
                onStep={handleRollWidthStep}
              />
              <View style={styles.matchCol}>
                <Text style={styles.matchLabel}>PATTERN MATCH</Text>
                <ChipRow
                  items={MATCH_ITEMS}
                  value={roll.matchType}
                  onChange={handleMatch}
                />
              </View>
            </View>
            <View style={styles.rollHint}>
              <Image
                source={assets.sprite2}
                style={styles.hintSprite}
                resizeMode="contain"
              />
              <Text style={styles.rollHintText} numberOfLines={2}>
                A BIGGER REPEAT EATS PAPER - THE CUT DROP ROUNDS UP TO A WHOLE PATTERN.
              </Text>
            </View>
          </View>
        ) : null}

        {step === 'drops' ? (
          <View style={styles.stepBlock}>
            <ResultTable rows={dropRows} dense />
          </View>
        ) : null}

        <StatStrip
          cutDrop={formatLength(result.cutDrop, unit)}
          dropsPerRoll={String(result.dropsPerRoll)}
          rolls={String(result.rollsToBuy)}
          invalid={result.invalid}
        />

        <View style={styles.ctaRow}>
          <View style={styles.ctaPrimary}>
            <PrimaryButton
              label="HANGING ORDER"
              Icon={ListOrdered}
              onPress={onSeeOrder}
            />
          </View>
          <View style={styles.ctaSecondary}>
            <SecondaryButton label="WASTE REPORT" tone="teal" onPress={onGameOver} />
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  rollChip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm + 2,
    backgroundColor: 'rgba(47,167,155,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollChipBad: { backgroundColor: 'rgba(192,86,78,0.12)' },
  rollChipText: {
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.6,
  },
  rollChipTextBad: { color: theme.colors.danger },
  stepRow: { paddingHorizontal: theme.spacing.xl, paddingTop: 12, paddingBottom: 8 },
  gameArea: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  sketchCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
  captionSprite: { width: 28, height: 28 },
  captionText: {
    flex: 1,
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textSecondary,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 14,
    paddingBottom: 16,
    shadowColor: theme.shadows.panel.shadowColor,
    shadowOpacity: theme.shadows.panel.shadowOpacity,
    shadowRadius: theme.shadows.panel.shadowRadius,
    shadowOffset: theme.shadows.panel.shadowOffset,
    elevation: theme.shadows.panel.elevation,
  },
  stepBlock: { marginBottom: 12 },
  fieldRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  fieldRowBottom: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  matchCol: { flex: 1 },
  matchLabel: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginBottom: 5,
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  rollHint: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  hintSprite: { width: 32, height: 32 },
  rollHintText: {
    flex: 1,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
    lineHeight: 15,
  },
  ctaRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaPrimary: { flex: 1.65 },
  ctaSecondary: { flex: 1 },
});

export const GameScreen = memo(GameScreenBase);
export default GameScreen;
