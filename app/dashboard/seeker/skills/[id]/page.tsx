"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, Clock, MapPin, Star, ShieldCheck, 
  ChevronLeft, CheckCircle2, AlertCircle, User, Quote
} from 'lucide-react';
import { skillService } from '@/services/skillService';
import { bookingService } from '@/services/bookingService';

export default function SkillDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [skill, setSkill] = useState<any>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState(""); 
  
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const skillData = await skillService.getSkillById(id as string);
        setSkill(skillData);
        try {
          const allBookings = await bookingService.getAllBookings();
          setExistingBookings(allBookings || []);
        } catch (e) {
          console.warn("Booking conflict check unavailable.");
        }
      } catch (err) {
        setErrorMessage("Could not load skill details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // --- CALCULATION LOGIC ---
  const reviews = skill?.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, item: any) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : "New";

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !location) {
      setErrorMessage("Please select date, time, and provide a location.");
      return;
    }
    const appointmentDate = new Date(`${selectedDate}T${selectedTime}`);
    const appointmentISO = appointmentDate.toISOString();
    
    setBookingStatus('loading');
    try {
      const payload = {
        skillId: skill!._id,
        providerId: skill!.provider._id,
        appointmentTime: appointmentISO,
        totalPrice: skill!.price,
        location: location 
      };
      await bookingService.createBooking(payload);
      setBookingStatus('success');
      setTimeout(() => router.push('/dashboard/seeker/bookings'), 2000);
    } catch (err: any) {
      setBookingStatus('error');
      setErrorMessage(err.response?.data?.message || "Booking failed.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-black text-blue-600 animate-bounce">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <button onClick={() => router.back()} className="flex items-center text-slate-900 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors">
          <ChevronLeft size={20} /> Back to Search
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: CONTENT */}
        <div className="lg:col-span-7 space-y-12">
          {/* Hero Image */}
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-200">
            <img src={skill?.images[0]} className="w-full aspect-[16/10] object-cover" alt={skill?.title} />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              <span className="font-black text-slate-900 text-lg">{averageRating}</span>
              <span className="text-slate-400 font-bold">({reviews.length} Reviews)</span>
            </div>
          </div>

          {/* Title & Provider */}
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{skill?.title}</h1>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                {skill?.provider?.name.charAt(0)}
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Expert Provider</p>
                <p className="text-slate-900 font-bold text-lg">{skill?.provider?.name}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">About this service</h3>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">{skill?.description}</p>
          </div>

          <hr className="border-slate-100" />

          {/* REVIEWS SECTION */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Customer Reviews</h3>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <Star className="text-amber-400 fill-amber-400" size={16} />
                <span className="font-bold">{averageRating} Average</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev: any, idx: number) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
                    <Quote className="absolute top-6 right-8 text-slate-100" size={40} />
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? "#fbbf24" : "none"} className={i < rev.rating ? "text-amber-400" : "text-slate-200"} />
                      ))}
                    </div>
                    <p className="text-slate-600 font-medium mb-6 relative z-10">"{rev.comment}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={16} /></div>
                      <span className="font-black text-slate-900 text-sm">{rev.userName || "Verified Client"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No reviews yet. Be the first to book!</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING WIDGET */}
        <div className="lg:col-span-5">
          <div className="bg-[#003580] text-white rounded-[3.5rem] p-12 shadow-2xl sticky top-28 border-[1px] border-white/10">
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black tracking-tighter">₹{skill?.price}</span>
              <span className="text-blue-300 font-bold text-lg uppercase tracking-widest">/visit</span>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Date</label>
                  <input type="date" className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-4 outline-none focus:bg-white focus:text-slate-900 font-bold transition-all" onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Time</label>
                  <input type="time" className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-4 outline-none focus:bg-white focus:text-slate-900 font-bold transition-all" onChange={(e) => setSelectedTime(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Service Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-blue-300" size={20} />
                  <input 
                    type="text" 
                    placeholder="E.g. House 45, Lalitpur" 
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 outline-none focus:bg-white focus:text-slate-900 font-bold placeholder:text-white/20 transition-all"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={bookingStatus === 'loading'}
                className="w-full bg-[#ffb700] text-[#003580] py-6 rounded-[2rem] font-black text-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-2xl mt-4"
              >
                {bookingStatus === 'loading' ? 'Processing...' : 'Reserve Now'}
              </button>

              <div className="flex flex-col gap-4">
                {bookingStatus === 'success' && (
                  <div className="bg-emerald-500/20 text-emerald-300 p-4 rounded-2xl flex items-center gap-3 font-black border border-emerald-500/30 text-sm uppercase">
                    <CheckCircle2 size={18} /> Booking Confirmed!
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-red-500/20 text-red-300 p-4 rounded-2xl flex items-center gap-3 font-bold border border-red-500/30 text-xs">
                    <AlertCircle size={18} /> {errorMessage}
                  </div>
                )}
              </div>

              <p className="text-center text-blue-300/60 text-[10px] font-bold uppercase tracking-widest">Secure payment via SkillLink Escrow</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}