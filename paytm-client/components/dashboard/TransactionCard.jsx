"use client";

import { useUser } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";

export default function TransactionCard() {
  const { transactions } = useWallet();
  const {user} = useUser()

  const txns = transactions.map((txs) => {
    const transactionType =
      txs.toAccount?.user?.email === user?.email ? "credit" : "debit";

    return {
      id: txs._id,
      type: transactionType,
      amount: txs.amount,
      name: txs?.toAccount?.user?.name,
      handle: txs?.toAccount?.user?.email,
      date: new Date(txs?.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });

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
  </div>;
}
