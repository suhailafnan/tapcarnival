"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Room = { id: string; name: string; createdAt: number; players: string[] };

// Load recent rooms from sessionStorage (simple hackathon-friendly cache)
const loadRooms = (): Room[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("tk_rooms");
    return raw ? (JSON.parse(raw) as Room[]) : [];
  } catch {
    return [];
  }
};

export default function RoomLobby({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap async params per Next.js 15 dynamic APIs guidance
  const { id: rawId } = React.use(params); // [web:706]
  const id = (rawId || "").toUpperCase();

  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => setRooms(loadRooms()), []);

  const room = useMemo(() => rooms.find(r => r.id === id), [rooms, id]);

  // Helpers to compute share URL safely
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/rooms/${id}` : `/rooms/${id}`;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard may require https/user gesture; ignore in dev
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Room {id}</h1>
          <Link href="/rooms" className="text-primary underline">
            Back to Rooms
          </Link>
        </div>

        {room ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="text-lg font-semibold">{room.name}</div>
            <div className="text-sm text-gray-600">Created: {new Date(room.createdAt).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Players: {room.players.length}</div>

            <div className="mt-4">
              <div className="text-sm text-gray-600">Share this code with friends:</div>
              <div className="mt-1 font-mono text-lg">{id}</div>
              <div className="mt-2 text-xs text-gray-500 break-all">
                Link: <span className="ml-1">{shareUrl}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button className="btn btn-outline btn-sm" onClick={() => copyText(shareUrl)}>
                  Copy Link
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => copyText(id)}>
                  Copy Code
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/play" className="btn btn-primary">
                Go to Games
              </Link>
              <Link href="/leaderboard" className="btn btn-secondary">
                View Leaderboard
              </Link>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-1">Jump into a game:</div>
              <div className="flex flex-wrap gap-2">
                <Link href="/play/tap" className="btn btn-outline btn-sm">
                  Tap Race
                </Link>
                <Link href="/play/reflex" className="btn btn-outline btn-sm">
                  Reflex
                </Link>
                <Link href="/play/aim" className="btn btn-outline btn-sm">
                  Aim
                </Link>
                <Link href="/play/memory" className="btn btn-outline btn-sm">
                  Memory
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="text-lg font-semibold">This room isn’t in your recent list.</div>
            <div className="text-sm text-gray-600 mt-1">You can still play together using the code above.</div>
            <div className="mt-6 flex gap-3">
              <Link href="/play" className="btn btn-primary">
                Go to Games
              </Link>
              <Link href="/rooms" className="btn btn-secondary">
                Create/Join Rooms
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
