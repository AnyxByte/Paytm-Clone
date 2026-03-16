"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Select from 'react-select';

const QUICK_AMOUNTS = [100, 200, 500, 1000];

// mock users for now — replace with real API call
const ALL_USERS = [
  { id: "1", name: "Priya Mehta", upi: "priya@upi", initial: "P" },
  { id: "2", name: "Aman Kumar", upi: "aman@upi", initial: "A" },
  { id: "3", name: "Sneha Rao", upi: "sneha@upi", initial: "S" },
  { id: "4", name: "Rahul Verma", upi: "rahul@upi", initial: "R" },
  { id: "5", name: "Neha Singh", upi: "neha@upi", initial: "N" },
  { id: "6", name: "Vikram Das", upi: "vikram@upi", initial: "V" },
];

export default function TransferPage() {
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const token = Cookies.get("token");

  const filtered = ALL_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.upi.toLowerCase().includes(query.toLowerCase()),
  );

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (user) => {
    setSelected(user);
    setQuery(user.name);
    setDropdown(false);
  };

  const handleTransfer = async () => {
    if (!selected || !amount || Number(amount) <= 0) return;
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/create`,
        {
          toUpiId: selected.upi,
          amount: Number(amount),
          note,
          idempotencyKey: `txn_${Date.now()}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccess(true);
      setSelected(null);
      setQuery("");
      setAmount("");
      setNote("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.msg || "Transfer failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-start justify-center px-4 pt-10 pb-20">
      <div className="w-full max-w-2xl flex flex-col gap-5">
        {/* Header */}
        <div>
          <a
            href="/dashboard"
            className="text-xs text-gray-400 font-semibold hover:text-black transition"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-2xl font-black tracking-tight mt-2">
            Send Money
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Transfer instantly to any PayZap user
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible">
          {/* Blue header */}
          <div className="bg-blue-600 px-8 py-5 rounded-t-2xl">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">
              Transfer Details
            </p>
          </div>

          <div className="px-8 py-7 flex flex-col gap-5">
            {/* Search Dropdown */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Search Recipient
              </label>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdown(true);
                    setSelected(null);
                  }}
                  onFocus={() => setDropdown(true)}
                  placeholder="Search by name or UPI ID..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
                />

                {/* Dropdown */}
                {dropdown && query.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-gray-400 text-center">
                        No users found
                      </div>
                    ) : (
                      filtered.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSelect(u)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0"
                        >
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center flex-shrink-0">
                            {u.initial}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black">
                              {u.name}
                            </p>
                            <p className="text-xs text-gray-400">{u.upi}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected user pill */}
              {selected && (
                <div className="flex items-center gap-3 mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    {selected.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{selected.name}</p>
                    <p className="text-xs text-gray-400">{selected.upi}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelected(null);
                      setQuery("");
                    }}
                    className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Amount */}
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
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-black outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
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

            {/* Note */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lunch, rent, coffee..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
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
                ✓ Money sent successfully!
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleTransfer}
              disabled={!selected || !amount || Number(amount) <= 0 || loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : `Send ₹${amount || "0"} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
