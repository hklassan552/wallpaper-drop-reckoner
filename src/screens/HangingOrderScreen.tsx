import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Scissors } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import type { RollSpec, Settings, Wall } from '../game/dropEngine';
import { buildHangingOrder } from '../game/hangingOrder';
import type { DropTicketData } from '../game/hangingOrder';
import { formatLength } from '../game/units';
import AppShell from '../components/AppShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import ChipRow from '../components/ChipRow';
import DropTicket from '../components/DropTicket';
import PrimaryButton from '../components/PrimaryButton';

const TICKET_WIDTH = 102;

type Props = {
  roomName: string;
  walls: Wall[];
  roll: RollSpec;
  cutDrop: number;
  settings: Settings;
  onBack: () => void;
  onGameOver: () => void;
};

/** Hanging Order - numbered drops along the selected wall. */
function HangingOrderScreenBase({
  roomName,
  walls,
  roll,
  cutDrop,
  settings,
  onBack,
  onGameOver,
}: Props) {
  const [wallIndex, setWallIndex] = useState(0);
  const activeIndex = Math.min(wallIndex, Math.max(0, walls.length - 1));
  const activeWall = walls[activeIndex];

  const wallItems = useMemo(
    () => walls.map((w, i) => ({ key: w.id, label: `WALL ${i + 1}` })),
    [walls],
  );

  const handleWall = useCallback(
    (key: string) => {
      const index = walls.findIndex(w => w.id === key);
      if (index >= 0) {
        setWallIndex(index);
      }
    },
    [walls],
  );

  const tickets = useMemo(
    () => buildHangingOrder(activeWall, roll, cutDrop),
    [activeWall, cutDrop, roll],
  );

  const cutLabel = useMemo(
    () => formatLength(cutDrop, settings.unit),
    [cutDrop, settings.unit],
  );

  const offsetRatio = roll.patternRepeat > 0 ? 0.5 : 0;

  const renderItem = useCallback(
    ({ item }: { item: DropTicketData }) => (
      <DropTicket
        index={item.index}
        cutDrop={cutLabel}
        offsetRatio={item.offset > 0 ? offsetRatio : 0}
        isSeam={item.isSeam}
      />
    ),
    [cutLabel, offsetRatio],
  );

  const keyExtractor = useCallback((item: DropTicketData) => String(item.index), []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<DropTicketData> | null | undefined, index: number) => ({
      length: TICKET_WIDTH,
      offset: TICKET_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <AppShell variant="order">
      <ScreenHeader
        title="HANGING ORDER"
        subtitle={roomName}
        leftSlot={
          <HeaderIconButton Icon={ChevronLeft} onPress={onBack} label="back to planner" />
        }
        rightSlot={
          <View style={styles.wallChip}>
            <Text style={styles.wallChipText}>
              {`WALL ${activeIndex + 1} / ${Math.max(1, walls.length)}`}
            </Text>
          </View>
        }
      />

      <View style={styles.body}>
        <ChipRow
          items={wallItems}
          value={activeWall ? activeWall.id : ''}
          onChange={handleWall}
          scrollable
        />

        <View style={styles.ticketWrap}>
          <FlatList
            data={tickets}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            windowSize={5}
            removeClippedSubviews={false}
          />
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintText}>
            START AT THE WINDOW WALL AND HIDE THE LAST SEAM IN THE DARKEST CORNER.
          </Text>
          <View style={styles.hintMeta}>
            <Scissors size={18} color={theme.colors.primary} strokeWidth={1.5} />
            <Text style={styles.hintMetaText}>{`CUT EVERY DROP AT ${cutLabel}`}</Text>
          </View>
          <Image source={assets.sprite4} style={styles.hintSprite} resizeMode="contain" />
        </View>

        <View style={styles.ctaWrap}>
          <PrimaryButton label="WASTE REPORT" Icon={Scissors} onPress={onGameOver} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 14,
    paddingBottom: 18,
  },
  wallChip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm + 2,
    backgroundColor: 'rgba(125,60,111,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallChipText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  ticketWrap: { height: 150, marginTop: 16 },
  hintCard: {
    marginTop: 18,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(125,60,111,0.06)',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 16,
    paddingRight: 96,
    overflow: 'hidden',
  },
  hintText: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 21,
  },
  hintMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  hintMetaText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
  },
  hintSprite: { position: 'absolute', right: 10, bottom: 10, width: 72, height: 72 },
  ctaWrap: { marginTop: 'auto' },
});

export const HangingOrderScreen = memo(HangingOrderScreenBase);
export default HangingOrderScreen;
