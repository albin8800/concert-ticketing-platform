"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SEAT_ROWS = 8;
const SEATS_PER_ROW = 12;

type SeatStatus = "AVAILABLE" | "RESERVED" | "SOLD";

// Generate mock seats
const mockSeats = Array.from({ length: SEAT_ROWS * SEATS_PER_ROW }).map((_, i) => {
  const rand = Math.random();
  let status: SeatStatus = "AVAILABLE";
  if (rand > 0.9) status = "SOLD";
  else if (rand > 0.8) status = "RESERVED";
  return { id: i + 1, status };
});

export default function EventBookingPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const [seats, setSeats] = useState(mockSeats);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isHeld, setIsHeld] = useState(false);

  const handleSeatClick = (seat: any) => {
    if (seat.status === "AVAILABLE" && !isHeld) {
      setSelectedSeat(seat.id);
    }
  };

  const reserveSeat = () => {
    if (!selectedSeat) return;
    setIsHeld(true);
    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeat ? { ...s, status: "RESERVED" } : s))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button & Header */}
        <div className="space-y-4">
          <Link href="/events" className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">The Lumina Tour 2026</h1>
              <div className="flex items-center gap-4 text-zinc-500 mt-2 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Madison Square Garden, NY</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Oct 24, 2026 • 8:00 PM</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Tickets from</p>
              <p className="text-2xl font-bold text-zinc-900">$65</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Seat Map */}
          <Card className="lg:col-span-2 border-zinc-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Select Your Seat</CardTitle>
                <div className="flex gap-4 text-xs font-medium text-zinc-500">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-zinc-200 border border-zinc-300"></div> Available</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Held</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-zinc-800"></div> Sold</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 overflow-x-auto">
              <div className="min-w-max mx-auto space-y-3 flex flex-col items-center">
                {/* Stage */}
                <div className="w-3/4 h-8 bg-zinc-200 rounded-t-full mb-8 flex items-center justify-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Stage
                </div>
                
                {/* Grid */}
                <div 
                  className="grid gap-2" 
                  style={{ gridTemplateColumns: `repeat(${SEATS_PER_ROW}, minmax(0, 1fr))` }}
                >
                  {seats.map((seat) => (
                    <button
                      key={seat.id}
                      disabled={seat.status !== "AVAILABLE" && selectedSeat !== seat.id}
                      onClick={() => handleSeatClick(seat)}
                      className={`
                        w-8 h-8 rounded-md transition-all flex items-center justify-center text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 border
                        ${seat.status === "AVAILABLE" ? "bg-zinc-50 border-zinc-200 hover:border-blue-600 text-zinc-600 hover:text-blue-700 cursor-pointer" : ""}
                        ${seat.status === "RESERVED" && selectedSeat !== seat.id ? "bg-yellow-400 border-yellow-500 text-yellow-900 cursor-not-allowed opacity-80" : ""}
                        ${seat.status === "SOLD" ? "bg-zinc-800 border-zinc-900 text-zinc-400 cursor-not-allowed opacity-50" : ""}
                        ${selectedSeat === seat.id && !isHeld ? "bg-blue-600 border-blue-700 text-white shadow-md scale-110" : ""}
                        ${selectedSeat === seat.id && isHeld ? "bg-yellow-400 border-yellow-500 text-yellow-900" : ""}
                      `}
                    >
                      {seat.id}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Panel */}
          <div className="space-y-6">
            <Card className="border-zinc-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              
              <CardHeader>
                <CardTitle className="text-lg">{isHeld ? "Checkout" : "Your Selection"}</CardTitle>
                <CardDescription>
                  {isHeld ? "Complete your purchase within 10 minutes." : "Select and hold your seat securely."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedSeat ? (
                  <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-zinc-500 font-medium">Selected Seat</p>
                      <p className="text-xl font-bold text-zinc-900">Seat #{selectedSeat}</p>
                    </div>
                    <p className="text-xl font-bold text-zinc-900">$65</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-200 rounded-lg">
                    No seats selected
                  </div>
                )}

                <div className="space-y-3">
                  {!isHeld ? (
                    <>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-md transition-all"
                        disabled={!selectedSeat}
                        onClick={reserveSeat}
                      >
                        Hold Seat
                      </Button>
                      <p className="text-xs text-center text-zinc-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> Seats will be held for 10:00 minutes
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200 flex items-center justify-center gap-2 font-bold text-lg mb-4">
                        <Clock className="w-5 h-5" />
                        09:59
                      </div>
                      <Button 
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-12 rounded-md shadow-md"
                      >
                        Pay with Card
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
