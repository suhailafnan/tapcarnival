"use client";

import { useMemo, useState } from "react";
import { Snapshot, fetchJSON, uploadJSON } from "../lib/storage";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export default function StoragePage() {
  const { data: events } = useScaffoldEventHistory({
    contractName: "TapKarnival",
    eventName: "GamePlayed",
    fromBlock: 0n,
    watch: true,
  });

  const top10 = useMemo(() => {
    const best = new Map<string, bigint>();
    (events ?? []).forEach((ev: any) => {
      const [player, s] = ev.args ?? [];
      const score = BigInt(s ?? 0);
      const prev = best.get(player) ?? 0n;
      if (score > prev) best.set(player, score);
    });
    return [...best.entries()].sort((a, b) => (a[1] < b[1] ? 1 : -1)).slice(0, 10);
  }, [events]);

  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState<Snapshot | null>(null);

  const snapshot = async () => {
    setLoading(true);
    try {
      const snap: Snapshot = {
        timestamp: Date.now(),
        entries: top10.map(([address, score]) => ({ address, score: score.toString() })),
      };
      const c = await uploadJSON(snap);
      setCid(c);
      setLoaded(null);
    } finally {
      setLoading(false);
    }
  };

  const loadByCid = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const data = await fetchJSON<Snapshot>(cid);
      setLoaded(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Storage Snapshots</h1>
        <p className="text-gray-600 mt-1">Upload leaderboard snapshots and retrieve by CID.</p>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold">Create Snapshot</h2>
          <button className="btn btn-primary mt-3" onClick={snapshot} disabled={loading}>
            {loading ? "Uploading..." : "Snapshot Top 10 → Upload"}
          </button>
          <div className="mt-3 text-sm">
            CID: <span className="font-mono break-all">{cid || "—"}</span>
          </div>
          <div className="mt-2">
            <button className="btn btn-outline btn-sm" onClick={loadByCid} disabled={!cid || loading}>
              Load This CID
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold">Loaded Snapshot</h2>
          {!loaded ? (
            <div className="text-gray-600">No snapshot loaded.</div>
          ) : (
            <div>
              <div className="text-sm text-gray-600">Timestamp: {new Date(loaded.timestamp).toLocaleString()}</div>
              <table className="table w-full mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {loaded.entries.map((e: { address: string; score: string }, i: number) => (
                    <tr key={e.address + i}>
                      <td>{i + 1}</td>
                      <td className="break-all">{e.address}</td>
                      <td>{e.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
