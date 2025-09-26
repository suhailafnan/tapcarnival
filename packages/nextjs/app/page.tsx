"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { PuzzlePieceIcon, SparklesIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 bg-base-300 text-white">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center px-4 md:px-0 mt-10 md:mt-20">
          <div className="flex items-center gap-4 mb-4">
            <SparklesIcon className="h-10 w-10 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              TapKarnival
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-neutral-content max-w-2xl">
            The Social Arcade on Kadena. Compete in skill-based mini-games, create private rooms, and bet on players.
            On-chain fun, instant payouts.
          </p>
          <Link href="/play" passHref>
            <button className="btn btn-primary btn-lg mt-8 text-white rounded-full px-8 shadow-lg transform transition-transform hover:scale-105">
              Launch App
            </button>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="w-full max-w-4xl mx-auto my-16 md:my-24 p-4 bg-base-200/50 backdrop-blur-md rounded-2xl border border-base-100">
          <div className="flex justify-around items-center text-center">
            <div>
              <p className="text-3xl font-bold text-accent">1,200+</p>
              <p className="text-sm text-neutral-content uppercase tracking-wider">Live Rooms</p>
            </div>
            <div className="h-12 w-px bg-base-100"></div>
            <div>
              <p className="text-3xl font-bold text-accent">5,600+</p>
              <p className="text-sm text-neutral-content uppercase tracking-wider">Players Online</p>
            </div>
            <div className="h-12 w-px bg-base-100"></div>
            <div>
              <p className="text-3xl font-bold text-accent">$150K+</p>
              <p className="text-sm text-neutral-content uppercase tracking-wider">Prizes Won</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-center text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Play */}
            <div className="flex flex-col items-center p-8 bg-base-200 rounded-2xl border border-base-100/50 shadow-xl text-center">
              <PuzzlePieceIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Compete & Win</h3>
              <p className="text-neutral-content">
                Jump into fast-paced mini-games like Tap Race & Reflex Rumble. Top the leaderboard to win KDA prizes.
              </p>
            </div>

            {/* Feature 2: Socialize */}
            <div className="flex flex-col items-center p-8 bg-base-200 rounded-2xl border border-base-100/50 shadow-xl text-center">
              <UserGroupIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Create Rooms</h3>
              <p className="text-neutral-content">
                Start your own public or private rooms. Invite friends, set custom stakes, and choose your favorite game
                mode.
              </p>
            </div>

            {/* Feature 3: Predict */}
            <div className="flex flex-col items-center p-8 bg-base-200 rounded-2xl border border-base-100/50 shadow-xl text-center">
              <TrophyIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Bet & Predict</h3>
              <p className="text-neutral-content">
                Wager on live player-vs-player matches or predict sports outcomes in our simple, on-chain social
                markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
