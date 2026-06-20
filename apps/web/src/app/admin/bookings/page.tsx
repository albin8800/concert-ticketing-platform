import { Search, Filter, Download, MoreHorizontal, Eye } from 'lucide-react';

export default function BookingsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Bookings & Orders</h1>
          <p className="text-sm text-zinc-400 mt-1">Track ticket sales and customer orders in real-time.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
          <Download size={18} className="mr-2 text-emerald-400" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input type="text" className="w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-emerald-500" placeholder="Search Order ID or Customer..." />
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-300 text-sm focus:outline-none focus:border-emerald-500">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
            <Filter size={18} className="mr-2 text-zinc-400" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Concert</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <OrderRow id="ORD-7829" name="Michael Scott" concert="Taylor Swift - Eras Tour" date="Today, 14:23" total="$350.00" status="Completed" />
              <OrderRow id="ORD-7828" name="Jim Halpert" concert="The Weeknd - After Hours" date="Today, 11:45" total="$199.50" status="Pending" />
              <OrderRow id="ORD-7827" name="Pam Beesly" concert="Coldplay - Music of the Spheres" date="Yesterday" total="$420.00" status="Completed" />
              <OrderRow id="ORD-7826" name="Dwight Schrute" concert="The Weeknd - After Hours" date="Oct 18, 2026" total="$199.50" status="Cancelled" />
              <OrderRow id="ORD-7825" name="Stanley Hudson" concert="Taylor Swift - Eras Tour" date="Oct 18, 2026" total="$175.00" status="Completed" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ id, name, concert, date, total, status }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <tr className="hover:bg-zinc-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-400">{id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-zinc-200">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{concert}</td>
      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">{date}</td>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-200">{total}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>{status}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button className="text-zinc-500 hover:text-emerald-400 p-2 rounded-md hover:bg-zinc-800 transition-colors"><Eye size={18} /></button>
      </td>
    </tr>
  );
}
