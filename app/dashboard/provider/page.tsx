"use client";
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProviderDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name} 👋</h1>
        <p className="text-slate-500 text-sm">Here is what is happening with your services today.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Skills", val: "0", color: "text-blue-600" },
          { label: "Pending Bookings", val: "0", color: "text-amber-600" },
          { label: "Total Revenue", val: "$0.00", color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Empty State Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Recent Booking Requests</h2>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="p-12 text-center">
          <div className="inline-block p-4 rounded-full bg-slate-50 text-slate-300 mb-4">
            <Calendar size={32} />
          </div>
          <p className="text-slate-400 font-medium">No booking requests yet. They will appear here when seekers find your skills.</p>
        </div>
      </div>
    </div>
  );
}