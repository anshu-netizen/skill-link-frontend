import { LayoutDashboard, PlusCircle, Calendar, LogOut, User } from 'lucide-react';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <span className="text-xl font-bold text-blue-600">SkillLink</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="/dashboard/provider" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/provider/add-skill" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition">
            <PlusCircle size={20} /> Post a Skill
          </a>
          <a href="/dashboard/provider/bookings" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition">
            <Calendar size={20} /> My Bookings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200">
           <button className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-2 text-slate-600">
            <User size={20} className="bg-slate-100 rounded-full p-1" />
            <span className="text-sm font-medium">Provider Portal</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}