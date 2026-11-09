import { useCallback, useState } from 'react';
import { DEMO_ROOMS } from '../constants/config';
import type { Room } from '../game/dropEngine';

/** Shelf CRUD — in-memory, fully offline. */
export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>(DEMO_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(DEMO_ROOMS[0]?.id ?? null);

  const saveRoom = useCallback((room: Room) => {
    setRooms(prev => {
      const index = prev.findIndex(r => r.id === room.id);
      if (index < 0) {
        return [room, ...prev];
      }
      const next = prev.slice();
      next[index] = room;
      return next;
    });
    setActiveRoomId(room.id);
  }, []);

  const selectRoom = useCallback((id: string) => {
    setActiveRoomId(id);
  }, []);

  return { rooms, activeRoomId, saveRoom, selectRoom };
}

export default useRooms;
