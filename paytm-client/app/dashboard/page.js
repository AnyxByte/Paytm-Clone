"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import BalanceCard from "@/components/dashboard/BalanceCard";
import Transactions from "@/components/dashboard/Transaction";
import { useUser } from "@/context/AuthContext";
// import Transactions from "@/components/dashboard/Transactions";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Welcome back
            </p>
            <h1 className="text-2xl font-black tracking-tight">Rohit Sharma</h1>
          </div>

          {/* Top row */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            <div className="">
              <BalanceCard />
            </div>
          </div>

          {/* Transactions */}
          <Transactions />
        </div>
      </main>
    </div>
  );
}
