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

  const fetchWalletDetails = async () => {
    const token = Cookies.get("token");

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWalletDetails();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletDetails,
        loading,
        error,
        hasWallet,
        setHasWallet,
        setWalletDetails
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
