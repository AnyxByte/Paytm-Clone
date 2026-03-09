export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-16 pb-24">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
        Why PayZap
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: "⚡",
            title: "Transfers in under 3s",
            desc: "UPI-powered instant transfers with real-time confirmation.",
          },
          {
            icon: "🔒",
            title: "Bank-grade Security",
            desc: "Every transaction is encrypted and protected by your UPI PIN.",
          },
          {
            icon: "📱",
            title: "Just a UPI ID",
            desc: "No bank details needed. Send money with just a UPI handle.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition"
          >
            <div className="text-2xl mb-4">{f.icon}</div>
            <h3 className="font-black text-sm mb-1.5">{f.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
