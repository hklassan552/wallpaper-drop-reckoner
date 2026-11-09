/**
 * Wallpaper Drop Reckoner - screen state machine only, never gameplay (rule #2).
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import theme from './src/constants/theme';
import { DEFAULT_ROLL, DEFAULT_SETTINGS, WALL_DEFAULT } from './src/constants/config';
import type {
  Opening,
  RollSpec,
  Room,
  Settings as AppSettings,
  Wall,
} from './src/game/dropEngine';
import useRooms from './src/hooks/useRooms';
import useDropCalc from './src/hooks/useDropCalc';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import HangingOrderScreen from './src/screens/HangingOrderScreen';
import GameOverScreen from './src/screens/GameOverScreen';

type Screen = 'loader' | 'menu' | 'game' | 'order' | 'gameover';

type Draft = {
  id: string;
  name: string;
  walls: Wall[];
  roll: RollSpec;
  batch: string;
};

function makeWall(id: string): Wall {
  return {
    id,
    width: WALL_DEFAULT.width,
    height: WALL_DEFAULT.height,
    openings: [],
  };
}

function makeDraft(id: string, name: string): Draft {
  return {
    id,
    name,
    walls: [makeWall(`${id}-w1`)],
    roll: { ...DEFAULT_ROLL },
    batch: '',
  };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState<Draft>(() => makeDraft('draft-1', 'NEW ROOM'));

  const { rooms, activeRoomId, saveRoom, selectRoom } = useRooms();
  const counter = useRef(1);

  const result = useDropCalc(draft.walls, draft.roll, settings);

  /* ---------- navigation ---------- */
  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goOrder = useCallback(() => setScreen('order'), []);
  const goGameOver = useCallback(() => setScreen('gameover'), []);
  const loaderDone = useCallback(() => setScreen('menu'), []);

  const startPlanning = useCallback(() => {
    counter.current += 1;
    setDraft(makeDraft(`draft-${counter.current}`, `ROOM ${counter.current}`));
    setScreen('game');
  }, []);

  const openRoom = useCallback(
    (id: string) => {
      const room = rooms.find(r => r.id === id);
      if (!room) {
        return;
      }
      selectRoom(id);
      setDraft({
        id: room.id,
        name: room.name,
        walls: room.walls.map(w => ({ ...w, openings: w.openings.map(o => ({ ...o })) })),
        roll: { ...room.roll },
        batch: room.batch ?? '',
      });
      setScreen('game');
    },
    [rooms, selectRoom],
  );

  /* ---------- draft editing ---------- */
  const changeSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const addWall = useCallback(() => {
    setDraft(prev => ({
      ...prev,
      walls: [...prev.walls, makeWall(`${prev.id}-w${prev.walls.length + 1}`)],
    }));
  }, []);

  const changeWall = useCallback((wallId: string, patch: Partial<Wall>) => {
    setDraft(prev => ({
      ...prev,
      walls: prev.walls.map(w => (w.id === wallId ? { ...w, ...patch } : w)),
    }));
  }, []);

  const addOpening = useCallback((wallId: string, type: 'door' | 'window') => {
    setDraft(prev => ({
      ...prev,
      walls: prev.walls.map(w => {
        if (w.id !== wallId) {
          return w;
        }
        const opening: Opening =
          type === 'door'
            ? {
                id: `${wallId}-o${w.openings.length + 1}`,
                type: 'door',
                width: 0.86,
                height: Math.min(2.04, w.height - 0.1),
                x: Math.max(0, w.width / 2 - 0.43),
                sillHeight: 0,
              }
            : {
                id: `${wallId}-o${w.openings.length + 1}`,
                type: 'window',
                width: 1.2,
                height: 1.1,
                x: Math.max(0, w.width / 2 - 0.6),
                sillHeight: 0.95,
              };
        return { ...w, openings: [...w.openings, opening] };
      }),
    }));
  }, []);

  const moveOpening = useCallback((wallId: string, openingId: string, x: number) => {
    setDraft(prev => ({
      ...prev,
      walls: prev.walls.map(w => {
        if (w.id !== wallId) {
          return w;
        }
        return {
          ...w,
          openings: w.openings.map(o =>
            o.id === openingId
              ? { ...o, x: Math.max(0, Math.min(w.width - o.width, x)) }
              : o,
          ),
        };
      }),
    }));
  }, []);

  const changeRoll = useCallback((patch: Partial<RollSpec>) => {
    setDraft(prev => ({ ...prev, roll: { ...prev.roll, ...patch } }));
  }, []);

  const changeBatch = useCallback((text: string) => {
    setDraft(prev => ({ ...prev, batch: text }));
  }, []);

  const saveToShelf = useCallback(() => {
    const room: Room = {
      id: draft.id,
      name: draft.name,
      walls: draft.walls,
      roll: draft.roll,
      batch: draft.batch ? draft.batch : undefined,
    };
    saveRoom(room);
    setScreen('menu');
  }, [draft, saveRoom]);

  const content = useMemo(() => {
    if (screen === 'loader') {
      return <LoaderScreen onDone={loaderDone} />;
    }

    if (screen === 'menu') {
      return (
        <MenuScreen
          rooms={rooms}
          settings={settings}
          lastRoomId={activeRoomId}
          onChangeSettings={changeSettings}
          onStartPlanning={startPlanning}
          onOpenRoom={openRoom}
        />
      );
    }

    if (screen === 'game') {
      return (
        <GameScreen
          roomName={draft.name}
          walls={draft.walls}
          roll={draft.roll}
          settings={settings}
          result={result}
          onBack={goMenu}
          onAddWall={addWall}
          onChangeWall={changeWall}
          onAddOpening={addOpening}
          onMoveOpening={moveOpening}
          onChangeRoll={changeRoll}
          onSeeOrder={goOrder}
          onGameOver={goGameOver}
        />
      );
    }

    if (screen === 'order') {
      return (
        <HangingOrderScreen
          roomName={draft.name}
          walls={draft.walls}
          roll={draft.roll}
          cutDrop={result.cutDrop}
          settings={settings}
          onBack={goGame}
          onGameOver={goGameOver}
        />
      );
    }

    return (
      <GameOverScreen
        roomName={draft.name}
        result={result}
        settings={settings}
        batch={draft.batch}
        onChangeBatch={changeBatch}
        onPlanAgain={goGame}
        onSave={saveToShelf}
        onBack={goGame}
        onMenu={goMenu}
      />
    );
  }, [
    activeRoomId,
    addOpening,
    addWall,
    changeBatch,
    changeRoll,
    changeSettings,
    changeWall,
    draft.batch,
    draft.name,
    draft.roll,
    draft.walls,
    goGame,
    goGameOver,
    goMenu,
    goOrder,
    loaderDone,
    moveOpening,
    openRoom,
    result,
    rooms,
    saveToShelf,
    screen,
    settings,
    startPlanning,
  ]);

  return <SafeAreaView style={styles.root}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});
