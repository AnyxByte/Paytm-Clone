"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import BalanceCard from "@/components/dashboard/BalanceCard";
import { useWallet } from "@/context/WalletContext";
import Select from "react-select";
import toast from "react-hot-toast";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

const formatOptionLabel = (option) => (
  <div className="flex items-center gap-3">
    <div>
      <p className="text-sm font-bold text-black">{option.label}</p>
      <p className="text-xs text-gray-400">{option.email}</p>
    </div>
  </div>
);

export default function TransferPage() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const token = Cookies.get("token");
  const { walletDetails, allAccounts, setAllAccounts, setWalletDetails } =
    useWallet();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchAllAccounts = async () => {
    if (!walletDetails?.account?._id) return;
    const token = Cookies.get("token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/accounts/all/${walletDetails?.account?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("all accounts", response.data);
      setAllAccounts(response.data.accounts);
    } catch (error) {
      console.log("error at fetchAllAcounts", error);
    }
  };

  useEffect(() => {
    if (!error) {
      fetchAllAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = allAccounts.map((acc) => {
    return {
      value: acc._id,
      label: acc.user.name,
      email: acc.user.email,
    };
  });

  const handleMoneyTransfer = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const payload = {
        fromAccount: walletDetails?.account?._id,
        toAccount: selected?.value,
        amount,
        idempotencyKey: crypto.randomUUID(),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLoading(false);
      console.log("handleMoneyTransfer", response.data);
      setWalletDetails((prev) => {
        return {
          ...prev,
          balance: response.data.balance,
        };
      });
      toast.success("Money sent");
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error", error);
      toast.error("Error sending money");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 pt-10 pb-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
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

        {/* Two column layout */}
        <div className="flex gap-5 items-start">
          {/* LEFT — Transfer Form */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible">
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
                <Select
                  instanceId="recipient-select"
                  options={options}
                  value={selected}
                  onChange={setSelected}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Search by name or email..."
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "No users found"}
                />
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

              {error && (
                <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                  ⚠ Failed to send
                </p>
              )}

              {success && (
                <p className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
                  ✓ Money sent successfully!
                </p>
              )}

              <button
                onClick={handleMoneyTransfer}
                disabled={
                  !selected || !amount || Number(amount) <= 0 || loading
                }
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : `Send ₹${amount || "0"} →`}
              </button>
            </div>
          </div>

          {/* RIGHT — Balance Card */}
          <div className="w-72 flex-shrink-0">
            <BalanceCard />
          </div>
        </div>
      </div>
    </div>
  );
}
