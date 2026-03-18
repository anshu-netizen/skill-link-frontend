"use client";
import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, Calendar, 
  MapPin, Briefcase, History as HistoryIcon,
  Search, Mail, Trash2, ExternalLink, Star, X
} from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyRequests();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBySearch = bookings.filter(b => 
    b.skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ongoingBookings = filteredBySearch.filter(b => ['pending', 'accepted'].includes(b.status));
  const historyBookings = filteredBySearch.filter(b => ['completed', 'cancelled'].includes(b.status));

  const displayList = activeTab === 'ongoing' ? ongoingBookings : historyBookings;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* --- BLUE HEADER --- */}
      <div className="bg-[#003580] pt-12 pb-24 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-white text-4xl font-black mb-2 tracking-tight">My Bookings</h1>
            <p className="text-blue-100 font-medium opacity-80">Manage your service requests and provide feedback</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search services..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-blue-200 outline-none focus:bg-white focus:text-slate-900 transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 -mt-12">
        {/* --- TABS --- */}
        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-2xl mb-10 w-fit border border-slate-100">
          <button 
            onClick={() => setActiveTab('ongoing')}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'ongoing' ? 'bg-[#006ce4] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Briefcase size={16} /> Ongoing ({ongoingBookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'history' ? 'bg-[#006ce4] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <HistoryIcon size={16} /> History ({historyBookings.length})
          </button>
        </div>

        {/* --- LIST --- */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-44 bg-white border border-slate-200 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : displayList.length > 0 ? (
          <div className="grid gap-6">
            {displayList.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onRefresh={fetchBookings} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No bookings found</h3>
            <Link href="/dashboard/seeker/explore" className="text-blue-600 font-bold underline">Explore Marketplace</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onRefresh }: { booking: any, onRefresh: () => void }) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const statusStyles: any = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-blue-50 text-blue-700 border-blue-100",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this request?")) return;
    setIsActionLoading(true);
    try {
      await bookingService.cancelBooking(booking._id);
      onRefresh();
    } catch (err) {
      alert("Error cancelling booking.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return alert("Please add a comment.");
    setIsActionLoading(true);
    try {
      await bookingService.submitReview({
        bookingId: booking._id,
        rating,
        comment
      });
      setShowReviewForm(false);
      onRefresh();
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-blue-600 font-black text-3xl border border-slate-100">
            {booking.skill.title.charAt(0)}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-slate-900 text-2xl tracking-tight">{booking.skill.title}</h3>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[booking.status]}`}>
                {booking.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 text-slate-500 font-bold text-sm">
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(booking.appointmentTime).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><MapPin size={16} /> {booking.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {booking.provider.name.charAt(0)}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">Provider: <span className="text-slate-700">{booking.provider.name}</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</p>
            <p className="text-3xl font-black text-slate-900">₹{booking.totalPrice}</p>
          </div>

          <div className="flex gap-2">
            {booking.status === 'completed' && !booking.review && !showReviewForm && (
              <button 
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-blue-700 shadow-lg shadow-blue-100"
              >
                Rate Service
              </button>
            )}

            {booking.status === 'pending' && (
              <button onClick={handleCancel} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={20} />
              </button>
            )}

            <Link href={`/dashboard/seeker/skills/${booking.skill._id}`} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all">
              <ExternalLink size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- REVIEW FORM --- */}
      {showReviewForm && (
        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Share your feedback</h4>
            <button onClick={() => setShowReviewForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                <Star size={32} fill={s <= rating ? "#fbbf24" : "none"} className={s <= rating ? "text-amber-400" : "text-slate-200"} />
              </button>
            ))}
          </div>

          <textarea 
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-slate-700 font-medium mb-4"
            placeholder="How was Anshu's work?"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            onClick={handleSubmitReview}
            disabled={isActionLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            {isActionLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* --- DISPLAY EXISTING REVIEW --- */}
      {booking.review && (
        <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < booking.review.rating ? "currentColor" : "none"} />)}
          </div>
          <p className="text-slate-600 italic font-medium">"{booking.review.comment}"</p>
        </div>
      )}
    </div>
  );
}