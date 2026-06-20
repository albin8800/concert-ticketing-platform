import { TrendingUp, Users, Ticket, DollarSign, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Dashboard Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$124,563.00"
          trend="+14.5%"
          trendUp={true}
          icon={<DollarSign className="text-emerald-400" size={24} />}
        />
        <StatCard
          title="Tickets Sold"
          value="8,432"
          trend="+5.2%"
          trendUp={true}
          icon={<Ticket className="text-emerald-500" size={24} />}
        />
        <StatCard
          title="Active Concerts"
          value="24"
          trend="-2.1%"
          trendUp={false}
          icon={<TrendingUp className="text-emerald-400" size={24} />}
        />
        <StatCard
          title="New Users"
          value="1,245"
          trend="+18.2%"
          trendUp={true}
          icon={<Users className="text-emerald-400" size={24} />}
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h3 className="text-base font-semibold text-zinc-50">Recent Bookings</h3>
          <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Concert</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <BookingRow
                name="Alice Freeman"
                email="alice@example.com"
                concert="The Weeknd - After Hours"
                amount="$299.00"
                status="Completed"
              />
              <BookingRow
                name="Marcus Johnson"
                email="marcus.j@example.com"
                concert="Coldplay - Music of the Spheres"
                amount="$150.00"
                status="Pending"
              />
              <BookingRow
                name="Sarah Williams"
                email="sarah.w@example.com"
                concert="Taylor Swift - Eras Tour"
                amount="$450.00"
                status="Completed"
              />
              <BookingRow
                name="David Chen"
                email="david.c@example.com"
                concert="Ed Sheeran - Mathematics"
                amount="$89.00"
                status="Failed"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon }: { title: string; value: string; trend: string; trendUp: boolean; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-3xl font-bold text-zinc-50 mt-2 tracking-tight">{value}</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`flex items-center font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {trendUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {trend}
        </span>
        <span className="text-zinc-500 ml-2">vs last month</span>
      </div>
      
      {/* Decorative background gradient */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all"></div>
    </div>
  );
}

function BookingRow({ name, email, concert, amount, status }: { name: string; email: string; concert: string; amount: string; status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <tr className="hover:bg-zinc-800/50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-medium text-xs">
            {name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-zinc-200">{name}</p>
            <p className="text-xs text-zinc-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-zinc-300">{concert}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-200">
        {amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-zinc-500 hover:text-emerald-400 p-1 rounded-md hover:bg-zinc-800 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
