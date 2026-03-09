import Link from "next/link";

export default function Signup() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Pay<span className="text-blue-600">Tm</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-100">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                defaultValue="Rohit"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                defaultValue="Sharma"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <span className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-500 font-semibold">
                +91
              </span>
              <input
                type="tel"
                defaultValue="9876543210"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
              Confirm Password
            </label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition">
            Create Account
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
