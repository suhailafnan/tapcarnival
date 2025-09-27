"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "../_components/GameShell";
import { formatEther, parseEther } from "viem";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const GAME_DURATION = 30;
const COLORS = ["red", "green", "blue", "yellow"];

export default function MemoryMatch() {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stake, setStake] = useState("0");
  const [gameOver, setGameOver] = useState(false);

  const [pattern, setPattern] = useState<string[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [ready, setReady] = useState(false);
  const [guess, setGuess] = useState<string[]>([]);

  const hasSubmittedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const timeoutsRef = useRef<number[]>([]);

  // Read entry fee to enforce paid entry and default stake
  const { data: entryFee } = useScaffoldReadContract({
    contractName: "TapKarnival",
    functionName: "entryFee",
  }); // wei BigInt [web:536]

  useEffect(() => {
    if (entryFee !== undefined) {
      setStake(formatEther(entryFee as bigint));
    }
  }, [entryFee]); // [web:536]

  const { writeContractAsync: playGame } = useScaffoldWriteContract({ contractName: "TapKarnival" }); // [web:364]

  const clearPatternTimers = () => {
    timeoutsRef.current.forEach(t => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const submitScore = async () => {
    setSubmitting(true);
    try {
      await playGame({
        functionName: "playGame",
        args: [BigInt(score)],
        value: parseEther(stake || "0"),
      });
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }; // [web:541]

  const start = () => {
    // stop previous
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    clearPatternTimers();

    // reset round
    hasSubmittedRef.current = false;
    setScore(0);
    setGuess([]);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);

    // create new pattern and schedule hide
    const pat = Array.from({ length: 3 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    setPattern(pat);
    setShowPattern(true);
    setReady(false);
    const hideId = window.setTimeout(() => {
      setShowPattern(false);
      setReady(true);
    }, 2000);
    timeoutsRef.current.push(hideId);

    // start countdown
    startTsRef.current = Date.now();
    setRunning(true);
    intervalRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTsRef.current) / 1000);
      const remaining = GAME_DURATION - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        clearPatternTimers();
        setRunning(false);
        setGameOver(true);

        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true;
          void submitScore();
        }
      }
    }, 250);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      clearPatternTimers();
    };
  }, []);

  const choose = (c: string) => {
    if (!running || !ready) return;
    setGuess(g => {
      const next = [...g, c];
      if (next.length === pattern.length) {
        const correct = next.every((v, i) => v === pattern[i]);
        setScore(s => s + (correct ? 5 : 0));

        // next pattern inside same round
        const pat = Array.from({ length: 3 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
        setPattern(pat);
        setShowPattern(true);
        setReady(false);
        const hideId = window.setTimeout(() => {
          setShowPattern(false);
          setReady(true);
        }, 2000);
        timeoutsRef.current.push(hideId);

        return [];
      }
      return next;
    });
  };

  // Events
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
    <GameShell title="Memory Match">
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

      <div className="mt-4">
        <button className="btn btn-primary" onClick={start} disabled={!canStart}>
          {running ? "Running..." : `Start ${GAME_DURATION}s`}
        </button>
      </div>

      <div className="mt-4 rounded border border-gray-200 bg-white p-4">
        {showPattern ? (
          <div className="flex gap-2">
            {pattern.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded text-white" style={{ background: c }}>
                {c}
              </span>
            ))}
          </div>
        ) : ready ? (
          <>
            <div className="mb-2 text-sm text-gray-600">Repeat the 3-color sequence</div>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  className="btn text-white"
                  style={{ background: c }}
                  disabled={!running}
                  onClick={() => choose(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-600">Your guess: {guess.join(", ")}</div>
          </>
        ) : (
          <div className="text-gray-500">Memorize the sequence...</div>
        )}
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
