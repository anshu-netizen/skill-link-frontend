"use client";
import { useEffect, useState } from 'react';
import { 
  Briefcase, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  Loader2, 
  ExternalLink, 
  MoreVertical,
  Circle,
  Star,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

// Types for our real and dummy data
interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  availability: string;
  createdAt: string;
}

export default function ProviderDashboard() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchData = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl animate-in fade-in duration-500">
      {/* 1. Dashboard Header */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Provider'}
          </h1>
          <p className="text-slate-500 font-medium">Here’s what’s happening with your services today.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="text-xs text-slate-400 font-medium italic">System status: Optimal</p>
        </div>
      </header>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          label="Active Skills" 
          val={skills.length.toString()} 
          icon={<Briefcase size={20} />} 
          color="text-blue-600" 
          bg="bg-blue-50" 
          trend="+2 this month"
        />
        <StatCard 
          label="Pending Bookings" 
          val="4" 
          icon={<Clock size={20} />} 
          color="text-amber-600" 
          bg="bg-amber-50" 
          trend="Action required"
        />
        <StatCard 
          label="Total Revenue" 
          val="₹12,450" 
          icon={<TrendingUp size={20} />} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
          trend="+15% growth"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content (Real Data) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Real Skills List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Your Services
                <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-full">{skills.length}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div key={skill._id} className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Briefcase size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{skill.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">₹{skill.price}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{skill.category}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 font-medium">No services listed yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Dummy: Analytics Placeholder */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Earnings Growth
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-bold">
                <ArrowUpRight size={14} /> 12.5%
              </span>
            </h3>
            <div className="h-40 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
               <p className="text-slate-400 text-sm font-medium">Chart Visualization Placeholder</p>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Features */}
        <div className="space-y-6">
          
          {/* Dummy: Profile Strength */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">Profile Strength</h3>
              <span className="text-blue-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mb-6">
              <div className="bg-blue-500 h-2 rounded-full w-[85%]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" /> Identity Verified
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" /> 3+ Services Posted
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Circle size={14} className="text-slate-600" /> Add Portfolio Images
              </div>
            </div>
          </div>

          {/* Dummy: Recent Reviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Latest Reviews</h3>
            <div className="space-y-4">
              <ReviewCard name="Siddharth M." rating={5} text="Excellent work on the React project!" />
              <ReviewCard name="Priya R." rating={4} text="Very professional and on time." />
            </div>
            <button className="w-full mt-4 py-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
              View All Reviews
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ label, val, icon, color, bg, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{val}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{trend}</p>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function ReviewCard({ name, rating, text }: any) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-slate-900">{name}</span>
        <div className="flex gap-0.5 text-amber-400">
          {[...Array(rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic line-clamp-2">"{text}"</p>
    </div>
  );
}