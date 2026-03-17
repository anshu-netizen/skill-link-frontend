"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, IndianRupee, Clock, Loader2, 
  ArrowRight, AlertCircle, CheckCircle2, Star 
} from 'lucide-react';
import Link from 'next/link';
import { bookingService } from '@/services/bookingService';

export default function SeekerDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
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

    const loadSeekerData = async () => {
      try {
        const data = await bookingService.getMyRequests();
        setRequests(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadSeekerData();
  }, [router]);

  // Derived Stats
  const activeBookings = requests.filter(r => r.status === 'pending' || r.status === 'accepted').length;
  const totalSpent = requests.reduce((acc, curr) => acc + curr.totalPrice, 0);

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
            Hi, {user?.name?.split(' ')[0] || 'Seeker'} 👋
          </h1>
          <p className="text-slate-500 font-medium">Track your service requests and find new experts.</p>
        </div>
        <Link href="/dashboard/seeker/marketplace" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <ShoppingBag size={20} /> Browse All Skills
        </Link>
      </header>

      {/* Stats Section - Same as Provider Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
            label="Total Bookings" 
            val={requests.length.toString()} 
            icon={<ShoppingBag size={20} />} 
            color="text-blue-600" 
            bg="bg-blue-50" 
        />
        <StatCard 
            label="In Progress" 
            val={activeBookings.toString()} 
            icon={<Clock size={20} />} 
            color="text-amber-600" 
            bg="bg-amber-50" 
        />
        <StatCard 
            label="Total Spent" 
            val={`₹${totalSpent}`} 
            icon={<IndianRupee size={20} />} 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Recent Requests</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">History</p>
          </div>
          
          {requests.length > 0 ? (
            <div className="grid gap-4">
              {requests.map(req => (
                <div key={req._id} className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between hover:border-blue-300 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl flex items-center justify-center font-bold uppercase text-xs transition-colors">
                      {req.skill?.category?.substring(0, 2) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{req.skill?.title}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        Provider: <span className="text-slate-900">{req.provider?.name}</span> • <span className="uppercase">{req.status}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="text-right hidden sm:block">
                        <p className="text-lg font-black text-slate-900">₹{req.totalPrice}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(req.createdAt).toLocaleDateString()}</p>
                     </div>
                     <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-medium">
              You haven't hired anyone yet. <br/>
              <Link href="/dashboard/seeker/marketplace" className="text-blue-600 font-bold hover:underline">Explore the marketplace</Link>
            </div>
          )}
        </div>
        
        {/* Side Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200">
              <h3 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Account Safety</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                </div>
                <p className="font-bold">Verified Buyer</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Your payments are held in escrow and only released to providers once you mark a job as completed.
              </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem]">
              <h3 className="font-bold text-slate-900 mb-4">Leave Feedback</h3>
              <p className="text-sm text-slate-500 mb-4">Help the community by reviewing your providers after a job.</p>
              <div className="flex gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard (Move this to a separate component file later to keep it DRY)
function StatCard({ label, val, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{val}</p>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}