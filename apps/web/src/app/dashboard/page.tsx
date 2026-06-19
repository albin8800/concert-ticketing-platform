"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome back, John!</h1>
          <p className="text-zinc-500 mt-2">
            You have 2 upcoming events. Your next concert is in 4 days.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 px-6 py-2 rounded-md">
          Browse New Events
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upcoming Tickets */}
        <Card className="md:col-span-2 border-zinc-200 shadow-sm">
          <CardHeader className="border-b border-zinc-100 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-zinc-800">Your Next Event</CardTitle>
            <Link href="/dashboard/tickets" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-24 h-24 bg-zinc-100 rounded-lg flex flex-col items-center justify-center border border-zinc-200 shrink-0">
                <span className="text-xs font-bold text-red-600 uppercase">Oct</span>
                <span className="text-3xl font-black text-zinc-900">24</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">The Lumina Tour 2026</h3>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Madison Square Garden</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 8:00 PM</span>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                    Section 112 • Row F • Seat 14
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 border-zinc-200 text-zinc-700 hover:bg-zinc-50">
                View Ticket
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Account Summary */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <CardTitle className="text-lg text-zinc-800">Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              <div className="flex justify-between items-center p-4">
                <span className="text-zinc-600 text-sm">Total Tickets Bought</span>
                <span className="font-bold text-zinc-900">12</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-zinc-600 text-sm">Saved Events</span>
                <span className="font-bold text-zinc-900">4</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-zinc-600 text-sm">Loyalty Points</span>
                <span className="font-bold text-blue-600">1,250</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recommended Events */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-32 bg-zinc-200 rounded-t-xl"></div>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-zinc-900">Neon Symphony Live</h4>
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Nov {10 + item}, 2026
                </p>
                <p className="text-sm font-medium text-blue-600 mt-2">Tickets from $65</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
