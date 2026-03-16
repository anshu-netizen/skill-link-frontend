"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} handleLogout={handleLogout} />
      {/* ml-64 shifts the content to the right of the sidebar */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}