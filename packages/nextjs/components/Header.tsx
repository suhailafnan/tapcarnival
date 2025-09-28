"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  BugAntIcon,
  BuildingOfficeIcon,
  CloudArrowUpIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

// Updated menu links for TapKarnival
export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Play",
    href: "/play",
    icon: <PuzzlePieceIcon className="h-5 w-5" />,
  },
  {
    label: "Rooms",
    href: "/rooms",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: <TrophyIcon className="h-5 w-5" />,
  },
  {
    label: "Storage",
    href: "/storage",
    icon: <CloudArrowUpIcon className="h-5 w-5" />,
  },
  {
    label: "Real Estate",
    href: "/real-estate",
    icon: <BuildingOfficeIcon className="h-5 w-5" />,
  },
  {
    label: "Debug",
    href: "/debug",
    icon: <BugAntIcon className="h-5 w-5" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              } flex items-center gap-2 py-2 px-4 text-sm rounded-lg font-medium transition-all duration-200 group`}
            >
              <span
                className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div
      className="sticky top-0 navbar bg-white/80 backdrop-blur-md border-b border-gray-200 min-h-0 flex-shrink-0 justify-between z-20 shadow-sm"
      ref={burgerMenuRef}
    >
      {/* Logo and brand name */}
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden">
          <button
            className="btn btn-ghost btn-sm p-2"
            onClick={() => {
              setIsDrawerOpen(prevIsOpen => !prevIsOpen);
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <Link href="/" passHref className="flex items-center gap-3 ml-2 lg:ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="TapKarnival logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-xl leading-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              TapKarnival
            </span>
            <span className="text-xs text-gray-500 -mt-1">Social Arcade</span>
          </div>
        </Link>

        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-1">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* Wallet Connection */}
      <div className="navbar-end flex-grow mr-2 lg:mr-4">
        <div className="flex items-center gap-2">
          <RainbowKitCustomConnectButton />
          <FaucetButton />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden z-10 shadow-lg`}
      >
        <div
          className="p-4 space-y-2"
          onClick={() => {
            setIsDrawerOpen(false);
          }}
        >
          <HeaderMenuLinks />
        </div>
      </div>
    </div>
  );
};
