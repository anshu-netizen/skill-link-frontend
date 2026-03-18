"use client";
import { useState, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, ArrowRight, 
  MapPin, Star, ShieldCheck, Zap, Globe, Heart 
} from 'lucide-react';
import { skillService } from '@/services/skillService';
import Link from 'next/link';

// 1. Define the Interface to fix the "type never" error
interface SkillData {
  _id: string;
  provider: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  location: string;
  tags: string[];
  availability: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExplorePage() {
  // 2. Explicitly type the state
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await skillService.getAllSkills();
        setSkills(data);
      } catch (error) {
        console.error("Failed to load skills:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  // 3. Filter logic using the typed data
  const filteredSkills = skills.filter(skill => 
    skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (skill.location && skill.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full bg-white min-h-screen font-sans">
      {/* --- HERO SECTION --- */}
      <div className="bg-[#003580] pt-16 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-5xl font-black mb-4 tracking-tight">
            Find your next expert
          </h1>
          <p className="text-blue-100 text-xl font-medium mb-10">
            Search deals on professional services, experts, and much more...
          </p>

          {/* --- SEARCH BAR --- */}
          <div className="relative max-w-5xl">
            <div className="flex flex-col md:flex-row bg-[#ffb700] p-1 rounded-lg shadow-xl">
              <div className="flex-1 bg-white rounded-md flex items-center px-4 py-3 m-0.5 border-2 border-transparent focus-within:border-orange-500">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                  type="text"
                  placeholder="Search skills, categories, or locations..."
                  className="w-full outline-none text-slate-900 font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-[#006ce4] text-white px-10 py-3 m-0.5 rounded-md font-bold text-xl hover:bg-[#0052ad] transition-colors shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- VALUE PROPS --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ValueCard icon={<ShieldCheck className="text-blue-600" />} title="Secure Payments" desc="Pay only when the job is done" />
          <ValueCard icon={<Zap className="text-orange-500" />} title="Instant Booking" desc="1-hour buffer protection" />
          <ValueCard icon={<Globe className="text-emerald-500" />} title="Verified Pros" desc="Background checked experts" />
          <ValueCard icon={<Heart className="text-pink-500" />} title="24/7 Support" desc="We are always here to help" />
        </div>
      </div>

      {/* --- SKILLS GRID --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Experts</h2>
          <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
            <span>{filteredSkills.length} results</span>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <div key={skill._id} className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                
                {/* IMAGE COMPONENT */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {skill.images && skill.images.length > 0 ? (
                    <img 
                      src={skill.images[0]} 
                      alt={skill.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-3xl font-black italic">
                      {skill.category.substring(0, 2)}
                    </div>
                  )}
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#006ce4] shadow-sm border border-blue-50">
                    {skill.category}
                  </div>

                  {/* Availability Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[9px] font-bold text-white shadow-sm ${skill.availability === 'Available' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {skill.availability}
                  </div>

                  {/* Location Badge */}
                  {skill.location && (
                    <div className="absolute bottom-3 left-3 flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] font-bold border border-white/20">
                      <MapPin size={10} className="mr-1" /> {skill.location}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-[#006ce4] transition-colors line-clamp-1">
                      {skill.title}
                    </h3>
                    <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 shrink-0 ml-2">
                      <Star size={12} fill="currentColor" className="mr-1" /> 4.9
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Starting from</p>
                      <p className="text-2xl font-black text-slate-900">₹{skill.price}</p>
                    </div>
                    <Link 
                      href={`/dashboard/seeker/skills/${skill._id}`} 
                      className="bg-[#006ce4] text-white flex items-center justify-center w-12 h-12 rounded-xl hover:bg-[#0052ad] hover:shadow-lg hover:rotate-6 transition-all duration-300"
                    >
                      <ArrowRight size={22} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-all group">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm leading-tight">{title}</h4>
        <p className="text-slate-500 text-[11px] font-medium mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}