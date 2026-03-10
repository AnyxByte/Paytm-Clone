"use client";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { icon: "⊞", label: "Dashboard", active: true },
    { icon: "+", label: "Add Money", active: false },
    { icon: "↑", label: "Transfer", active: false },
    { icon: "◷", label: "History", active: false },
    { icon: "◎", label: "Profile", active: false },
  ];

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
            key={l.label}
            href="#"
            className={[
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition",
              l.active
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-black",
            ].join(" ")}
            onClick={() => (l.active = true)}
          >
            <span className="w-5 text-center text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-black flex items-center justify-center">
          R
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Rohit S.</p>
          <p className="text-xs text-gray-400 mt-0.5">rohit@upi</p>
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
