"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ticket, 
  History, 
  Heart, 
  Settings, 
  User, 
  LogOut,
  Search
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/dashboard/events", icon: Search },
    { name: "My Tickets", href: "/dashboard/tickets", icon: Ticket },
    { name: "Order History", href: "/dashboard/orders", icon: History },
    { name: "Saved Events", href: "/dashboard/saved", icon: Heart },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <span className="text-xl font-bold tracking-tight text-blue-600">LuminaTickets</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 w-full text-left">
            <LogOut className="w-4 h-4 text-zinc-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-zinc-800">
            {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-zinc-200 py-4 px-8 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} LuminaTickets. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
