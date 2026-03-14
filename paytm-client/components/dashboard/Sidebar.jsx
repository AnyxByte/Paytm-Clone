"use client";
import { useUser } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const links = [
    { icon: "⊞", label: "Dashboard", active: true, route: "/dashboard" },
    {
      icon: "+",
      label: "Add Money",
      active: false,
      route: "/dashboard/addMoney",
    },
    {
      icon: "↑",
      label: "Transfer",
      active: false,
      route: "/dashboard/transfer",
    },
    { icon: "◷", label: "History", active: false, route: "/dashboard/history" },
    { icon: "◎", label: "Profile", active: false, route: "/dashboard/profile" },
  ];

  const pathName = usePathname();

  const { user } = useUser();

  const name = user?.name || "Anon";
  const email = user?.email || "anon@anon.com";

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-black tracking-tight">
          Pay<span className="text-blue-600">Tm</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.icon}
            href={`${l.route}`}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition 
              ${
                pathName === l.route
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            <span className="w-5 text-center text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-black flex items-center justify-center">
          {name[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold leading-none">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{email}</p>
        </div>
        <Link
          href="/auth/login"
          className="ml-auto text-gray-300 hover:text-red-400 transition text-lg leading-none"
        >
          ⇥
        </Link>
      </div>
    </aside>
  );
}
