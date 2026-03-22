"use client";
import Transactions from "@/components/dashboard/Transaction";
import Link from "next/link";
// import Transactions from "@/components/dashboard/Transactions";

export default function History() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-xs text-gray-400 font-semibold hover:text-black transition"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black tracking-tight mt-2">
          Transaction History
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          All your past deposits and transfers
        </p>
      </div>

      {/* Transactions */}
      <Transactions />
    </div>
  );
}
