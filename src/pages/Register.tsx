import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PawPrint,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Check } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const passwordRules = [
  {
    label: 'At least 6 characters',
    valid: formData.password.length >= 6
  },
  {
    label: 'Contains a number',
    valid: /\d/.test(formData.password)
  },
  {
    label: 'Passwords match',
    valid:
    formData.password.length > 0 && formData.password === formData.confirm
  }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );
    setIsSubmitting(false);
    if (result.ok) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-[#E76F51] text-white p-2 rounded-xl shadow-sm">
              <PawPrint size={20} />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              StrayPaw Alert
            </span>
          </Link>
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative z-10">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-[#E76F51] text-white p-3.5 rounded-2xl mb-5 shadow-sm">
              <PawPrint className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-slate-500 mt-2">Join the StrayPaw community</p>
          </div>

          {error &&
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 font-medium border border-red-100">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={formData.username}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value
                })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] focus:bg-white transition-all"
                placeholder="At least 3 characters" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] focus:bg-white transition-all"
                placeholder="you@example.com" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] focus:bg-white transition-all"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Inline password rules */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                {passwordRules.slice(0, 2).map((rule) =>
                <span
                  key={rule.label}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${rule.valid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  
                    <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${rule.valid ? 'bg-emerald-100' : 'bg-slate-100 border border-slate-200'}`}>
                    
                      {rule.valid && <Check size={8} strokeWidth={3} />}
                    </span>
                    {rule.label}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.confirm}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirm: e.target.value
                  })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] focus:bg-white transition-all"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Inline match indicator */}
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${passwordRules[2].valid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passwordRules[2].valid ? 'bg-emerald-100' : 'bg-slate-100 border border-slate-200'}`}>
                    
                    {passwordRules[2].valid &&
                    <Check size={8} strokeWidth={3} />
                    }
                  </span>
                  {passwordRules[2].label}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E76F51] hover:bg-[#d65d40] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2">
              
              {isSubmitting &&
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              }
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#2D6A4F] font-bold hover:underline">
              
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>);

}