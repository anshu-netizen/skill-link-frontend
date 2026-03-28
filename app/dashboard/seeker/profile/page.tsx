"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import { 
  User, 
  Mail, 
  Fingerprint, 
  LogOut, 
  Briefcase, 
  Settings, 
  Edit3,
  ExternalLink
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Storage error:", e);
      }
    } else {
      // If no user is found at all, kick them to login immediately
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // 1. Clear the storage
    localStorage.removeItem('user');
    
    // 2. Redirect to login page
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
        
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 to-violet-700 relative" />

        <div className="px-8 pb-10">
          <div className="relative flex justify-center">
            {/* Avatar */}
            <div className="absolute -top-12 w-24 h-24 bg-white rounded-3xl p-1 shadow-xl rotate-3">
              <div className="w-full h-full bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 -rotate-3">
                <span className="text-3xl font-black text-indigo-600">
                  {initials}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            
            <div className="mt-3 flex justify-center">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded-full border border-indigo-100 tracking-widest">
                {user.role}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-3">
            {/* <button className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
              <Edit3 size={18} />
              Edit Profile
            </button> */}
            
            {/* <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all">
                <Briefcase size={18} className="text-indigo-500" />
                My Jobs
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all">
                <Settings size={18} className="text-gray-400" />
                Settings
              </button>
            </div> */}

            {/* LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-bold transition-colors"
            >
              <LogOut size={16} />
              Logout from SkillLink
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-[10px] font-mono uppercase tracking-widest">
        ID: {user.id}
      </p>
    </div>
  );
}