import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/dashboard/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Paytm",
  description: "Paytm Clone",
};

export default function Layout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-[#f5f7fa] flex">
        <Sidebar />
        <div className="flex justify-center flex-1">{children}</div>
      </div>
    </>
  );
}
