import React, { memo, useMemo } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChevronLeft, Home, RotateCcw, Save } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { COUNTUP_MS } from '../constants/config';
import type { DropResult, Settings } from '../game/dropEngine';
import { formatArea, formatLength } from '../game/units';
import useCountUp from '../hooks/useCountUp';
import AppShell from '../components/AppShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import DamaskMotif from '../components/DamaskMotif';
import WasteBar from '../components/WasteBar';
import ResultTable from '../components/ResultTable';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

type Props = {
  roomName: string;
  result: DropResult;
  settings: Settings;
  batch: string;
  onChangeBatch: (text: string) => void;
  onPlanAgain: () => void;
  onSave: () => void;
  onBack: () => void;
  onMenu: () => void;
};

/** Waste Report - the result screen (rule #12). */
function GameOverScreenBase({
  roomName,
  result,
  settings,
  batch,
  onChangeBatch,
  onPlanAgain,
  onSave,
  onBack,
  onMenu,
}: Props) {
  const rolls = useCountUp(result.rollsToBuy, COUNTUP_MS);
  const unit = settings.unit;

  const rows = useMemo(
    () => [
      { label: 'TOTAL DROPS', value: String(result.totalDrops) },
      { label: 'CUT DROP', value: formatLength(result.cutDrop, unit) },
      { label: 'DROPS PER ROLL', value: String(result.dropsPerRoll) },
      { label: 'PAPERED AREA', value: formatArea(result.paperedArea, unit) },
    ],
    [result.cutDrop, result.dropsPerRoll, result.paperedArea, result.totalDrops, unit],
  );

  return (
    <AppShell variant="report">
      <ScreenHeader
        title="WASTE REPORT"
        subtitle={roomName}
        leftSlot={
          <HeaderIconButton Icon={ChevronLeft} onPress={onBack} label="back to planner" />
        }
        rightSlot={
          <HeaderIconButton
            Icon={Home}
            onPress={onMenu}
            color={theme.colors.textSecondary}
            label="back to shelf"
          />
        }
      />

      <View style={styles.body}>
        <Text style={styles.headline}>ROLLS TO BUY</Text>

        <View style={styles.heroRow}>
          <View style={styles.decorLeft} pointerEvents="none">
            <DamaskMotif rows={2} cols={2} size={13} gap={9} color="rgba(125,60,111,0.16)" />
          </View>
          <View style={styles.decorRight} pointerEvents="none">
            <DamaskMotif rows={2} cols={2} size={13} gap={9} color="rgba(125,60,111,0.16)" />
          </View>

          <Text style={styles.hero}>{String(rolls)}</Text>
          <Text style={styles.heroCaption}>ROLLS</Text>
        </View>

        <WasteBar used={result.usedPct} spare={result.sparePct} offcut={result.offcutPct} />

        <View style={styles.tableWrap}>
          <ResultTable rows={rows} dense />
        </View>

        <View style={styles.batchCard}>
          <Text style={styles.batchLabel}>BATCH REMINDER</Text>
          <TextInput
            style={styles.batchInput}
            value={batch}
            onChangeText={onChangeBatch}
            placeholder="BATCH CODE"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="characters"
            selectionColor={theme.colors.primary}
            underlineColorAndroid="transparent"
            accessibilityLabel="batch code"
          />
          <Text style={styles.batchHint}>MATCH THIS BATCH ON REORDERS</Text>
          <Image source={assets.sprite5} style={styles.batchSprite} resizeMode="contain" />
        </View>

        <View style={styles.ctaWrap}>
          <PrimaryButton label="PLAN AGAIN" Icon={RotateCcw} onPress={onPlanAgain} />
          <View style={styles.secondaryWrap}>
            <SecondaryButton label="SAVE TO SHELF" tone="teal" Icon={Save} onPress={onSave} />
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 10,
    paddingBottom: 18,
  },
  headline: {
    fontFamily: theme.typography.title.fontFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text,
    textAlign: 'center',
  },
  heroRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  decorLeft: { position: 'absolute', left: 4, top: 8 },
  decorRight: { position: 'absolute', right: 4, top: 8 },
  hero: {
    fontFamily: theme.typography.hero.fontFamily,
    fontSize: 64,
    lineHeight: 74,
    fontWeight: '700',
    letterSpacing: -1,
    color: theme.colors.accent,
  },
  heroCaption: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.textSecondary,
  },
  tableWrap: { marginTop: 16 },
  batchCard: {
    marginTop: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 14,
    paddingRight: 90,
    overflow: 'hidden',
  },
  batchLabel: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
  },
  batchInput: {
    height: 38,
    marginTop: 2,
    paddingVertical: 0,
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.primary,
  },
  batchHint: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
  },
  batchSprite: { position: 'absolute', right: 12, bottom: 12, width: 64, height: 64 },
  ctaWrap: { marginTop: 'auto', paddingTop: 16 },
  secondaryWrap: { marginTop: 10 },
});

export const GameOverScreen = memo(GameOverScreenBase);
export default GameOverScreen;
