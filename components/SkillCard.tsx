"use client";
import { MapPin, Star, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export interface SkillData {
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
  createdAt?: string;
  updatedAt?: string;
}

interface SkillCardProps {
  skill: SkillData;
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      
      {/* IMAGE SECTION */}
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
      
      {/* CONTENT SECTION */}
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
  );
}