"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AddMoney() {
  const token = Cookies.get("token");
  const { walletDetails, setWalletDetails } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleUpdateBalance = (data) => {
    setWalletDetails((prev) => {
      return {
        ...prev,
        balance: data.balance,
      };
    });
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-order`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const order = res.data.order;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
          amount: order.amount,
          currency: "INR",
          name: "PayTm",
          description: "Add money to wallet",
          order_id: order.id,

          handler: async (response) => {
            try {
              const responseFromOwnBackend = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/deposit`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: Number(amount),
                  idempotencyKey: order.id,
                  toAccount: walletDetails?.account?._id,
                },
                { headers: { Authorization: `Bearer ${token}` } },
              );
              handleUpdateBalance(responseFromOwnBackend.data);
              setAmount("");
              toast.success(`₹${amount} added to wallet!`);
            } catch {
              toast.error("Payment failed");
            } finally {
              setLoading(false);
            }
          },

          prefill: { name: user.name, contact: user.phone },
          theme: { color: "#2563eb" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch {
      alert("Failed to create order.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 rounded-t-2xl">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">
            Wallet
          </p>
          <p className="text-white font-black text-lg">Add Money</p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col">
          {/* Amount Label */}
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Enter Amount
          </label>

          {/* Amount Input */}
          <div className="relative mb-5">
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

          {/* Pay Button */}
          <button
            onClick={handleAddMoney}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pay ₹{amount || "0"}
          </button>
        </div>
      </div>
    </div>
  );
}
