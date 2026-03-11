"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUser } from "@/context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const { setUser } = useUser();

  const onSubmit = async (data) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const payload = {
      password: data.password,
      email: data.email,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        payload,
      );
      Cookies.set("token", response.data.token);
      setUser(response.data?.user);

      toast.success("Successful");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    } catch (error) {
      console.log("error", error);
      toast.error("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Pay<span className="text-blue-600">Tm</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-100">
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                Email
              </label>
              <input
                type="text"
                defaultValue="rohit@gmail.com"
                {...register("email", {
                  required: true,
                })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
              {errors.email && <span>This field is required</span>}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                defaultValue="password123"
                {...register("password", {
                  required: true,
                })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition">
              Log In
            </button>

            <p className="text-center text-xs text-gray-400 mt-5">
              Dont have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
