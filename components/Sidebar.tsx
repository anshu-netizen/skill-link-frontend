"use client";
import { 
  LayoutDashboard, 
  PlusSquare, 
  CalendarCheck, 
  LogOut, 
  LogIn, 
  Sparkles, 
  ShoppingBag, 
  Search, 
  UserCircle 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user, handleLogout }: { user: any; handleLogout: () => void }) {
  const pathname = usePathname();

  // Define navigation items for both roles
  const providerNav = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard/provider' },
    { label: 'Post Skills', icon: <PlusSquare size={20} />, href: '/dashboard/provider/add-skill' },
    { label: 'My Bookings', icon: <CalendarCheck size={20} />, href: '/dashboard/provider/bookings' },
  ];

  const seekerNav = [
    { label: 'Explore', icon: <Search size={20} />, href: '/dashboard/seeker' },
    { label: 'Marketplace', icon: <Search size={20} />, href: '/dashboard/seeker/marketplace' },
    { label: 'My Requests', icon: <ShoppingBag size={20} />, href: '/dashboard/seeker/requests' },
    { label: 'Profile', icon: <UserCircle size={20} />, href: '/dashboard/seeker/profile' },
  ];

  // Determine which nav items to show based on user role
  const navItems = user?.role === 'provider' ? providerNav : seekerNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col p-6 z-50 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <Sparkles size={22} fill="currentColor" />
        </div>
        <div>
           <span className="text-xl font-bold text-slate-900 tracking-tight block leading-none">SkillLink</span>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
             {user?.role || 'Guest'}
           </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Auth */}
      <div className="pt-6 border-t border-slate-100">
        {user ? (
          <div className="space-y-2">
            <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition-all shadow-lg">
            <LogIn size={18} /> Login
          </Link>
        )}
      </div>
    </aside>
  );
}