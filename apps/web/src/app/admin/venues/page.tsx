'use client';
import api from '@/lib/axios';
import { Plus, Search, Map, Users, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VenuesManagement() {

  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
   
  fetchVenues();
  }, []);

   async function fetchVenues() {
      try {
        setIsLoading(true);
        const response = await api.get('/booking/admin/venues');
        setVenues(response.data.venues || [])
      } catch (error) {
        console.error('Failed to load venues', error);
      } finally {
        setIsLoading(false);
      }
    }

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure want to delete this venue?')) {
      try{
        await api.delete(`/booking/admin/venues/${id}`);
        fetchVenues();
      } catch(error) {
        console.error('Failed to delete Venue', error);
        alert('Failed to delete Venue');
      }
     
    }
  }

  const filteredVenues = venues.filter((venue) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (venue.name && venue.name.toLowerCase().includes(searchLower)) ||
      (venue.location &&
        venue.location.toLowerCase().includes(searchLower)) ||
      (venue.city && venue.city.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Venues</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage concert locations and seating arrangements.</p>
        </div>
        <Link href='/admin/venues/new' className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Plus size={18} className="mr-2" />
          Add Venue
        </Link>
      </div>

      <div className="relative max-w-md w-full mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500" />
        </div>
        <input type="text"
        className="w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        placeholder="Search venues by name or city..."
        onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

    {isLoading ? (
            <div className="text-center text-zinc-400 py-10">Loading venues...</div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center text-zinc-400 py-10">No venues found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  id={venue.id}
                  name={venue.name}
                  location={venue.location || venue.city || 'Unknown Location'}
                  capacity={venue.capacity}
                  type={venue.type || 'Standard Venue'}
                  image={venue.image || "https://images.unsplash.com/photo-1540039155732-61ee01b44b4b?q=80&w=600&auto=format&fit=crop"}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
 

function VenueCard({ id, name, location, capacity, type, image, onDelete }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-colors">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10"></div>
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-zinc-300 flex items-center mt-1">
            <Map size={14} className="mr-1" /> {location}
          </p>
        </div>
      </div>
      <div className="p-5 flex justify-between items-center border-t border-zinc-800/50 bg-zinc-900/50">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase font-semibold">Capacity</span>
            <span className="text-sm font-medium text-zinc-200 flex items-center mt-0.5"><Users size={14} className="mr-1 text-emerald-400" /> {capacity}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase font-semibold">Type</span>
            <span className="text-sm font-medium text-zinc-200 mt-0.5">{type}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/venues/${id}/edit`} className="p-2 text-zinc-400 hover:text-emerald-400 bg-zinc-950 rounded-md border border-zinc-800 hover:border-emerald-500/30 transition-colors"><Edit3 size={16} /></Link>
          <button onClick={() => onDelete(id)} className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-950 rounded-md border border-zinc-800 hover:border-red-500/30 transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}
