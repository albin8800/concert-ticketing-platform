"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import api from '@/lib/axios';

export default function AddConcert() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    basePrice: '',
    capacity: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    setIsUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          console.error("Cloudinary environment variables are missing!");
          setIsUploading(false);
          return;
        }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: uploadData,
          });

          const data = await response.json();

          if(data.secure_url) {
            setImageUrl(data.secure_url);
          } else {
            console.error("upload failed", error);
          } 
    } catch (error) {
      console.error("upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time into an ISO string
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

      await api.post('/booking/admin/events', {
        name: formData.title,
        artist: formData.artist,
        description: formData.description,
        venue: formData.venue,
        image: imageUrl || "",
        date: dateTime,
        totalCapacity: parseInt(formData.capacity, 10),
        basePrice: parseFloat(formData.basePrice)
      });

      router.push('/admin/concerts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create concert.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/concerts" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-50 rounded-lg hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Add New Concert</h1>
            <p className="text-sm text-zinc-400 mt-1">Fill in the details to create a new event.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/concerts" className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:bg-zinc-800 transition-colors text-sm">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50">
            <Save size={18} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Concert'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-50">General Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Concert Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. After Hours Tour" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Artist / Band</label>
                <input required name="artist" value={formData.artist} onChange={handleChange} type="text" placeholder="e.g. The Weeknd" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Write a catchy description for the event..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-50">Date & Location</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar size={18} className="text-zinc-500" /></div>
                  <input required name="date" value={formData.date} onChange={handleChange} type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock size={18} className="text-zinc-500" /></div>
                  <input required name="time" value={formData.time} onChange={handleChange} type="time" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Venue</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin size={18} className="text-zinc-500" /></div>
                  <select required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                    <option value="" disabled>Select a venue...</option>
                    <option value="msg">Madison Square Garden, NY</option>
                    <option value="wembley">Wembley Stadium, London</option>
                    <option value="accor">Accor Arena, Paris</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-50">Concert Media</h2>

      <label className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 hover:border-emerald-500/50 transition-colors cursor-pointer group relative overflow-hidden">

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />

        {imageUrl ? (
          // If we have an image, show a preview!
          <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        ) : (
          // If no image, show the upload icon
          <>
            <div className="h-12 w-12 bg-zinc-950 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon size={24} className="text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              {isUploading ? "Uploading to cloud..." : "Click to upload poster"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF</p>
          </>
        )}
      </label>
    </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-50">Ticketing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Base Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={18} className="text-zinc-500" /></div>
                  <input required name="basePrice" value={formData.basePrice} onChange={handleChange} type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Total Capacity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users size={18} className="text-zinc-500" /></div>
                  <input required name="capacity" value={formData.capacity} onChange={handleChange} type="number" min="1" placeholder="e.g. 5000" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
