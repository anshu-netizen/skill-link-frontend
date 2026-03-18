"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, IndianRupee, TrendingUp, Clock, Loader2, 
  Trash2, Plus, AlertCircle, Calendar, User, ChevronRight, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { skillService } from '@/services/skillService';
import { bookingService } from '@/services/bookingService';

interface Skill {
  _id: string; 
  title: string; 
  category: string; 
  price: number;
}

interface Booking {
  _id: string;
  seeker: { name: string; email: string };
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  totalPrice: number;
  scheduledDate: string;
  message: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [upcomingJobs, setUpcomingJobs] = useState<Booking[]>([]);
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
        const [skillsData, bookingsData] = await Promise.all([
          skillService.getMySkills(),
          bookingService.getIncomingJobs() 
        ]);

        setSkills(skillsData);

        // FILTER: Show everything EXCEPT 'completed' and 'cancelled'
        const filteredUpcoming = bookingsData.filter((b: Booking) => 
          b.status === 'pending' || b.status === 'accepted'
        );
        setUpcomingJobs(filteredUpcoming);

        // STATS CALCULATION
        const pending = bookingsData.filter((b: any) => b.status === 'pending');
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
    <div className="h-screen flex items-center justify-center bg-slate-50/50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 w-full bg-slate-50 min-h-screen">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 border border-red-100">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Full Width Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Provider'}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest">Dashboard Overview</p>
        </div>
        <div className="flex gap-3">
            <Link href="/dashboard/provider/add-skill" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 shadow-blue-200 shadow-lg">
              <Plus size={20} /> Post New Skill
            </Link>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Live Services" val={skills.length.toString()} icon={<Briefcase size={22} />} color="text-blue-600" bg="bg-white" />
        <StatCard label="Pending Requests" val={pendingJobsCount.toString()} icon={<Clock size={22} />} color="text-amber-600" bg="bg-white" />
        <StatCard label="Total Revenue" val={`₹${totalRevenue}`} icon={<TrendingUp size={22} />} color="text-emerald-600" bg="bg-white" />
      </div>

      {/* Main Dual Scrollable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Component 1: Skills List */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-slate-900 italic">Your Services</h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{skills.length} Items</span>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 h-[600px] overflow-y-auto custom-scrollbar shadow-sm">
            <div className="space-y-4">
              {skills.length > 0 ? (
                skills.map(skill => (
                  <div key={skill._id} className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-black uppercase text-sm shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {skill.category.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{skill.title}</h3>
                        <p className="text-sm font-black text-emerald-600">₹{skill.price}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(skill._id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <EmptyState message="No skills listed yet." />
              )}
            </div>
          </div>
        </div>
        
        {/* Component 2: Upcoming Jobs (Pending & Accepted) */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-slate-900 italic">Upcoming Schedule</h2>
            <Link href="/dashboard/provider/bookings" className="text-blue-600 text-xs font-black uppercase hover:underline tracking-widest">View History</Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 h-[600px] overflow-y-auto custom-scrollbar shadow-sm">
            <div className="space-y-4">
              {upcomingJobs.length > 0 ? (
                upcomingJobs.map((job) => (
                  <div key={job._id} className={`bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:border-blue-400 transition-all border-l-8 group shadow-sm ${job.status === 'accepted' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm group-hover:text-blue-600 transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 leading-none">{job.seeker.name}</p>
                          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 inline-block ${job.status === 'accepted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {job.status === 'accepted' ? '✓ Accepted' : '● Pending Approval'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg leading-none">₹{job.totalPrice}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Fixed Price</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-slate-600 bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                            <Calendar size={14} className="text-blue-500" />
                            <p className="text-xs font-black uppercase tracking-tighter">
                                {new Date(job.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pr-2">
                           <p className="text-[11px] text-slate-400 italic line-clamp-1">"{job.message}"</p>
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="Your schedule is clear!" />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

function StatCard({ label, val, icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black text-slate-900 mt-1">{val}</p>
      </div>
      <div className={`p-5 rounded-2xl bg-slate-50 ${color} border border-slate-100 shadow-inner`}>{icon}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[500px] flex flex-col items-center justify-center text-slate-400">
      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
        <CheckCircle2 size={32} className="text-slate-200" />
      </div>
      <p className="font-black text-sm uppercase tracking-widest">{message}</p>
    </div>
  );
}