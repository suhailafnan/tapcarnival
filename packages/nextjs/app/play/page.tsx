"use client";

import Link from "next/link";
import { BoltIcon, ChartBarIcon, EyeIcon, LightBulbIcon, PlayIcon } from "@heroicons/react/24/outline";

export default function PlayHub() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BoltIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              TapKarnival Games
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose your challenge! Each game runs for 10 seconds. Your scores are recorded on-chain and you can compete
            for prizes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <ChartBarIcon className="h-5 w-5" />
              Create Room
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </header>

        {/* Games Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <GameCard
            title="Tap Race"
            desc="Tap as fast as possible in 10 seconds"
            href="/play/tap"
            icon={BoltIcon}
            gradient="from-blue-500 to-blue-600"
            difficulty="Easy"
          />
          <GameCard
            title="Reflex Rumble"
            desc="Tap only when the flash appears - timing is everything"
            href="/play/reflex"
            icon={EyeIcon}
            gradient="from-purple-500 to-purple-600"
            difficulty="Medium"
          />
          <GameCard
            title="Aim Trainer"
            desc="Click the moving target - precision matters"
            href="/play/aim"
            icon={EyeIcon}
            gradient="from-emerald-500 to-emerald-600"
            difficulty="Hard"
          />
          <GameCard
            title="Memory Match"
            desc="Memorize the 3-color sequence and repeat it"
            href="/play/memory"
            icon={LightBulbIcon}
            gradient="from-rose-500 to-rose-600"
            difficulty="Medium"
          />
        </section>

        {/* Quick Stats */}
        <section className="mt-20 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8">Game Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Games Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">10s</div>
              <div className="text-sm text-gray-600">Game Duration</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Replays</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">KDA</div>
              <div className="text-sm text-gray-600">Prize Currency</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GameCard({
  title,
  desc,
  href,
  icon: Icon,
  gradient,
  difficulty,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  difficulty: string;
}) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Link href={href} className="group block">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
        {/* Gradient Header */}
        <div className={`h-20 bg-gradient-to-r ${gradient} relative`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 left-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{desc}</p>

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
              <PlayIcon className="h-4 w-4 mr-2" />
              Play Now
            </div>
            <svg
              className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
