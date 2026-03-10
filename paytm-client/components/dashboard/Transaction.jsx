const txns = [
  {
    id: 1,
    name: "Priya Mehta",
    handle: "@priya",
    amount: "+₹1,200",
    type: "credit",
    date: "Today, 10:32 AM",
    note: "Lunch split",
  },
  {
    id: 2,
    name: "Aman Kumar",
    handle: "@aman",
    amount: "-₹500",
    type: "debit",
    date: "Today, 9:15 AM",
    note: "Movie tickets",
  },
  {
    id: 3,
    name: "Sneha Rao",
    handle: "@sneha",
    amount: "-₹300",
    type: "debit",
    date: "Yesterday, 7:45 PM",
    note: "Coffee",
  },
  {
    id: 4,
    name: "Rahul Verma",
    handle: "@rahul",
    amount: "+₹2,000",
    type: "credit",
    date: "Yesterday, 3:10 PM",
    note: "Rent share",
  },
  {
    id: 5,
    name: "Neha Singh",
    handle: "@neha",
    amount: "-₹150",
    type: "debit",
    date: "Mar 8, 1:20 PM",
    note: "Snacks",
  },
  {
    id: 6,
    name: "Vikram Das",
    handle: "@vikram",
    amount: "+₹800",
    type: "credit",
    date: "Mar 7, 6:00 PM",
    note: "Cab split",
  },
];

export default function Transactions() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Recent Transactions
        </p>
        <a
          href="#"
          className="text-xs text-blue-600 font-semibold hover:underline"
        >
          View all
        </a>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {txns.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full text-sm font-black flex items-center justify-center
                ${t.type === "credit" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}
              >
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {t.handle} · {t.note}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-black ${t.type === "credit" ? "text-blue-600" : "text-gray-800"}`}
              >
                {t.amount}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
