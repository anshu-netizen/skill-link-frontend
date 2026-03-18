"use client";
import { useState, useEffect } from 'react';
import { Search, Globe, Paintbrush, Wrench, Code, Camera, Settings } from 'lucide-react';
import { skillService } from '@/services/skillService';
import SkillCard, { SkillData } from '@/components/SkillCard';

const CATEGORY_MAP = [
  { name: "All", icon: <Globe size={18} /> },
  { name: "Cleaning", icon: <Paintbrush size={18} /> },
  { name: "Plumbing", icon: <Wrench size={18} /> },
  { name: "IT", icon: <Code size={18} /> },
  { name: "Creative", icon: <Camera size={18} /> },
  { name: "Maintenance", icon: <Settings size={18} /> },
];

export default function MarketplacePage() {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillService.getAllSkills();
        setSkills(data);
      } catch (err) {
        console.error("Error fetching skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="bg-[#003580] pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-4xl font-black mb-6">Expert Marketplace</h1>
          <div className="relative max-w-3xl">
            <div className="flex bg-[#ffb700] p-1 rounded-lg">
              <div className="flex-1 bg-white rounded-md flex items-center px-4 py-3">
                <Search className="text-slate-400 mr-2" size={20} />
                <input 
                  type="text"
                  placeholder="Filter by title or search for a service..."
                  className="w-full outline-none text-slate-900 font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY RIBBON */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 overflow-x-auto py-4 no-scrollbar">
          {CATEGORY_MAP.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all ${
                activeCategory === cat.name 
                ? "border-[#006ce4] text-[#006ce4]" 
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat.icon}
              <span className="text-[10px] font-black uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-black text-slate-900 mb-8">
          {activeCategory === "All" ? "All Experts" : `${activeCategory} Specialists`}
        </h2>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        )}

        {!loading && filteredSkills.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold text-lg">No experts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}