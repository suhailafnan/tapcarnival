"use client";

import Link from "next/link";

export default function PlayHub() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">TapKarnival — Games</h1>
            <p className="text-gray-600 mt-2">Choose a game, play for 10s, and submit the score on-chain.</p>
          </div>
          <Link href="/debug" className="text-primary underline">
            Debug Contracts
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameCard
            title="Tap Race"
            desc="Tap as fast as possible in 10 seconds."
            href="/play/tap"
            accent="bg-blue-500"
          />
          <GameCard
            title="Reflex Rumble"
            desc="Tap only when the flash appears; timing is everything."
            href="/play/reflex"
            accent="bg-purple-500"
          />
          <GameCard
            title="Aim Trainer"
            desc="Click the moving target; hits add points, misses deduct."
            href="/play/aim"
            accent="bg-emerald-500"
          />
          <GameCard
            title="Memory Match"
            desc="Memorize a 3-color sequence and repeat it to score."
            href="/play/memory"
            accent="bg-rose-500"
          />
        </section>
      </div>
    </main>
  );
}

function GameCard({ title, desc, href, accent }: { title: string; desc: string; href: string; accent: string }) {
  return (
    <Link href={href} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
        <div className={`h-2 w-full ${accent}`} />
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{desc}</p>
          <div className="mt-4 inline-flex items-center text-primary">
            Play now
            <svg
              className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
