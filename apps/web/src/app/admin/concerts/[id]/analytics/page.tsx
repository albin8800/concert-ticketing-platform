"use client";

import React, { useState, useEffect, use } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Ticket, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowLeft,
  Calendar,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';


export default function EventAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.id;
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const response = await api.get(`/booking/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Failed to load event details", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEventDetails();
  }, [eventId]);

  if (isLoading) {
    return <div className="text-zinc-400 p-8">Loading analytics...</div>;
  }

  if (!event) {
    return <div className="text-zinc-400 p-8">Event not found.</div>;
  }

  const totalCapacity = event.seats?.length || 0;
  const soldSeats = event.seats?.filter((s: any) => s.status === 'SOLD') || [];
  const ticketsSold = soldSeats.length;
  const revenue = soldSeats.reduce((sum: number, s: any) => sum + (Number(s.price) || 0), 0);
  const capacityPercentage = totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0;
  const reservedTickets = event.seats?.filter((s: any) => s.status === 'RESERVED')?.length || 0;
  const availableTickets = totalCapacity - ticketsSold - reservedTickets;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/concerts" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-2 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Concerts
          </Link>
          <h1 className="text-2xl font-bold text-zinc-50">{event.name} - Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1 flex items-center gap-3">
            <span className="flex items-center"><Calendar size={14} className="mr-1"/> {new Date(event.date).toLocaleDateString()}</span>
            <span className="flex items-center"><MapPin size={14} className="mr-1"/> {event.venue || 'Main Venue'}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${revenue.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive={true} 
          icon={<DollarSign className="w-6 h-6 text-emerald-400" />} 
        />
        <StatCard 
          title="Tickets Sold" 
          value={ticketsSold.toLocaleString()} 
          trend="+5.2%" 
          isPositive={true} 
          icon={<Ticket className="w-6 h-6 text-blue-400" />} 
        />
        <StatCard 
          title="Capacity Reached" 
          value={`${capacityPercentage}%`} 
          trend="+2.1%" 
          isPositive={true} 
          icon={<Users className="w-6 h-6 text-purple-400" />} 
        />
        <StatCard 
          title="Page Views" 
          value={(ticketsSold * 3.4).toLocaleString()} 
          trend="-1.4%" 
          isPositive={false} 
          icon={<TrendingUp className="w-6 h-6 text-orange-400" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-100">Daily Ticket Sales</h2>
            <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-md focus:ring-emerald-500 focus:border-emerald-500 block px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 14 days</option>
            </select>
          </div>
          <div className="flex-1 relative flex items-end justify-between px-2 pb-6 pt-4 border-b border-l border-zinc-800 gap-2">
            {/* Mock Bar Chart */}
            {[20, 35, 15, 60, 45, 80, ticketsSold > 0 ? 50 : 0].map((h, i) => (
              <div key={i} className="relative w-full max-w-[40px] flex flex-col justify-end group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg border border-zinc-700">
                  {Math.round((h / 100) * (ticketsSold || 100))} tickets
                </div>
                <div 
                  className="bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm w-full transition-all duration-300"
                  style={{ height: `${h}%` }}
                ></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
                  {['D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'Today'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-6">Ticket Status Breakdown</h2>
          <div className="space-y-6">
            <ProgressBar label="Sold" percentage={totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0} color="bg-emerald-500" value={`${ticketsSold}`} />
            <ProgressBar label="Reserved" percentage={totalCapacity > 0 ? (reservedTickets / totalCapacity) * 100 : 0} color="bg-orange-500" value={`${reservedTickets}`} />
            <ProgressBar label="Available" percentage={totalCapacity > 0 ? (availableTickets / totalCapacity) * 100 : 0} color="bg-blue-500" value={`${availableTickets}`} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-300 mb-4">Audience Demographics</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">18-24</span>
              <span className="text-zinc-200 font-medium">35%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-zinc-400">25-34</span>
              <span className="text-emerald-400 font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-zinc-400">35-44</span>
              <span className="text-zinc-200 font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-zinc-400">45+</span>
              <span className="text-zinc-200 font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-zinc-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-50 mt-1">{value}</h3>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, color, value }: { label: string, percentage: number, color: string, value: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-sm font-medium text-zinc-400">{value} tickets</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
