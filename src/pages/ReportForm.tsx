import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { LocationPicker } from '../components/LocationPicker';
import { AnimalType, ConditionTag } from '../types';
import {
  TAGO_BARANGAYS,
  isWithinTago,
  findNearestBarangay } from
'../data/tagoBounds';
export function ReportForm() {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    reporter_name: '',
    animal_type: 'dog' as AnimalType,
    condition_tag: 'roaming' as ConditionTag,
    description: '',
    barangay: ''
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationWarning, setLocationWarning] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const handlePositionChange = (pos: [number, number]) => {
    setPosition(pos);
    if (!isWithinTago(pos[0], pos[1])) {
      // Outside Tago — clear barangay and warn the user. They cannot report.
      setFormData((prev) => ({
        ...prev,
        barangay: ''
      }));
      setLocationWarning(
        'This location is outside Tago Municipality. Reports can only be filed for stray animals within Tago barangays.'
      );
      return;
    }
    // Inside Tago — auto-fill nearest barangay
    setLocationWarning('');
    const nearest = findNearestBarangay(pos[0], pos[1]);
    if (nearest) {
      setFormData((prev) => ({
        ...prev,
        barangay: nearest
      }));
      setErrors((prev) => ({
        ...prev,
        barangay: '',
        location: ''
      }));
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          photo: 'Image must be less than 5MB'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setErrors({
          ...errors,
          photo: ''
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim())
    newErrors.description = 'Description is required';
    if (!photoUrl) newErrors.photo = 'A photo is required';
    if (!position) {
      newErrors.location = 'Please tap "Use My Location" to set the location';
    } else if (!isWithinTago(position[0], position[1])) {
      newErrors.location =
      'This location is outside Tago Municipality. Reports can only be filed for strays inside Tago barangays.';
    }
    if (!formData.barangay) newErrors.barangay = 'Please select a barangay';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      const newId = addReport(
        {
          ...formData,
          reporter_name: formData.reporter_name || user?.username || '',
          photo_url: photoUrl,
          latitude: position![0],
          longitude: position![1]
        },
        user?.id
      );
      setIsSubmitting(false);
      setSuccessId(newId);
    }, 1000);
  };
  if (successId) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Report Submitted!
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Thank you for helping the community. Your report ID is <br />
          <strong className="font-mono text-lg text-slate-900 bg-slate-100 px-3 py-1 rounded-lg mt-2 inline-block">
            {successId}
          </strong>
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/reports/${successId}`)}
            className="w-full bg-[#2D6A4F] text-white py-4 rounded-xl font-bold hover:bg-[#1b4332] transition-colors shadow-md">
            
            View Report Details
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors">
            
            Return Home
          </button>
        </div>
      </motion.div>);

  }
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Report a Stray
        </h1>
        <p className="text-slate-600 text-lg">
          Your report helps barangay officials locate and assist animals in
          need.
        </p>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
          {/* Section 1: Photo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">Upload Photo</h2>
            </div>

            <div>
              {/* Photo preview */}
              {photoUrl &&
              <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 group border-2 border-transparent hover:border-white/20 transition-all">
                  <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover" />
                
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <span className="bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 border border-white/20">
                      <Camera size={18} /> Change Photo
                    </span>
                  </div>
                  <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                </div>
                </div>
              }

              {/* Upload & Camera buttons */}
              {!photoUrl &&
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload from gallery */}
                  <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer group ${errors.photo ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' : 'border-white/20 hover:border-[#A3E635]/50 hover:bg-white/5'}`}>
                  
                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10">
                      <Upload
                      size={24}
                      className="text-zinc-400 group-hover:text-[#A3E635] transition-colors" />
                    
                    </div>
                    <p className="font-bold text-white text-base mb-1">
                      Upload Photo
                    </p>
                    <p className="text-sm text-zinc-500">
                      From gallery or files
                    </p>
                  </button>

                  {/* Take a picture */}
                  <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer group ${errors.photo ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' : 'border-white/20 hover:border-[#A3E635]/50 hover:bg-white/5'}`}>
                  
                    <div className="w-14 h-14 bg-[#A3E635]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#A3E635]/20">
                      <Camera size={24} className="text-[#A3E635]" />
                    </div>
                    <p className="font-bold text-white text-base mb-1">
                      Take a Picture
                    </p>
                    <p className="text-sm text-zinc-500">Use your camera</p>
                  </button>
                </div>
              }

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg, image/png, image/webp"
                className="hidden" />
              
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg, image/png, image/webp"
                capture="environment"
                className="hidden" />
              

              {errors.photo &&
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                  <AlertCircle size={14} /> {errors.photo}
                </p>
              }
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Animal Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Animal Type
                </label>
                <select
                  value={formData.animal_type}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    animal_type: e.target.value as AnimalType
                  })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 1rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`
                  }}>
                  
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Condition
                </label>
                <select
                  value={formData.condition_tag}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition_tag: e.target.value as ConditionTag
                  })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 1rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`
                  }}>
                  
                  <option value="roaming">Roaming (Normal)</option>
                  <option value="injured">Injured / Sick</option>
                  <option value="aggressive">Aggressive / Dangerous</option>
                  <option value="needs_rescue">Trapped / Needs Rescue</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the animal, its behavior, and exact location details..."
                value={formData.description}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
                }
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${errors.description ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]'}`} />
              
              {errors.description &&
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              }
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h2 className="text-lg font-bold text-slate-900">Location</h2>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <LocationPicker
                  position={position}
                  onChange={handlePositionChange} />
                
              </div>
              {locationWarning && !errors.location &&
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 flex items-start gap-2">
                  <AlertCircle
                  size={16}
                  className="text-amber-500 mt-0.5 shrink-0" />
                
                  <p className="text-amber-700 text-sm font-medium">
                    {locationWarning}
                  </p>
                </div>
              }
              {errors.location &&
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={14} /> {errors.location}
                </p>
              }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Barangay
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="text-slate-400" size={18} />
                  </div>
                  <select
                    value={formData.barangay}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      barangay: e.target.value
                    })
                    }
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:bg-white transition-all appearance-none font-medium cursor-pointer ${errors.barangay ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]'}`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 1rem center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `1.5em 1.5em`
                    }}>
                    
                    <option value="">Select a barangay...</option>
                    {TAGO_BARANGAYS.map((brgy) =>
                    <option key={brgy.name} value={brgy.name}>
                        {brgy.name}
                      </option>
                    )}
                  </select>
                </div>
                {errors.barangay &&
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={14} /> {errors.barangay}
                  </p>
                }
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Your Name{' '}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Leave blank to report anonymously"
                  value={formData.reporter_name}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    reporter_name: e.target.value
                  })
                  }
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] focus:bg-white transition-all" />
                
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E76F51] hover:bg-[#d65d40] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2">
              
              {isSubmitting ?
              <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{' '}
                  Submitting...
                </> :

              'Submit Report'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>);

}