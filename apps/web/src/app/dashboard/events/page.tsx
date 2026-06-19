"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";

// Mock data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: "evt-1",
    name: "The Lumina Tour 2026",
    artist: "Neon Symphony",
    date: "Oct 24, 2026 • 8:00 PM",
    location: "Madison Square Garden, NY",
    price: "From $65",
    image: "bg-blue-100", // Placeholder color
  },
  {
    id: "evt-2",
    name: "Midnight Echoes",
    artist: "The Velvet Underground",
    date: "Nov 02, 2026 • 7:30 PM",
    location: "Red Rocks Amphitheatre, CO",
    price: "From $85",
    image: "bg-indigo-100",
  },
  {
    id: "evt-3",
    name: "Summer Waves Festival",
    artist: "Various Artists",
    date: "Nov 15, 2026 • 12:00 PM",
    location: "Coachella Valley, CA",
    price: "From $199",
    image: "bg-emerald-100",
  },
  {
    id: "evt-4",
    name: "Acoustic Nights",
    artist: "Sarah Jenkins",
    date: "Dec 05, 2026 • 8:00 PM",
    location: "Ryman Auditorium, TN",
    price: "From $45",
    image: "bg-amber-100",
  },
  {
    id: "evt-5",
    name: "Electric Sky",
    artist: "DJ Apex",
    date: "Dec 31, 2026 • 10:00 PM",
    location: "MGM Grand, NV",
    price: "From $120",
    image: "bg-purple-100",
  },
  {
    id: "evt-6",
    name: "Symphony in the Park",
    artist: "NY Philharmonic",
    date: "Jan 12, 2027 • 6:00 PM",
    location: "Central Park, NY",
    price: "Free",
    image: "bg-rose-100",
  }
];

export default function DashboardEventsPage() {
  return (
    <div className="space-y-8">
      
      {/* Page Title & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Available Events</h1>
          <p className="text-zinc-500 mt-1">Discover and book tickets for upcoming shows.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search artists, events, or venues..." 
              className="pl-10 border-zinc-200 focus-visible:ring-blue-600 bg-white"
            />
          </div>
          <Button variant="outline" className="border-zinc-200 bg-white shrink-0">
            <Filter className="w-4 h-4 mr-2 text-zinc-500" />
            Filters
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UPCOMING_EVENTS.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="group">
            <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden h-full flex flex-col bg-white">
              {/* Image Placeholder */}
              <div className={`h-40 w-full ${event.image} relative group-hover:scale-105 transition-transform duration-500`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              
              <CardContent className="p-5 flex-1 flex flex-col bg-white relative z-10">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {event.name}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">{event.artist}</p>
                </div>
                
                <div className="space-y-2 mt-auto pt-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{event.price}</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-none">
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
