"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, Sparkles, IndianRupee, 
  Loader2, CheckCircle2 
} from 'lucide-react';
import api from '@/lib/api';

export default function FullPageAddSkill() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: ''
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/skills', { ...formData, price: Number(formData.price) });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/provider'), 2000);
    } catch (err) {
      alert("Failed to post skill.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-lg text-slate-900";

  if (success) {
    return (
      <div className="h-screen flex flex-col items-center justify-center animate-in fade-in duration-500 bg-white">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Success!</h2>
        <p className="text-slate-500 mt-2">Your skill is now live on SkillLink.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Progress Bar (Stretches full width) */}
      <div className="w-full h-1.5 bg-slate-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Context/Instruction */}
        <div className="lg:w-1/3 p-12 lg:p-20 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-blue-600 font-black tracking-widest text-xs uppercase">Step 0{step} of 03</span>
            <h1 className="text-4xl font-black text-slate-900 mt-4 leading-tight">
              {step === 1 && "What's your specialty?"}
              {step === 2 && "The value of your work."}
              {step === 3 && "Let's double check."}
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
              {step === 1 && "Give your service a catchy title and category so clients can find you easily."}
              {step === 2 && "Set a fair price and describe exactly what you offer. Clarity builds trust."}
              {step === 3 && "Review all details. Once you publish, your service will be live for everyone."}
            </p>
          </div>

          <div className="hidden lg:block">
             <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                <Sparkles size={16} />
                SkillLink Provider Studio
             </div>
          </div>
        </div>

        {/* Right Side: Form (Uses all remaining space) */}
        <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center max-w-4xl">
          <div className="w-full">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Service Title</label>
                  <input 
                    type="text" 
                    autoFocus
                    className={inputClass}
                    placeholder="e.g. Professional Bathroom Cleaning"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Category</label>
                  <select 
                    className={inputClass}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Hourly/Base Price (NPR)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
                    <input 
                      type="number" 
                      autoFocus
                      className={`${inputClass} pl-10`}
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Description</label>
                  <textarea 
                    rows={6}
                    className={inputClass}
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SummaryBlock label="Title" value={formData.title} />
                  <SummaryBlock label="Category" value={formData.category} />
                  <SummaryBlock label="Price" value={`₹${formData.price}`} />
                  <SummaryBlock label="Description" value={formData.description} />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-16 flex items-center gap-6">
              <button 
                onClick={step === 3 ? handleSubmit : nextStep} 
                disabled={loading || (step === 1 && !formData.title) || (step === 2 && !formData.price)}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" /> : step === 3 ? 'Publish Service' : 'Next Step'}
                <ArrowRight size={20} />
              </button>
              
              {step > 1 && (
                <button onClick={prevStep} className="text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  Go Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryBlock({ label, value }: { label: string, value: string }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value || "—"}</p>
    </div>
  );
}