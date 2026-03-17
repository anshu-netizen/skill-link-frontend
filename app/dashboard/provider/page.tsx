"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, IndianRupee, TrendingUp, Clock, Loader2, 
  Trash2, MoreVertical, Plus, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { skillService } from '@/services/skillService';

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

    const loadSkills = async () => {
      try {
        const data = await skillService.getMySkills();
        setSkills(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Could not load your skills.");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await skillService.deleteSkill(id);
      setSkills(skills.filter(s => s._id !== id)); // Remove from UI immediately
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
          <p className="text-slate-500 font-medium">Manage your SkillLink services.</p>
        </div>
        <Link href="/dashboard/provider/add-skill" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all">
          <Plus size={20} /> Post New Skill
        </Link>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Active Skills" val={skills.length.toString()} icon={<Briefcase size={20} />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Pending Jobs" val="4" icon={<Clock size={20} />} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Total Revenue" val={`₹${skills.reduce((acc, curr) => acc + curr.price, 0)}`} icon={<TrendingUp size={20} />} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Your Services</h2>
          {skills.length > 0 ? (
            skills.map(skill => (
              <div key={skill._id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-blue-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold uppercase text-xs">
                    {skill.category.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{skill.title}</h3>
                    <p className="text-xs font-bold text-emerald-600">
                      ₹{skill.price} • <span className="text-slate-400 uppercase tracking-tighter">{skill.category}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleDelete(skill._id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                   <MoreVertical className="text-slate-300 cursor-pointer" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl text-slate-400 font-medium">
              No skills posted yet.
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl">
             <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">Profile Strength</h3>
             <p className="text-2xl font-black mb-2">85%</p>
             <div className="w-full bg-slate-800 h-2 rounded-full leading-none">
               <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{val}</p>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}