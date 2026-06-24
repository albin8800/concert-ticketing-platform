"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  MapPin,
  CreditCard,
  Users,
  Bell,
  Search,
  Menu,
  LogOut,
  Settings
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex h-screen bg-zinc-950 overflow-hidden text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-xl font-bold text-emerald-400">
            AdminPanel
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/concerts" icon={<Ticket size={20} />} label="Concerts" />
          <NavItem href="/admin/venues" icon={<MapPin size={20} />} label="Venues" />
          <NavItem href="/admin/bookings" icon={<CreditCard size={20} />} label="Bookings" />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="Users" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-zinc-50 transition-colors">
            <LogOut size={20} className="mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {/* Header */}
        <header className="h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center flex-1">
            <button className="md:hidden p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
              <Menu size={24} />
            </button>
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-zinc-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg leading-5 bg-zinc-800/50 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                placeholder="Search anything..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-300 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-zinc-900"></span>
            </button>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full border-2 border-zinc-700"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Admin avatar"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <Link href={href}>
      <span
        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          active
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
        }`}
      >
        <span className={`mr-3 ${active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
          {icon}
        </span>
        {label}
      </span>
    </Link>
  );
}
