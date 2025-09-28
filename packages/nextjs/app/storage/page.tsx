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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Storage Snapshots
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload leaderboard snapshots to IPFS and retrieve them by CID. Store your game data permanently on the
            decentralized web.
          </p>
        </div>

        {/* Create Snapshot Section */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Snapshot</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Top 10 Players</h3>
                <div className="space-y-2">
                  {top10.length > 0 ? (
                    top10.slice(0, 5).map(([address, score], index) => (
                      <div
                        key={address}
                        className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <span className="font-mono text-sm text-gray-600 truncate max-w-[120px]">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{score.toString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No game data available yet</div>
                  )}
                </div>
                {top10.length > 5 && (
                  <div className="text-xs text-gray-500 mt-2">+ {top10.length - 5} more players</div>
                )}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                onClick={snapshot}
                disabled={loading || top10.length === 0}
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading to IPFS...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    Snapshot & Upload to IPFS
                  </>
                )}
              </button>
            </div>

            {/* CID Display */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">IPFS Content ID (CID)</h3>
                {cid ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-xs text-gray-500 mb-1">Hash</div>
                      <div className="font-mono text-sm text-gray-900 break-all">{cid}</div>
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      onClick={loadByCid}
                      disabled={loading}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Load This Snapshot
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="h-12 w-12 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-gray-500 text-sm">No snapshot created yet</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loaded Snapshot Section */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Loaded Snapshot</h2>
          </div>

          {!loaded ? (
            <div className="text-center py-12">
              <svg
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div className="text-gray-500 text-lg mb-2">No snapshot loaded</div>
              <div className="text-gray-400 text-sm">Upload a snapshot first, then load it by CID</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Snapshot Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Snapshot Created</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(loaded.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700 mb-1">Total Players</div>
                    <div className="text-2xl font-bold text-purple-600">{loaded.entries.length}</div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loaded.entries.map((e: { address: string; score: string }, i: number) => (
                        <tr key={e.address + i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  i === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : i === 1
                                      ? "bg-gray-100 text-gray-800"
                                      : i === 2
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {i + 1}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono text-sm text-gray-900">
                              {e.address.slice(0, 8)}...{e.address.slice(-6)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{e.score}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
