'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const [events, setEvents] = useState<any[]>([]);
const [isloading, setIsLoading] = useState(true);

useEffect(() => {
  async function fetchEvents() {
    try {
      const response = await api.get('/booking/events')
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events', error);
    } finally {
      setIsLoading(false)
    }
  }
  fetchEvents();
}, []);

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Public Header / Navbar */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 max-w-7xl mx-auto w-full">
        <div className="text-xl font-bold tracking-tight text-blue-600">
          LuminaTickets
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
          <Link href="/events" className="text-zinc-900">
            All Events
          </Link>
          <Link href="#" className="hover:text-zinc-900">
            Venues
          </Link>
          <Link href="#" className="hover:text-zinc-900">
            About
          </Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 hidden sm:flex"
            >
              Log In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Discover Events
            </h1>
            <p className="text-zinc-500 mt-2 text-lg">
              Find the best concerts and live experiences near you.
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search artists, events, or venues..."
                className="pl-10 border-zinc-200 focus-visible:ring-blue-600"
              />
            </div>
            <Button variant="outline" className="border-zinc-200 shrink-0">
              <Filter className="w-4 h-4 mr-2 text-zinc-500" />
              Filters
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        {isloading ? (
          <div className="text-zinc-500 py-10">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-zinc-500 py-10">
            No upcoming events available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const dateStr = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const timeStr = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <Link
                  href={`/dashboard/events/${event.id}`}
                  key={event.id}
                  className="group"
                >
                  <Card
                    className="border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden h-full flex flex-col bg-white"
                  >
                    {/* Image Placeholder */}
                    <div
                      className="h-40 w-full bg-zinc-100 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden"
                    >
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col bg-white relative z-10">
                      <div className="mb-3">
                        <h3
                          className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {event.name}
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          {event.artist || 'Unknown Artist'}
                        </p>
                      </div>

                      <div className="space-y-2 mt-auto pt-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>
                            {dateStr} • {timeStr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">
                            {event.venue || 'TBA'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <span className="font-bold text-zinc-900">
                          {event.basePrice
                            ? `$${event.basePrice}`
                            : 'Tickets Available'}
                        </span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-none"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
