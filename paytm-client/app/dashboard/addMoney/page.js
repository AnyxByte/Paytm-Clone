"use client";

import { useWallet } from "@/context/WalletContext";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddMoney() {
  const token = Cookies.get("token");

  const { walletDetails } = useWallet();

  const handleAddMoney = async () => {
    const payload = {
      amount: 5,
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-order`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const order = res.data.order;

    console.log("order", order);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: "INR",
        name: "PayZap",
        description: "Add money to wallet",
        order_id: order.id,

        handler: async (response) => {
          // Step 3 — send to your Express backend to verify
          console.log("response", response);
          try {
            const verify = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/deposit`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: 5,
                idempotencyKey: order.id,
                toAccount: walletDetails?.account?._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            alert("success");
          } catch (error) {
            alert("error");
          }
        },

        prefill: {
          name: "Rohit Sharma",
          contact: "9876543210",
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <button
      onClick={handleAddMoney}
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition"
    >
      + Add Money
    </button>
  );
}
