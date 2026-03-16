"use client";
import { LayoutDashboard, PlusSquare, CalendarCheck, LogOut, LogIn, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user, handleLogout }: { user: any; handleLogout: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard/provider' },
    { label: 'Post Skills', icon: <PlusSquare size={20} />, href: '/dashboard/provider/add-skill' },
    { label: 'My Bookings', icon: <CalendarCheck size={20} />, href: '/dashboard/provider/bookings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col p-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <Sparkles size={22} fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">SkillLink</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Auth */}
      <div className="pt-6 border-t border-slate-100">
        {user ? (
          <div className="space-y-2">
            <div className="px-4 py-2">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all">
              <LogOut size={20} /> Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition-all">
            <LogIn size={18} /> Login
          </Link>
        )}
      </div>
    </aside>
  );
}