import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PawPrint,
  AlertTriangle,
  Map as MapIcon,
  ShieldCheck,
  Camera,
  ArrowRight,
  Users,
  Bell,
  Lock } from
'lucide-react';
export function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      {/* Top brand bar */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#E76F51] text-white p-2 rounded-xl shadow-sm">
              <PawPrint size={20} />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              StrayPaw Alert
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-5 py-2 rounded-full text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#1b4332] transition-colors shadow-sm">
              
              Create account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-green-50/60 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-orange-50/60 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -24
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut'
              }}>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Serving Tago Municipality, Surigao del Sur
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
                A community alert system for{' '}
                <span className="text-[#2D6A4F]">stray animals</span> in Tago.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                StrayPaw Alert helps residents and barangay officials report,
                map, and coordinate rescue for stray dogs, cats, and other
                animals across all 23 official barangays of Tago.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="#learn-more"
                  className="inline-flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1b4332] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-lg shadow-green-900/20 hover:shadow-green-900/30 hover:-translate-y-0.5">
                  
                  Learn more
                  <ArrowRight size={18} />
                </a>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-sm hover:shadow">
                  
                  Sign in
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Free for residents · Restricted to Tago barangays
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: 'easeOut'
              }}
              className="relative hidden lg:block">
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200"
                  alt="Stray dog being cared for"
                  className="w-full h-full object-cover opacity-90" />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2D6A4F]/40 to-transparent mix-blend-multiply"></div>

                <div
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/60 animate-bounce"
                  style={{
                    animationDuration: '3s'
                  }}>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        New Report
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Just now in Anahao Bag-o
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute bottom-6 right-6 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/60 animate-bounce"
                  style={{
                    animationDuration: '4s',
                    animationDelay: '1s'
                  }}>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#2D6A4F]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Resolved
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Dog rescued in Victoria
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section
        id="learn-more"
        className="bg-white border-y border-slate-100 py-16 sm:py-20 scroll-mt-8">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[#2D6A4F] uppercase tracking-widest mb-3">
              What is StrayPaw Alert?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
              A simple way to keep our streets safer for animals and people.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            {
              icon: Camera,
              title: 'Snap a report',
              body: 'Take a photo, drop a pin, and add a short description in under a minute.',
              tint: 'bg-orange-50 text-[#E76F51]'
            },
            {
              icon: MapIcon,
              title: 'See the live map',
              body: 'Browse every active report across Tago and avoid dangerous areas.',
              tint: 'bg-green-50 text-[#2D6A4F]'
            },
            {
              icon: Bell,
              title: 'Get coordinated help',
              body: 'Barangay officials and admins are notified and can dispatch rescue.',
              tint: 'bg-orange-50 text-[#E76F51]'
            },
            {
              icon: ShieldCheck,
              title: 'Track resolution',
              body: 'Watch each case progress from open to in-progress to resolved.',
              tint: 'bg-green-50 text-[#2D6A4F]'
            }].
            map((feature) =>
            <div
              key={feature.title}
              className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              
                <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feature.tint}`}>
                
                  <feature.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Three simple steps from spotting a stray to seeing it safe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200"></div>

            {[
            {
              icon: Camera,
              title: 'Spot & snap',
              body: 'See a stray? Take a clear photo and note its condition and behavior.',
              tint: 'bg-orange-50 text-[#E76F51]'
            },
            {
              icon: MapIcon,
              title: 'Pin the location',
              body: 'Drop a pin on the map exactly where you saw the animal.',
              tint: 'bg-green-50 text-[#2D6A4F]'
            },
            {
              icon: ShieldCheck,
              title: 'Help arrives',
              body: 'Officials are notified and coordinate the rescue or intervention.',
              tint: 'bg-orange-50 text-[#E76F51]'
            }].
            map((step, i) =>
            <div key={step.title} className="text-center relative z-10">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-5">
                  <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${step.tint}`}>
                  
                    <step.icon size={28} strokeWidth={1.75} />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Step {i + 1}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {step.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-t border-slate-100 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          {[
          {
            icon: Users,
            title: 'Community-driven',
            body: 'Built for and by Tago residents.'
          },
          {
            icon: Lock,
            title: 'Secure accounts',
            body: 'Passwords are hashed — never stored in plain text.'
          },
          {
            icon: MapIcon,
            title: 'Tago-only coverage',
            body: 'Reports are restricted to the 23 official barangays.'
          }].
          map((item) =>
          <div key={item.title} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#2D6A4F] shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#2D6A4F] to-[#1b4332] rounded-3xl px-6 sm:px-10 py-12 sm:py-16 shadow-xl shadow-green-900/20 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#A3E635]/10 blur-2xl"></div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to help your community?
          </h2>
          <p className="relative text-white/80 mb-8 max-w-xl mx-auto">
            Create a free account and start reporting strays in your barangay in
            under a minute.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#E76F51] hover:bg-[#d65d40] text-white px-7 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:-translate-y-0.5">
              
              Create account
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 px-7 py-3.5 rounded-full font-semibold transition-all">
              
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <PawPrint size={16} className="text-[#E76F51]" />
            <span className="font-semibold text-slate-900 text-sm">
              StrayPaw Alert
            </span>
          </div>
          <div className="text-center md:text-right text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Tago Municipality, Surigao del
              Sur. A community-driven monitoring platform.
            </p>
          </div>
        </div>
      </footer>
    </div>);

}