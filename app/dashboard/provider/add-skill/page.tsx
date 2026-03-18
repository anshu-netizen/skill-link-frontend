"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, Sparkles, IndianRupee, 
  Loader2, CheckCircle2, Image as ImageIcon, MapPin, Hash, X
} from 'lucide-react';
import { skillService } from '@/services/skillService';

export default function FullPageAddSkill() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    tags: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // We must use FormData because we are sending a File (image)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('tags', formData.tags);
      if (image) {
        data.append('images', image); // 'images' matches your Postman key
      }

      await skillService.createSkill(data);
      
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/provider'), 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post skill.");
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
        <h2 className="text-3xl font-black text-slate-900">Skill Published!</h2>
        <p className="text-slate-500 mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Instructions */}
        <div className="lg:w-1/3 p-12 lg:p-20 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-blue-600 font-black tracking-widest text-xs uppercase">Step 0{step} of 04</span>
            <h1 className="text-4xl font-black text-slate-900 mt-4 leading-tight">
              {step === 1 && "What's your specialty?"}
              {step === 2 && "The value of your work."}
              {step === 3 && "Visuals & Reach."}
              {step === 4 && "Review & Launch."}
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
              {step === 1 && "Start with a strong title and a category that best fits your expertise."}
              {step === 2 && "Describe your service in detail and set a competitive price for your work."}
              {step === 3 && "Upload a photo of your work and tell us which city you are located in."}
              {step === 4 && "Check everything one last time. Make sure your price and location are correct."}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-bold text-sm">
            <Sparkles size={16} /> SkillLink Provider Studio
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-12 lg:px-24 flex flex-col justify-center max-w-5xl">
          <div className="w-full">
            
            {/* STEP 1: TITLE & CATEGORY */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Service Title</label>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="e.g. Belchaa Bahadur Constructions"
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
                    <option value="Plumbing">Plumbing</option>
                    <option value="Construction">Construction</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Tutoring">Tutoring</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: PRICE & DESCRIPTION */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Base Price (NPR)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
                    <input 
                      type="number" 
                      className={`${inputClass} pl-10`}
                      placeholder="67"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Description</label>
                  <textarea 
                    rows={5}
                    className={inputClass}
                    placeholder="e.g. Belchaa hanne ho..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: IMAGE, LOCATION & TAGS */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase">Service Thumbnail</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-slate-300 mb-2" size={48} />
                        <p className="text-slate-400 font-bold">Click to upload work photo</p>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-900 uppercase">Location (City)</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        className={`${inputClass} pl-12`}
                        placeholder="e.g. Dharan"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-900 uppercase">Tags</label>
                    <div className="relative">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        className={`${inputClass} pl-12`}
                        placeholder="e.g. constructions, building"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SUMMARY */}
            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <SummaryBlock label="Service Title" value={formData.title} />
                    <SummaryBlock label="Category" value={formData.category} />
                    <SummaryBlock label="Price" value={`₹${formData.price}`} />
                    <SummaryBlock label="Location" value={formData.location} />
                  </div>
                  <div className="space-y-6">
                    <SummaryBlock label="Description" value={formData.description} />
                    <SummaryBlock label="Tags" value={formData.tags} />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Media Preview</p>
                      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        {imagePreview && <img src={imagePreview} className="w-full h-full object-cover" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-16 flex items-center gap-6">
              <button 
                onClick={step === 4 ? handleSubmit : nextStep} 
                disabled={loading || (step === 1 && (!formData.title || !formData.category)) || (step === 3 && !image)}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" /> : step === 4 ? 'Confirm & Publish' : 'Next Step'}
                {!loading && <ArrowRight size={20} />}
              </button>
              
              {step > 1 && (
                <button 
                  type="button"
                  onClick={prevStep} 
                  className="text-slate-400 font-bold hover:text-slate-900 transition-colors"
                >
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
      <p className="text-lg font-bold text-slate-900 break-words leading-tight">{value || "—"}</p>
    </div>
  );
}