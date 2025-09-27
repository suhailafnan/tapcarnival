"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "../_components/GameShell";
import { formatEther, parseEther } from "viem";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const GAME_DURATION = 30;

export default function AimTrainer() {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stake, setStake] = useState("0");
  const [gameOver, setGameOver] = useState(false);

  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const hasSubmittedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  // Read on-chain entry fee to enforce paid entry UX
  const { data: entryFee } = useScaffoldReadContract({
    contractName: "TapKarnival",
    functionName: "entryFee",
  }); // wei BigInt [web:536]

  // Default stake to entry fee when loaded
  useEffect(() => {
    if (entryFee !== undefined) {
      setStake(formatEther(entryFee as bigint));
    }
  }, [entryFee]); // [web:536]

  const { writeContractAsync: playGame } = useScaffoldWriteContract({ contractName: "TapKarnival" }); // [web:364]

  const submitScore = async () => {
    setSubmitting(true);
    try {
      // Always pass value equal to stake (>= entryFee)
      await playGame({
        functionName: "playGame",
        args: [BigInt(score)],
        value: parseEther(stake || "0"),
      });
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }; // [web:541]

  const randomize = () => {
    setPos({
      x: 10 + Math.floor(Math.random() * 80),
      y: 10 + Math.floor(Math.random() * 60),
    });
  };

  const start = () => {
    // clear previous timer if any
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // reset round
    hasSubmittedRef.current = false;
    setScore(0);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    startTsRef.current = Date.now();
    setRunning(true);
    randomize();

    // single countdown
    intervalRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTsRef.current) / 1000);
      const remaining = GAME_DURATION - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setRunning(false);
        setGameOver(true);
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true;
          void submitScore();
        }
      }
    }, 250);
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const onFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!running) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = cx - pos.x;
    const dy = cy - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= 6) {
      setScore(s => s + 3);
      randomize();
    } else {
      setScore(s => (s > 0 ? s - 1 : 0));
    }
  };

  // Events for recent plays
  const { data: events, isLoading } = useScaffoldEventHistory({
    contractName: "TapKarnival",
    eventName: "GamePlayed",
    fromBlock: 0n,
    watch: true,
  }); // [web:439]

  const latest = useMemo(() => (events ?? []).slice(-5).reverse(), [events]);

  // Only allow Start when stake ≥ entryFee
  const canStart =
    !running &&
    !submitting &&
    entryFee !== undefined &&
    (() => {
      try {
        return (parseEther(stake || "0") as bigint) >= (entryFee as bigint);
      } catch {
        return false;
      }
    })(); // [web:541]

  return (
    <GameShell title="Aim Trainer">
      <div className="flex items-center gap-6">
        <div className="text-xl">Time left: {timeLeft}s</div>
        <div className="text-2xl font-bold">Score: {score}</div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-600">Stake (KDA)</label>
          <input
            className="input input-bordered w-28"
            value={stake}
            onChange={e => setStake(e.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Min entry: {entryFee !== undefined ? `${formatEther(entryFee as bigint)} KDA` : "—"}
      </div>

      <div
        className="relative w-full h-64 mt-4 rounded-lg border border-gray-200 bg-white overflow-hidden"
        onClick={onFieldClick}
      >
        {running && (
          <div
            className="absolute bg-blue-500 rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: "24px",
              height: "24px",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        {!running && <div className="absolute inset-0 grid place-items-center text-gray-500">Start to play</div>}
      </div>

      <div className="flex gap-4 mt-4">
        <button className="btn btn-primary" onClick={start} disabled={!canStart}>
          {running ? "Running..." : `Start ${GAME_DURATION}s`}
        </button>
      </div>

      {gameOver && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 text-green-800 px-4 py-3">
          Game Over — submitted score {score} on-chain.
        </div>
      )}
      {submitting && <div className="mt-2 text-sm text-gray-600">Submitting transaction…</div>}

      <h2 className="mt-8 text-xl font-semibold">Recent Plays</h2>
      {isLoading ? (
        <div>Loading events…</div>
      ) : (
        <ul className="mt-2 space-y-2">
          {latest.map((ev: any, i: number) => {
            const [player, s, ts] = ev.args ?? [];
            return (
              <li key={i} className="p-3 rounded border border-gray-200 bg-white">
                <div className="text-sm break-all">Player: {String(player)}</div>
                <div>Score: {String(s)}</div>
                <div className="text-sm text-gray-600">Time: {String(ts)}</div>
              </li>
            );
          })}
        </ul>
      )}
    </GameShell>
  );
}
