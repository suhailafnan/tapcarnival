"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon, PuzzlePieceIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";
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
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-2 px-4 text-sm rounded-full gap-2 grid grid-flow-col font-medium items-center transition-colors duration-300`}
            >
              {icon}
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
      className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2"
      ref={burgerMenuRef}
    >
      {/* Logo and brand name */}
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden">
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost"
            onClick={() => {
              setIsDrawerOpen(prevIsOpen => !prevIsOpen);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="TapKarnival logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              TapKarnival
            </span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* Wallet Connection */}
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full bg-base-200 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden z-10`}
      >
        <ul
          className="menu menu-compact p-4"
          onClick={() => {
            setIsDrawerOpen(false);
          }}
        >
          <HeaderMenuLinks />
        </ul>
      </div>
    </div>
  );
};
