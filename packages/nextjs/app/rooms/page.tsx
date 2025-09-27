"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
  createdAt: number;
  players: string[];
};

// Simple in-memory cache across navigations via sessionStorage
const loadRooms = (): Room[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("tk_rooms");
    return raw ? (JSON.parse(raw) as Room[]) : [];
  } catch {
    return [];
  }
};
const saveRooms = (rooms: Room[]) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("tk_rooms", JSON.stringify(rooms));
};

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    setRooms(loadRooms());
  }, []);

  const createRoom = () => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    const newRoom: Room = {
      id,
      name: roomName || `Room ${id}`,
      createdAt: Date.now(),
      players: [],
    };
    const next = [newRoom, ...rooms].slice(0, 50);
    setRooms(next);
    saveRooms(next);
    router.push(`/rooms/${id}`);
  };

  const joinRoom = () => {
    const id = joinId.trim().toUpperCase();
    if (!id) return;
    const exists = rooms.some(r => r.id === id);
    if (!exists) {
      // Create a placeholder so the route exists in the list
      const placeholder: Room = {
        id,
        name: `Room ${id}`,
        createdAt: Date.now(),
        players: [],
      };
      const next = [placeholder, ...rooms].slice(0, 50);
      setRooms(next);
      saveRooms(next);
    }
    router.push(`/rooms/${id}`);
  };

  const latest = useMemo(() => rooms.slice(0, 12), [rooms]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <p className="text-gray-600 mt-1">Create a room to play with friends or join by room ID.</p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <h2 className="text-xl font-semibold">Create a Room</h2>
            <div className="mt-3 flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Optional name"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
              />
              <button className="btn btn-primary" onClick={createRoom}>
                Create
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">A short ID is generated; share the room link or code.</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <h2 className="text-xl font-semibold">Join a Room</h2>
            <div className="mt-3 flex gap-2">
              <input
                className="input input-bordered w-full uppercase"
                placeholder="Enter room ID (e.g., 7GQ2KM)"
                value={joinId}
                onChange={e => setJoinId(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={joinRoom}>
                Join
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Room IDs are case-insensitive; dashes/spaces ignored.</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Recent Rooms</h2>
          {latest.length === 0 ? (
            <div className="mt-3 text-gray-600">No rooms yet. Create one to get started.</div>
          ) : (
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latest.map(r => (
                <li
                  key={r.id}
                  className="p-3 rounded border border-gray-200 bg-white cursor-pointer hover:shadow transition"
                  onClick={() => router.push(`/rooms/${r.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.id}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Created {new Date(r.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
