export default function BalanceCard() {
  const hasWallet = false; // toggle to true once wallet is created

  if (!hasWallet) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Wallet</p>
          <p className="text-2xl font-black mb-2">No wallet yet</p>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Create your PayTm wallet to start sending and receiving money instantly.
          </p>
        </div>
        <button className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition">
          + Create Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">

      {/* Balance */}
      <div className="bg-blue-600 px-6 py-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Total Balance</p>
          <p className="text-4xl font-black text-white">₹12,450.00</p>
          <p className="text-blue-200 text-xs mt-1 font-medium">rohit@upi</p>
        </div>
        <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
      </div>

      {/* Quick stats */}
      <div className="bg-white border border-gray-200 border-t-0 grid grid-cols-3 divide-x divide-gray-100 rounded-b-2xl">
        {[
          { label: "Sent this month",     value: "₹4,200" },
          { label: "Received this month", value: "₹6,800" },
          { label: "Transactions",        value: "24" },
        ].map(s => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-sm font-black">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}