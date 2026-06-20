import { Plus, Search, Filter, MoreHorizontal, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ConcertsManagement() {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Concerts</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your events, update details, and monitor ticket sales.
          </p>
        </div>
        <Link href="/admin/concerts/new" className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
          <Plus size={18} className="mr-2" />
          Add Concert
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors sm:text-sm"
            placeholder="Search concerts by name or artist..."
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Filter size={18} className="mr-2 text-zinc-400" />
          Filters
        </button>
      </div>

      {/* Concerts Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Event Info</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Tickets Sold</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <ConcertRow
                title="The Weeknd - After Hours Tour"
                artist="The Weeknd"
                date="Oct 24, 2026"
                time="20:00 PM"
                venue="Madison Square Garden"
                city="New York, NY"
                sold="14,230"
                capacity="19,500"
                status="Upcoming"
                image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop"
              />
              <ConcertRow
                title="Taylor Swift - Eras Tour"
                artist="Taylor Swift"
                date="Nov 12, 2026"
                time="19:30 PM"
                venue="Wembley Stadium"
                city="London, UK"
                sold="90,000"
                capacity="90,000"
                status="Sold Out"
                image="https://images.unsplash.com/photo-1540039155732-61ee01b44b4b?q=80&w=200&auto=format&fit=crop"
              />
              <ConcertRow
                title="Coldplay - Music of the Spheres"
                artist="Coldplay"
                date="Dec 05, 2026"
                time="20:30 PM"
                venue="Accor Arena"
                city="Paris, FR"
                sold="12,450"
                capacity="20,000"
                status="Upcoming"
                image="https://images.unsplash.com/photo-1533174000222-35368a5c37fb?q=80&w=200&auto=format&fit=crop"
              />
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <span className="text-sm text-zinc-400">
            Showing <span className="font-medium text-zinc-200">1</span> to <span className="font-medium text-zinc-200">3</span> of <span className="font-medium text-zinc-200">24</span> results
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-zinc-700 rounded-md text-zinc-500 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 text-sm border border-zinc-700 rounded-md text-zinc-300 hover:bg-zinc-800 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConcertRow({ title, artist, date, time, venue, city, sold, capacity, status, image }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Sold Out': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'Past': return 'bg-zinc-800 text-zinc-500 border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const percentageSold = Math.round((parseInt(sold.replace(/,/g, '')) / parseInt(capacity.replace(/,/g, ''))) * 100);

  return (
    <tr className="hover:bg-zinc-800/50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-zinc-700 shrink-0">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200 truncate max-w-[200px]">{title}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{artist}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-zinc-300">
          <Calendar size={14} className="mr-2 text-zinc-500" />
          {date}
        </div>
        <div className="text-xs text-zinc-500 mt-1 ml-6">
          {time}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-zinc-300">
          <MapPin size={14} className="mr-2 text-zinc-500" />
          {venue}
        </div>
        <div className="text-xs text-zinc-500 mt-1 ml-6">
          {city}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium text-zinc-200">{sold}</span>
          <span className="text-xs text-zinc-500">/ {capacity}</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${percentageSold >= 95 ? 'bg-emerald-500' : 'bg-emerald-400'}`} 
            style={{ width: `${percentageSold}%` }}
          ></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-zinc-500 hover:text-emerald-400 p-2 rounded-md hover:bg-zinc-800 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
