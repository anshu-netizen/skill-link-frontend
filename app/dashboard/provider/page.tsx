"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, IndianRupee, TrendingUp, Clock, Loader2, 
  Trash2, MoreVertical, Plus, AlertCircle, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { skillService } from '@/services/skillService';
import { bookingService } from '@/services/bookingService';

interface Skill {
  _id: string; 
  title: string; 
  category: string; 
  price: number;
  availability?: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pendingJobsCount, setPendingJobsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!savedUser || !token) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));

    const loadDashboardData = async () => {
      try {
        // Fetch skills and bookings in parallel for better performance
        const [skillsData, bookingsData] = await Promise.all([
          skillService.getMySkills(),
          bookingService.getIncomingJobs()
        ]);

        setSkills(skillsData);

        // Calculate Stats
        const pending = bookingsData.filter((b: any) => b.status === 'pending' || b.status === 'accepted');
        const revenue = bookingsData
          .filter((b: any) => b.status === 'completed')
          .reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);

        setPendingJobsCount(pending.length);
        setTotalRevenue(revenue);

      } catch (err: any) {
        setError(err.response?.data?.message || "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await skillService.deleteSkill(id);
      setSkills(skills.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete skill");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Provider'}
          </h1>
          <p className="text-slate-500 font-medium">Manage your SkillLink services and track your earnings.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/dashboard/provider/bookings" className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
               View Jobs
            </Link>
            <Link href="/dashboard/provider/add-skill" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all">
              <Plus size={20} /> Post New Skill
            </Link>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
            label="Active Skills" 
            val={skills.length.toString()} 
            icon={<Briefcase size={20} />} 
            color="text-blue-600" 
            bg="bg-blue-50" 
        />
        <StatCard 
            label="Pending Jobs" 
            val={pendingJobsCount.toString()} 
            icon={<Clock size={20} />} 
            color="text-amber-600" 
            bg="bg-amber-50" 
        />
        <StatCard 
            label="Total Earnings" 
            val={`₹${totalRevenue}`} 
            icon={<TrendingUp size={20} />} 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Your Services</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{skills.length} Services</p>
          </div>
          
          {skills.length > 0 ? (
            <div className="grid gap-4">
              {skills.map(skill => (
                <div key={skill._id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-blue-300 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl flex items-center justify-center font-bold uppercase text-xs transition-colors">
                      {skill.category.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{skill.title}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        <span className="text-emerald-600">₹{skill.price}</span> • <span className="uppercase tracking-tighter">{skill.category}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <button 
                      onClick={() => handleDelete(skill._id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Delete Service"
                     >
                       <Trash2 size={18} />
                     </button>
                     <MoreVertical className="text-slate-300 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl text-slate-400 font-medium">
              No skills posted yet. Start by clicking "Post New Skill".
            </div>
          )}
        </div>
        
        {/* Side Panel: Profile Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200">
              <h3 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Profile Strength</h3>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black">85%</p>
                <p className="text-slate-400 text-sm font-bold mb-1">Excellent</p>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '85%' }} />
              </div>
              <p className="text-slate-400 text-xs mt-4 leading-relaxed">
                Add a profile picture and more skills to reach 100% and get noticed by more seekers.
              </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl">
              <h3 className="font-bold text-slate-900 mb-4">Quick Tips</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-slate-500 font-medium">
                  <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  Respond to new bookings within 2 hours.
                </li>
                <li className="flex gap-3 text-sm text-slate-500 font-medium">
                  <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  Clear titles help you appear in search.
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{val}</p>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}