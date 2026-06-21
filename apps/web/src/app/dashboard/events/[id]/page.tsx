'use client';
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Calendar, MapPin, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const respose = await api.get(`/booking/events/${id}`);
        setEvent(respose.data)
      } catch (error) {
        console.error('Error fetching Details', error);
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchDetails()
  }, [id]);

  const handleReserve = async() => {
    if(!selectedSeat) return;
    setIsReserving(true);

    try {
      const response = await api.post(`/booking/events/${id}/reserve`, {
        ticketId: selectedSeat
      });
      alert('Seat Reserved for 10 Minutes'+ response.data.message);
      router.push('/dashboard/events')
    } catch (error: any) {
      console.error('Error in Reserving', error);
    } finally {
      setIsReserving(false)
    }
  }

      if (isLoading) return <div className="p-10 text-center text-zinc-500">Loading experience...</div>;
      if (!event) return <div className="p-10 text-center text-red-500">Event not found.</div>;

      const eventDate = new Date(event.date);
      const availableSeats = event.seats?.filter((s: any) => s.status === 'AVAILABLE') || [];


  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <Link href="/dashboard/events" className="inline-flex items-center text-sm text-zinc-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm flex flex-col md:flex-row">
        <div className="md:w-1/3 h-64 md:h-auto bg-zinc-100 relative">
          {event.image && <img src={event.image} alt={event.name} className="w-full h-full object-cover" />}
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-center">
          <p className="text-blue-600 font-semibold mb-2">{event.artist}</p>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">{event.name}</h1>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-zinc-600">
              <Calendar className="w-5 h-5 mr-3 text-zinc-400" />
              <span>{eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex items-center text-zinc-600">
              <MapPin className="w-5 h-5 mr-3 text-zinc-400" />
              <span>{event.venue}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start">
            <Info className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <p>{event.description}</p>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Select Seats</h2>
            <p className="text-zinc-500">{availableSeats.length} tickets currently available</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-white border border-zinc-300 mr-2"></div> Available</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-zinc-200 mr-2"></div> Taken</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-blue-600 mr-2"></div> Selected</div>
          </div>
        </div>

        {/* Seat Map Grid */}
        <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-200 overflow-x-auto">
           {/* "Stage" indicator */}
           <div className="w-full max-w-md mx-auto h-12 bg-zinc-300 rounded-t-full mb-12 flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-sm">
             Stage
           </div>

           <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
             {event.seats?.map((seat: any) => {
               const isAvailable = seat.status === 'AVAILABLE';
               // Hardcoded selection of seat 18 for UI demonstration
               const isSelected = seat.id === selectedSeat; 
               
               return (
                 <button
                   key={seat.id}
                   disabled={!isAvailable}
                   onClick={() => setSelectedSeat(seat.id)}
                   className={`
                     w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium transition-all
                     ${!isAvailable ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : ''}
                     ${isAvailable && !isSelected ? 'bg-white border border-zinc-300 text-zinc-700 hover:border-blue-500 hover:text-blue-600' : ''}
                     ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-110' : ''}
                   `}
                 >
                   {seat.seatNumber}
                 </button>
               )
             })}
           </div>
        </div>

        {/* Checkout Bar */}
         <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
              <div>
                {selectedSeat ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-500">Selected Ticket</span>
                    <span className="text-2xl font-bold text-zinc-900">
                      ${event.seats.find((s:any) => s.id === selectedSeat)?.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-zinc-500 italic">Select a seat to continue</span>
                )}
              </div>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                disabled={!selectedSeat || isReserving}
                onClick={handleReserve}
              >
                {isReserving ? 'Holding Seat...' : 'Reserve Ticket'}
              </Button>
            </div>
      </div>
    </div>
  );
}
