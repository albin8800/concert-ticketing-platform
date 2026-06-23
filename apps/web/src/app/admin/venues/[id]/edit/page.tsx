"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, MapPin, Users, Type } from 'lucide-react';
import api from '@/lib/axios';

export default function EditVenue() {
  const router = useRouter();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    type: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenue() {
      try {
        const response = await api.get('/booking/admin/venues');
        const venues = response.data.venues || [];
        const venue = venues.find((v: any) => v.id === id);

        if (venue) {
          setFormData({
            name: venue.name || '',
            location: venue.location || '',
            capacity: venue.capacity ? venue.capacity.toString() : '',
            type: venue.type || ''
          });
          setImageUrl(venue.image || null);
        } else {
          setError("Venue not found.");
        }
      } catch (err) {
        setError('Failed to load venue details.');
      } finally {
        setIsFetching(false);
      }
    }
    if (id) loadVenue();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        console.error("upload failed", data);
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
      await api.put(`/booking/admin/venues/${id}`, {
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity, 10),
        type: formData.type,
        image: imageUrl || ""
      });

      router.push('/admin/venues');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update venue.');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center text-zinc-400 py-10">Loading venue details...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/venues" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-50 rounded-lg hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Edit Venue</h1>
            <p className="text-sm text-zinc-400 mt-1">Update the details of the venue.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/venues" className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:bg-zinc-800 transition-colors text-sm">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50">
            <Save size={18} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
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
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Venue Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Madison Square Garden" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin size={18} className="text-zinc-500" /></div>
                  <input required name="location" value={formData.location} onChange={handleChange} type="text" placeholder="e.g. New York, NY" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Total Capacity</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users size={18} className="text-zinc-500" /></div>
                    <input required name="capacity" value={formData.capacity} onChange={handleChange} type="number" min="1" placeholder="e.g. 20000" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Venue Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Type size={18} className="text-zinc-500" /></div>
                    <select required name="type" value={formData.type} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-50 appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                      <option value="" disabled>Select venue type...</option>
                      <option value="Indoor Arena">Indoor Arena</option>
                      <option value="Outdoor Stadium">Outdoor Stadium</option>
                      <option value="Theater">Theater</option>
                      <option value="Club">Club / Bar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-50">Venue Image</h2>

            <label className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 hover:border-emerald-500/50 transition-colors cursor-pointer group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              ) : (
                <>
                  <div className="h-12 w-12 bg-zinc-950 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-300">
                    {isUploading ? "Uploading to cloud..." : "Click to upload image"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF</p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
