"use client";
import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Briefcase, 
  Plus, 
  LogOut, 
  Loader2, 
  IndianRupee, 
  TrendingUp, 
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

// Define the Skill structure
interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
}

export default function ProviderDashboard() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchMyData = async () => {
      try {
        setLoading(true);
        // This hits your GET /api/skills endpoint
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (err: any) {
        setError("Could not load your services. Please check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Provider'} 👋
          </h1>
          <p className="text-slate-500 mt-1">You are currently logged in as a Service Provider.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/dashboard/provider/add-skill" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100">
            <Plus size={20} /> Post Skill
          </Link>
          <button onClick={handleLogout} 
            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors shadow-sm">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard 
          label="Active Listings" 
          val={skills.length.toString()} 
          icon={<Briefcase className="text-blue-600" size={20} />}
          bg="bg-blue-50"
        />
        <StatCard 
          label="Pending Jobs" 
          val="0" 
          icon={<Clock className="text-amber-600" size={20} />}
          bg="bg-amber-50"
        />
        <StatCard 
          label="Total Revenue" 
          val="₹0" 
          icon={<TrendingUp className="text-emerald-600" size={20} />}
          bg="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Skill Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              My Services <span className="text-sm font-normal text-slate-400">({skills.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
              <p className="text-slate-400 font-medium">Fetching your skills...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
              <AlertCircle size={20} /> {error}
            </div>
          ) : skills.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {skills.map((skill) => (
                <div key={skill._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{skill.title}</h4>
                      <p className="text-slate-500 text-sm">{skill.category}</p>
                      <div className="flex items-center gap-1 mt-1 text-emerald-600 font-bold">
                        <IndianRupee size={14} /> {skill.price} <span className="text-slate-400 font-normal text-xs">/ service</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                    Edit Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium mb-4">No skills listed yet.</p>
              <Link href="/dashboard/provider/add-skill" className="text-blue-600 font-bold hover:underline">
                Create your first listing →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-6">Learn how to boost your visibility and get more bookings.</p>
              <button className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm">Read Guide</button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="text-slate-200 mb-3" size={40} />
              <p className="text-sm text-slate-400 font-medium">No bookings scheduled for this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Sub-component
function StatCard({ label, val, icon, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</h3>
        <p className="text-3xl font-black text-slate-900 mt-2">{val}</p>
      </div>
      <div className={`p-3 rounded-2xl ${bg}`}>
        {icon}
      </div>
    </div>
  );
}