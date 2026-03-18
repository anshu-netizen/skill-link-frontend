"use client";
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';
import { skillService } from '@/services/skillService';
import SkillCard, { SkillData } from '@/components/SkillCard';

export default function ExplorePage() {
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

  const filteredSkills = skills.filter(skill => 
    skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (skill.location && skill.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full bg-white min-h-screen font-sans">
      <div className="bg-[#003580] pt-16 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-white text-5xl font-black mb-4 tracking-tight">Find your next expert</h1>
          <p className="text-blue-100 text-xl font-medium mb-10">Search deals on professional services, experts, and much more...</p>

          <div className="relative max-w-5xl mx-auto md:mx-0">
            <div className="flex flex-col md:flex-row bg-[#ffb700] p-1 rounded-lg shadow-xl">
              <div className="flex-1 bg-white rounded-md flex items-center px-4 py-3 m-0.5">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                  type="text"
                  placeholder="Search skills, categories, or locations..."
                  className="w-full outline-none text-slate-900 font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-[#006ce4] text-white px-10 py-3 m-0.5 rounded-md font-bold text-xl hover:bg-[#0052ad] transition-colors">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 mb-16 grid grid-cols-1 md:grid-cols-4 gap-4">
        <ValueCard icon={<ShieldCheck className="text-blue-600" />} title="Secure Payments" desc="Pay only when the job is done" />
        <ValueCard icon={<Zap className="text-orange-500" />} title="Instant Booking" desc="1-hour buffer protection" />
        <ValueCard icon={<Globe className="text-emerald-500" />} title="Verified Pros" desc="Background checked experts" />
        <ValueCard icon={<Heart className="text-pink-500" />} title="24/7 Support" desc="We are always here to help" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Highest Rated Experts</h2>
          <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
            <span>{filteredSkills.length} results</span>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><SlidersHorizontal size={18} /></button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-80 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => <SkillCard key={skill._id} skill={skill} />)}
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