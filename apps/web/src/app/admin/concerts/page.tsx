"use client";

import { Plus, Search, Filter, MoreHorizontal, Calendar, MapPin, Edit, Trash2, BarChart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ConcertsManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/booking/events');
        setEvents(response.data.events || []);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-400">Loading events...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-400">No concerts found. Add one to get started!</td>
                </tr>
              ) : (
                events
                  .filter((event) => {
                    const searchLower = searchQuery.toLowerCase();
                    const matchesName = event.name?.toLowerCase().includes(searchLower) || false;
                    const matchesArtist = event.artist?.toLowerCase().includes(searchLower) || false;
                    return matchesName || matchesArtist;
                  })
                  .map((event) => {
                    const eventDate = new Date(event.date);
                    const ticketsSold = event.totalCapacity - event.availableTickets;

                  return (
                    <ConcertRow
                      id={event.id}
                      key={event.id}
                      title={event.name}
                      artist={event.artist || 'Unknown Artist'}
                      date={eventDate.toLocaleDateString()}
                      time={eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      venue={event.venue || 'Platform Venue'}
                      city="Default City"
                      sold={ticketsSold.toString()}
                      capacity={event.totalCapacity?.toString() || '0'}
                      status="Upcoming"
                      image={event.image || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop"}
                    />
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ConcertRow({ id, title, artist, date, time, venue, city, sold, capacity, status, image }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Sold Out': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'Past': return 'bg-zinc-800 text-zinc-500 border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const cap = parseInt(capacity.replace(/,/g, ''));
  const percentageSold = cap > 0 ? Math.round((parseInt(sold.replace(/,/g, '')) / cap) * 100) : 0;

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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-zinc-500 hover:text-emerald-400 p-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-8 top-10 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col text-left">
            <Link 
              href={`/admin/concerts/${id}/analytics`} 
              className="px-4 py-3 flex items-center text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <BarChart size={16} className="mr-3 text-blue-400" /> Analytics
            </Link>
            
            <Link 
              href={`/admin/concerts/${id}/edit`} 
              className="px-4 py-3 flex items-center text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors border-t border-zinc-700/50"
            >
              <Edit size={16} className="mr-3 text-emerald-400" /> Edit Concert
            </Link>
            
            <button 
              onMouseDown={async () => {
                if(window.confirm("Are you sure want to delete the concert")) {
                  try {
                    await api.delete(`/booking/admin/events/${id}`);
                    window.location.reload();
                  } catch (error) {
                    alert("Failed to delete event")
                  }
                }
              }}
              className="w-full px-4 py-3 flex items-center text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-zinc-700/50 text-left"
            >
              <Trash2 size={16} className="mr-3" /> Delete Concert
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
