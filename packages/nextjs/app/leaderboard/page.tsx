"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

// Adjust these if your event signature differs
// Assuming GamePlayed(address player, string game, uint256 score)
type Row = {
  player: string;
  bestByGame: Record<string, bigint>;
  total: bigint; // sum or another metric for overall
};

const GAMES = ["tap", "reflex", "aim", "memory"]; // keep in sync with /play routes

export default function LeaderboardPage() {
  const { data: events } = useScaffoldEventHistory({
    contractName: "TapKarnival",
    eventName: "GamePlayed",
    fromBlock: 0n,
    watch: true,
  });

  // Build per-wallet best scores per game
  const rows = useMemo<Row[]>(() => {
    const best: Map<string, Record<string, bigint>> = new Map();
    (events ?? []).forEach((ev: any) => {
      const [player, game, rawScore] = ev.args ?? [];
      const p = (player as string)?.toLowerCase();
      const g = (game as string)?.toLowerCase();
      const s = BigInt(rawScore ?? 0);
      if (!p || !g) return;

      const rec = best.get(p) ?? {};
      const prev = rec[g] ?? 0n;
      if (s > prev) rec[g] = s;
      best.set(p, rec);
    });

    const out: Row[] = [];
    for (const [player, rec] of best.entries()) {
      let total = 0n;
      for (const g of Object.keys(rec)) total += rec[g];
      out.push({ player, bestByGame: rec, total });
    }
    // Sort by total desc
    out.sort((a, b) => (a.total < b.total ? 1 : -1));
    return out;
  }, [events]);

  // Precompute per-game ranks
  const perGameRanks = useMemo<Record<string, Map<string, number>>>(() => {
    const ranks: Record<string, Map<string, number>> = {};
    for (const g of GAMES) {
      const arr = rows
        .map(r => ({ player: r.player, score: r.bestByGame[g] ?? 0n }))
        .sort((a, b) => (a.score < b.score ? 1 : -1));
      const map = new Map<string, number>();
      let rank = 0;
      let lastScore: bigint | null = null;
      arr.forEach((x, i) => {
        if (lastScore === null || x.score !== lastScore) {
          rank = i + 1;
          lastScore = x.score;
        }
        map.set(x.player, rank);
      });
      ranks[g] = map;
    }
    return ranks;
  }, [rows]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <Link href="/play" className="text-primary underline">
            Back to Play
          </Link>
        </div>
        <p className="text-gray-600 mt-1">Best scores per wallet across all games, live from events.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Overall</th>
                <th>Wallet</th>
                {GAMES.map(g => (
                  <th key={g}>{g.toUpperCase()} (rank / score)</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.player}>
                  <td>#{i + 1}</td>
                  <td className="font-mono break-all">{r.player}</td>
                  {GAMES.map(g => {
                    const score = r.bestByGame[g] ?? 0n;
                    const rank = perGameRanks[g]?.get(r.player);
                    return (
                      <td key={g}>
                        {rank ? `#${rank}` : "—"} / {score.toString()}
                      </td>
                    );
                  })}
                  <td>{r.total.toString()}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={2 + GAMES.length + 1}>
                    <div className="py-6 text-center text-gray-600">
                      No plays yet. Play a game to populate the leaderboard.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Tip: open /storage to snapshot the top‑10 into a CID after a few plays.
        </div>
      </div>
    </main>
  );
}
