import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Layers, PencilRuler, Ruler, Settings } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { computeDrops } from '../game/dropEngine';
import type { Room, Settings as AppSettings } from '../game/dropEngine';
import AppShell from '../components/AppShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import Masthead from '../components/Masthead';
import RoomCard from '../components/RoomCard';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SettingsSheet from '../components/SettingsSheet';

const CARD_HEIGHT = 120;

type ShelfRow = {
  id: string;
  name: string;
  meta: string;
  rolls: number;
  batch?: string;
};

type Props = {
  rooms: Room[];
  settings: AppSettings;
  lastRoomId: string | null;
  onChangeSettings: (patch: Partial<AppSettings>) => void;
  onStartPlanning: () => void;
  onOpenRoom: (id: string) => void;
};

function EmptyShelf() {
  return (
    <View style={styles.empty}>
      <Image source={assets.sprite2} style={styles.emptySprite} resizeMode="contain" />
      <Text style={styles.emptyTitle}>NO ROOMS YET</Text>
      <Text style={styles.emptyHint}>MEASURE YOUR FIRST WALL</Text>
    </View>
  );
}

/** Room Shelf - asymmetric editorial layout (M4). */
function MenuScreenBase({
  rooms,
  settings,
  lastRoomId,
  onChangeSettings,
  onStartPlanning,
  onOpenRoom,
}: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);

  const openSheet = useCallback(() => setSheetVisible(true), []);
  const closeSheet = useCallback(() => setSheetVisible(false), []);

  const shelf: ShelfRow[] = useMemo(
    () =>
      rooms.map(room => {
        const result = computeDrops(room.walls, room.roll, settings);
        return {
          id: room.id,
          name: room.name,
          meta: `${room.walls.length} WALLS * ${room.roll.rollLength.toFixed(2)} m ROLL`,
          rolls: result.rollsToBuy,
          batch: room.batch,
        };
      }),
    [rooms, settings],
  );

  const totalRolls = useMemo(
    () => shelf.reduce((sum, row) => sum + row.rolls, 0),
    [shelf],
  );

  const openLast = useCallback(() => {
    if (lastRoomId) {
      onOpenRoom(lastRoomId);
    }
  }, [lastRoomId, onOpenRoom]);

  const renderItem = useCallback(
    ({ item, index }: { item: ShelfRow; index: number }) => (
      <RoomCard
        id={item.id}
        name={item.name}
        meta={item.meta}
        rolls={item.rolls}
        batch={item.batch}
        index={index}
        onPress={onOpenRoom}
      />
    ),
    [onOpenRoom],
  );

  const keyExtractor = useCallback((item: ShelfRow) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<ShelfRow> | null | undefined, index: number) => ({
      length: CARD_HEIGHT,
      offset: CARD_HEIGHT * index,
      index,
    }),
    [],
  );

  const showStats = shelf.length > 0 && totalRolls > 0;

  return (
    <AppShell variant="menu">
      <ScreenHeader
        tinted={false}
        title="DROP RECKONER"
        leftSlot={
          <Image source={assets.iconHome} style={styles.homeMark} resizeMode="contain" />
        }
        rightSlot={
          <HeaderIconButton
            Icon={Settings}
            onPress={openSheet}
            color={theme.colors.textSecondary}
            label="decor settings"
          />
        }
      />

      <View style={styles.body}>
        <View style={styles.mastheadBlock}>
          <Masthead lineOne="ROOM" lineTwo="SHELF" tagline="SAVED ROOMS AND ROLL TOTALS" />
          <Image source={assets.sprite1} style={styles.heroArt} resizeMode="contain" />
        </View>

        <FlatList
          data={shelf}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={4}
          windowSize={5}
          removeClippedSubviews={false}
          ListEmptyComponent={EmptyShelf}
        />

        {showStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Layers}
                value={totalRolls}
                label="rolls saved"
                valueColor={theme.colors.accent}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Ruler}
                value={shelf.length}
                label="rooms"
                valueColor={theme.colors.primary}
              />
            </View>
          </View>
        ) : null}

        <Text style={styles.ctaHint}>ADD WALLS, THEN THE ROLL SPEC</Text>

        <PrimaryButton
          label="START PLANNING"
          Icon={PencilRuler}
          onPress={onStartPlanning}
        />

        {lastRoomId ? (
          <View style={styles.secondaryWrap}>
            <SecondaryButton label="OPEN LAST ROOM" tone="plum" onPress={openLast} />
          </View>
        ) : null}
      </View>

      <SettingsSheet
        visible={sheetVisible}
        settings={settings}
        onChange={onChangeSettings}
        onClose={closeSheet}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: theme.spacing.xl, paddingBottom: 18 },
  homeMark: { width: 28, height: 28 },
  mastheadBlock: { height: 150, justifyContent: 'center' },
  heroArt: {
    position: 'absolute',
    right: 8,
    top: 14,
    width: 112,
    height: 112,
    opacity: 0.95,
  },
  list: { flex: 1 },
  listContent: { paddingTop: 4, paddingBottom: 6 },
  empty: {
    width: '100%',
    paddingVertical: 22,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(125,60,111,0.35)',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  emptySprite: { width: 92, height: 92 },
  emptyTitle: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 8,
    letterSpacing: 0.6,
  },
  emptyHint: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.6,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 6, marginBottom: 14 },
  statSlot: { flex: 1 },
  ctaHint: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  secondaryWrap: { marginTop: 10 },
});

export const MenuScreen = memo(MenuScreenBase);
export default MenuScreen;
