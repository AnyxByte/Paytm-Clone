"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletDetails, setWalletDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasWallet, setHasWallet] = useState(true);
  const [allAccounts, setAllAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [creditAmount, setCreditAmount] = useState(0);
  const [debitAmount, setDebitAmount] = useState(0);

  const fetchWalletDetails = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await axios.get(`${backendUrl}/api/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.account === null) {
        setHasWallet(false);
      } else {
        setHasWallet(true);
        setWalletDetails(response.data);
      }

      setLoading(false);
    } catch (error) {
      console.log("error at fetchWalletDetails", error);
      setError(true);
    }
  };

  const fetchTransactionDetails = async (num = 100) => {
    const token = Cookies.get("token");
    if (!token) return;

    if (!walletDetails?.account?._id) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await axios.get(
        `${backendUrl}/api/transactions/${walletDetails?.account?._id}?num=${num}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log("fetch transactions", response.data);
      setTransactions(response.data?.transaction);
    } catch (error) {
      console.log("error at fetchWalletDetails", error);
      setError(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWalletDetails();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactionDetails();
  }, [walletDetails]);

  return (
    <WalletContext.Provider
      value={{
        walletDetails,
        loading,
        error,
        hasWallet,
        setHasWallet,
        setWalletDetails,
        allAccounts,
        setAllAccounts,
        fetchWalletDetails,
        fetchTransactionDetails,
        transactions,
        setTransactions,
        setCreditAmount,
        creditAmount,
        debitAmount,
        setDebitAmount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
