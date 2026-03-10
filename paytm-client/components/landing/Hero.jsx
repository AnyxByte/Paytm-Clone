export default function Hero() {
  return (
    <section className="pt-28 pb-16 px-6 md:px-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
      {/* LEFT */}
      <div className="flex-1">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-5">
          Peer-to-Peer Payments
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4">
          Send money to
          <br />
          anyone, <span className="text-blue-600">instantly.</span>
        </h1>
        <p className="text-gray-400 text-base max-w-sm mb-8 leading-relaxed">
          PayTm lets you transfer money directly to other users using their UPI
          ID. Simple, fast, and secure.
        </p>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-700 transition">
            Get Started Free
          </button>
          <button className="bg-white border border-gray-200 text-black font-semibold px-6 py-3 rounded-xl text-sm hover:border-gray-300 transition">
            See How It Works
          </button>
        </div>

        {/* trust bar */}
        <div className="flex gap-6 mt-10">
          {[
            { value: "2.4M+", label: "Users" },
            { value: "₹180Cr", label: "Daily Transfers" },
            { value: "99.9%", label: "Uptime" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-black text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — SEND CARD */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-100 overflow-hidden">
        {/* card header */}
        <div className="bg-blue-600 px-6 py-5">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">
            Your Balance
          </p>
          <p className="text-3xl font-black text-white">₹12,450.00</p>
        </div>

        {/* send form */}
        <div className="px-6 py-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Send Money
          </p>
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
              UPI ID
            </label>
            <input
              defaultValue="rohit@upi"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
              Amount (₹)
            </label>
            <input
              defaultValue="500"
              type="number"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition">
            Send ₹500 →
          </button>
        </div>

        {/* recent */}
        <div className="border-t border-gray-100 px-6 pb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4 mb-3">
            Recent
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                name: "Rohit S.",
                handle: "@rohit",
                amount: "-₹500",
                credit: false,
              },
              {
                name: "Priya M.",
                handle: "@priya",
                amount: "+₹1,200",
                credit: true,
              },
              {
                name: "Aman K.",
                handle: "@aman",
                amount: "-₹300",
                credit: false,
              },
            ].map((t) => (
              <div key={t.handle} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.handle}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-black ${t.credit ? "text-blue-600" : "text-gray-700"}`}
                >
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
