"use client";
import { useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { CheckCircle2, Clock, User, MessageSquare, Loader2, Check } from 'lucide-react';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getIncomingJobs();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, type: 'accept' | 'complete') => {
    try {
      if (type === 'accept') await bookingService.acceptBooking(id);
      else await bookingService.completeBooking(id);
      loadBookings(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Incoming Jobs</h1>
      
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl text-slate-400">
            No one has hired you yet. Keep your skills updated!
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                    booking.status === 'accepted' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {booking.status}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">{booking.skill?.title}</h3>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <User size={14} /> Client: {booking.seeker?.name}
                  </div>
                  {booking.message && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm italic">
                      <MessageSquare size={14} /> "{booking.message}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center items-end gap-3">
                <p className="text-2xl font-black text-slate-900">₹{booking.totalPrice}</p>
                
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleAction(booking._id, 'accept')}
                      className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                      Accept Job
                    </button>
                  )}
                  {booking.status === 'accepted' && (
                    <button 
                      onClick={() => handleAction(booking._id, 'complete')}
                      className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"
                    >
                      <Check size={16} /> Mark Completed
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 size={16} /> Job Finished
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}