import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from 'lucide-react';
const SIDEBAR_STATE_KEY = 'straypaw:sidebar-collapsed';
export function Layout() {
  const location = useLocation();
  // Don't show footer on map page for full-screen feel
  const isMapPage = location.pathname === '/map';
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STATE_KEY, String(collapsed));
    } catch {

      /* ignore */}
  }, [collapsed]);
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans text-slate-800 selection:bg-green-200 selection:text-green-900">
      <Navbar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)} />
      

      {/* Main content: offset for floating sidebar on lg+ and fixed top bar on mobile */}
      <div
        className={`pt-16 lg:pt-0 min-h-screen flex flex-col transition-[padding] duration-300 ease-out ${collapsed ? 'lg:pl-[80px]' : 'lg:pl-[288px]'}`}>
        
        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut'
              }}
              className="flex-grow flex flex-col">
              
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!isMapPage &&
        <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#E76F51] flex items-center justify-center text-white shadow-sm">
                  <PawPrint size={14} />
                </div>
                <span className="font-semibold text-slate-900 text-sm">
                  StrayPaw Alert
                </span>
              </div>

              <div className="text-center md:text-right text-sm text-slate-500">
                <p>
                  &copy; {new Date().getFullYear()} Tago Municipality, Surigao
                  del Sur.
                </p>
                <p className="mt-0.5">
                  A community-driven monitoring platform.
                </p>
              </div>
            </div>
          </footer>
        }
      </div>
    </div>);

}