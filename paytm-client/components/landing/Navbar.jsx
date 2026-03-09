"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 px-6 md:px-16 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <span className="text-lg font-black tracking-tight">
          Pay<span className="text-blue-600">Zap</span>
        </span>
        <div className="hidden md:flex gap-6">
          {["Send Money", "Request", "History"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-gray-500 hover:text-black font-medium transition"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Link href="/auth/login">
          <button className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 transition">
            Log in
          </button>
        </Link>
        <Link href="/auth/signup">
          <button className="cursor-pointer text-sm font-bold bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
