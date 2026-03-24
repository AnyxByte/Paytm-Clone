"use client";

import { useUser } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Transactions() {
  const {
    transactions,
    setCreditAmount,
    setDebitAmount,
    fetchTransactionDetails,
  } = useWallet();

  const router = useRouter();

  const { user } = useUser();

  const txns = transactions.map((txs) => {
    const isCredit = txs.toAccount?.user?.email === user?.email;
    const isDeposit = txs.type === "DEPOSIT";
    const isWithdraw = txs.type === "WITHDRAW";

    let name, handle;

    if (isDeposit) {
      name = "PayTm Deposit";
      handle = "via Razorpay";
    } else if (isWithdraw) {
      name = "Withdrawal";
      handle = "to Bank Account";
    } else if (isCredit) {
      // someone sent money TO you → show sender (fromAccount)
      name = txs?.fromAccount?.user?.name;
      handle = txs?.fromAccount?.user?.email;
    } else {
      // you sent money to someone → show receiver (toAccount)
      name = txs?.toAccount?.user?.name;
      handle = txs?.toAccount?.user?.email;
    }

    return {
      id: txs._id,
      type: isCredit ? "credit" : "debit",
      amount: txs.amount,
      name,
      handle,
      date: new Date(txs?.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });

  useEffect(() => {
    let credit = 0;
    let debit = 0;

    transactions.forEach((trxs) => {
      if (trxs.toAccount?.user?.email === user?.email) {
        credit += trxs.amount;
      } else {
        debit += trxs.amount;
      }
    });

    setCreditAmount(credit);
    setDebitAmount(debit);
  }, [transactions]);

  const handleViewAllTransaction = async () => {
    await fetchTransactionDetails(-1);
    router.push("/dashboard/history");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Recent Transactions
        </p>
        <button
          onClick={handleViewAllTransaction}
          className="text-xs text-blue-600 font-semibold hover:underline"
        >
          View all
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {txns.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full text-sm font-black flex items-center justify-center
                ${t.type === "credit" ? "bg-blue-50 text-green-600" : "bg-gray-100 text-red-600"}`}
              >
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {t.handle} · {t.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-black ${t.type === "credit" ? "text-green-600" : "text-red-800"}`}
              >
                {t.type === "credit" ? `+ ₹${t.amount}` : `- ₹${t.amount}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
