"use client";

import Link from "next/link";

export function GameShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          <Link href="/play" className="text-primary underline">
            All games
          </Link>
        </header>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">{children}</div>
      </div>
    </main>
  );
}
