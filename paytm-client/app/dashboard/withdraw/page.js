"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useWallet } from "@/context/WalletContext";
import toast from "react-hot-toast";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { walletDetails, setWalletDetails } = useWallet();

  const balance = walletDetails?.balance ?? 0;

  const handleWithdraw = async () => {
    setError("");
    setSuccess(false);

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (Number(amount) > balance) {
      setError("Insufficient balance.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/withdraw`,
        {
          fromAccount: walletDetails?.account?._id,
          amount: Number(amount),
          idempotencyKey: crypto.randomUUID(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("withdraw response", response.data);
      setWalletDetails((prev) => {
        return {
          ...prev,
          balance: response.data.balance,
        };
      });

      toast.success("Withdrawn Successfully");
    } catch (err) {
      setError(err.response?.data?.msg || "Withdrawal failed. Try again.");
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-xs text-gray-400 font-semibold hover:text-black transition"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black tracking-tight mt-2">
            Withdraw Money
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Simulate a withdrawal from your wallet
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Balance Banner */}
          <div className="bg-blue-600 px-6 py-5">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">
              Available Balance
            </p>
            <p className="text-3xl font-black text-white">
              ₹{balance.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Amount Input */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                    setSuccess(false);
                  }}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-black outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAmount(String(a));
                      setError("");
                      setSuccess(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition
                      ${
                        amount === String(a)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
              <p className="text-xs text-yellow-700 font-semibold">
                ⚠ Withdrawals are simulated. No real money will be transferred.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                ⚠ {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
                ✓ ₹{amount} withdrawn successfully!
              </p>
            )}

            {/* Button */}
            <button
              onClick={handleWithdraw}
              disabled={!amount || Number(amount) <= 0 || loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Withdraw ₹${amount || "0"} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
