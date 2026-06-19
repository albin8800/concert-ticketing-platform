import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";

// Mock data for featured events
const FEATURED_EVENTS = [
  {
    id: "evt-1",
    name: "The Lumina Tour 2026",
    artist: "Neon Symphony",
    date: "Oct 24, 2026 • 8:00 PM",
    location: "Madison Square Garden, NY",
    price: "From $65",
    image: "bg-blue-100",
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
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col">
      
      {/* Navigation */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight text-zinc-900">LuminaTickets</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
            <Link href="#events" className="hover:text-blue-600 transition-colors">Concerts</Link>
            <Link href="#venues" className="hover:text-blue-600 transition-colors">Venues</Link>
            <Link href="#about" className="hover:text-blue-600 transition-colors">About Us</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-zinc-700 hover:text-blue-600 font-medium">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 shadow-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 bg-zinc-50 -z-10">
          {/* Subtle background decoration */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
              Live experiences, <br className="hidden md:block" />
              <span className="text-blue-600">perfectly booked.</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-xl mx-auto md:mx-0">
              Secure your spot at the most anticipated concerts of the year. Fast, fair, and incredibly simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="#events">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-md">
                  Browse Events
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-md">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-lg hidden md:block">
            {/* Abstract representation of a ticket or event */}
            <div className="aspect-[4/3] bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-zinc-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-zinc-100 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <TicketIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="h-10 w-24 bg-blue-600 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Events Section */}
      <section id="events" className="py-24 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Trending Now</h2>
              <p className="text-zinc-500 text-lg">Don't miss out on these upcoming shows.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium hidden md:flex items-center gap-2">
                View All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_EVENTS.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="group">
                <Card className="border-zinc-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col rounded-xl">
                  {/* Image Placeholder */}
                  <div className={`h-56 w-full ${event.image} relative group-hover:scale-105 transition-transform duration-500`}></div>
                  
                  <CardContent className="p-8 flex-1 flex flex-col bg-white relative z-10 border-t border-zinc-100">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-zinc-500 text-sm mt-1">{event.artist}</p>
                    </div>
                    
                    <div className="space-y-3 mt-auto pt-4">
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                        </div>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                          <MapPin className="w-4 h-4 text-zinc-500" />
                        </div>
                        <span className="font-medium truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-500 block">Starting at</span>
                        <span className="font-bold text-xl text-zinc-900">{event.price}</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-none rounded-md px-6">
                        Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/events">
              <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                View All Events
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <TicketIcon className="w-6 h-6" />
              <span className="text-xl font-bold tracking-tight">LuminaTickets</span>
            </div>
            <p className="max-w-xs text-sm">
              The premium platform for securing your spot at the world's most anticipated live events.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-zinc-800 text-sm flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} LuminaTickets. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
