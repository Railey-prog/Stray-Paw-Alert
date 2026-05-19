import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(username, password);
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

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
              Welcome back
            </h2>
            <p className="text-slate-500 mt-2">
              Sign in to your StrayPaw account
            </p>
          </div>

          {error &&
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 font-medium border border-red-100">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] focus:bg-white transition-all"
                placeholder="e.g. juandelacruz" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] focus:bg-white transition-all"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 hover:shadow-green-900/30 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
              
              {isSubmitting &&
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              }
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#E76F51] font-bold hover:underline">
              
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </div>);

}