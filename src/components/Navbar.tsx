import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PawPrint,
  Menu,
  X,
  Map as MapIcon,
  PlusCircle,
  List,
  Shield,
  LogIn,
  LogOut,
  Home as HomeIcon,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Users as UsersIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
interface NavbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}
export function Navbar({ collapsed, onToggleCollapsed }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications();
  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  const isActive = (path: string) => location.pathname === path;
  const navLinks = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Map',
    path: '/map',
    icon: MapIcon
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: List
  }];

  if (user && user.role !== 'admin') {
    navLinks.push({
      name: 'My Reports',
      path: '/my-reports',
      icon: ClipboardList
    });
  }
  if (user?.role === 'admin') {
    navLinks.push({
      name: 'Admin',
      path: '/admin',
      icon: Shield
    });
    navLinks.push({
      name: 'Users',
      path: '/admin/users',
      icon: UsersIcon
    });
  }
  const SidebarContent = ({
    onLinkClick,
    isCollapsed,
    showCollapseToggle = false




  }: {onLinkClick?: () => void;isCollapsed: boolean;showCollapseToggle?: boolean;}) =>
  <div className="relative flex flex-col h-full bg-white rounded-3xl shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] overflow-hidden">
      {/* Collapse / expand toggle — sits above the logo */}
      {showCollapseToggle &&
    <div
      className={`pt-4 ${isCollapsed ? 'flex justify-center' : 'flex justify-end px-4'}`}>
      
          <button
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#E76F51] hover:border-[#E76F51]/40 transition-colors">
        
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
    }

      {/* Brand */}
      <div
      className={`pt-4 pb-6 ${isCollapsed ? 'px-0 flex justify-center' : 'px-6'}`}>
      
        <Link
        to="/"
        onClick={onLinkClick}
        className="flex items-center gap-3 group"
        title="StrayPaw Alert">
        
          <div className="bg-[#E76F51] text-white p-2 rounded-xl group-hover:bg-[#d65d40] transition-colors shadow-sm shrink-0">
            <PawPrint size={20} />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed &&
          <motion.span
            key="brand"
            initial={{
              opacity: 0,
              x: -8
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -8
            }}
            transition={{
              duration: 0.15
            }}
            className="font-bold text-xl tracking-tight text-slate-900 whitespace-nowrap">
            
                StrayPaw
              </motion.span>
          }
          </AnimatePresence>
        </Link>
      </div>

      {/* Primary CTA — hidden for admins */}
      {user?.role !== 'admin' &&
    <div
      className={`mb-4 ${isCollapsed ? 'px-0 flex justify-center' : 'px-4'}`}>
      
          <Link
        to="/report"
        onClick={onLinkClick}
        title="Report a Stray"
        className={`flex items-center gap-3 rounded-2xl text-sm font-semibold text-[#E76F51] hover:bg-orange-50 transition-colors ${isCollapsed ? 'w-10 h-10 justify-center' : 'px-4 py-3'}`}>
        
            <PlusCircle size={isCollapsed ? 20 : 18} className="shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed &&
          <motion.span
            key="cta-label"
            initial={{
              opacity: 0,
              x: -8
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -8
            }}
            transition={{
              duration: 0.15
            }}
            className="whitespace-nowrap">
            
                  Report a Stray
                </motion.span>
          }
            </AnimatePresence>
          </Link>
        </div>
    }

      {/* Nav links */}
      <nav
      className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-0' : 'px-4'}`}>
      
        <ul
        className={`space-y-1.5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        
          {navLinks.map((link) => {
          const active = isActive(link.path);
          const Icon = link.icon;
          return (
            <li key={link.path} className={isCollapsed ? '' : 'w-full'}>
                <Link
                to={link.path}
                onClick={onLinkClick}
                title={link.name}
                className={`relative flex items-center rounded-2xl text-sm font-semibold transition-colors ${isCollapsed ? 'w-10 h-10 justify-center' : 'gap-3 px-4 py-3'} ${active ? 'text-[#E76F51]' : 'text-slate-700 hover:bg-slate-50'}`}>
                
                  {active &&
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-2xl bg-orange-50"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32
                  }} />

                }
                  <Icon
                  size={18}
                  className={`relative z-10 shrink-0 ${active ? 'text-[#E76F51]' : 'text-slate-500'}`} />
                
                  <AnimatePresence initial={false}>
                    {!isCollapsed &&
                  <motion.span
                    key={`${link.path}-label`}
                    initial={{
                      opacity: 0,
                      x: -8
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -8
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className="relative z-10 whitespace-nowrap">
                    
                        {link.name}
                      </motion.span>
                  }
                  </AnimatePresence>
                </Link>
              </li>);

        })}
        </ul>
      </nav>

      {/* Bottom utility links */}
      <div
      className={`pt-6 pb-3 space-y-1.5 ${isCollapsed ? 'px-0 flex flex-col items-center' : 'px-4'}`}>
      
        {user && user.role !== 'admin' &&
      <div className="relative">
            <button
          onClick={() => setShowNotifications(!showNotifications)}
          title="Notifications"
          className={`flex items-center rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full gap-3 px-4 py-3'}`}>
          
              <div className="relative shrink-0">
                <Bell size={18} className="text-slate-500" />
                {unreadCount > 0 &&
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            }
              </div>
              <AnimatePresence initial={false}>
                {!isCollapsed &&
            <motion.span
              key="notifications-label"
              initial={{
                opacity: 0,
                x: -8
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -8
              }}
              transition={{
                duration: 0.15
              }}
              className="whitespace-nowrap flex-1 text-left">
              
                    Notifications
                  </motion.span>
            }
              </AnimatePresence>
              {!isCollapsed && unreadCount > 0 &&
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
          }
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications &&
          <>
                  <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}>
            </div>
                  <motion.div
              initial={{
                opacity: 0,
                y: 10,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.95
              }}
              className={`fixed bottom-24 z-[1000] w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${isCollapsed ? 'left-24' : 'left-72'}`}>
              
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 &&
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#2D6A4F] hover:underline font-medium">
                  
                          Mark all as read
                        </button>
                }
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ?
                <div className="divide-y divide-slate-100">
                          {notifications.slice(0, 10).map((n) =>
                  <Link
                    key={n.id}
                    to={`/reports/${n.report_id}`}
                    onClick={() => {
                      markAsRead(n.id);
                      setShowNotifications(false);
                      onLinkClick?.();
                    }}
                    className={`block p-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    
                              <div className="flex gap-3">
                                <div className="mt-0.5 shrink-0">
                                  {n.type === 'status_change' &&
                        <CheckCircle2
                          size={16}
                          className="text-[#2D6A4F]" />

                        }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                          className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                    {n.body}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider">
                                    {new Date(
                            n.created_at
                          ).toLocaleDateString()}
                                  </p>
                                </div>
                                {!n.read &&
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></div>
                      }
                              </div>
                            </Link>
                  )}
                        </div> :

                <div className="p-8 text-center">
                          <Bell
                    size={24}
                    className="mx-auto text-slate-300 mb-2" />
                  
                          <p className="text-sm font-medium text-slate-900">
                            No notifications
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            You're all caught up!
                          </p>
                        </div>
                }
                    </div>
                  </motion.div>
                </>
          }
            </AnimatePresence>
          </div>
      }
        {user ?
      <button
        onClick={() => {
          logout();
          onLinkClick?.();
        }}
        title="Log out"
        className={`flex items-center rounded-2xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full gap-3 px-4 py-3'}`}>
        
            <LogOut size={18} className="text-slate-500 shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed &&
          <motion.span
            key="logout-label"
            initial={{
              opacity: 0,
              x: -8
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -8
            }}
            transition={{
              duration: 0.15
            }}
            className="whitespace-nowrap">
            
                  Log out
                </motion.span>
          }
            </AnimatePresence>
          </button> :

      <Link
        to="/login"
        onClick={onLinkClick}
        title="Sign in"
        className={`flex items-center rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full gap-3 px-4 py-3'}`}>
        
            <LogIn size={18} className="text-slate-500 shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed &&
          <motion.span
            key="signin-label"
            initial={{
              opacity: 0,
              x: -8
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -8
            }}
            transition={{
              duration: 0.15
            }}
            className="whitespace-nowrap">
            
                  Sign in
                </motion.span>
          }
            </AnimatePresence>
          </Link>
      }
      </div>

      {/* Floating user/avatar at the bottom */}
      <div
      className={`flex pb-6 pt-2 ${isCollapsed ? 'justify-center' : 'justify-start px-4'}`}>
      
        {user ?
      isCollapsed ?
      <div
        className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-xs font-bold shadow-[0_8px_20px_-8px_rgba(45,106,79,0.55)]"
        title={`${user.username} · ${user.role === 'admin' ? 'Admin' : 'Resident'}`}>
        
              {user.username.charAt(0).toUpperCase()}
            </div> :

      <div
        className="flex items-center gap-2 bg-slate-100 rounded-full pl-1 pr-4 py-1 shadow-sm border border-slate-200/60"
        title={user.email}>
        
              <div className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[100px] leading-tight">
                  {user.username}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 leading-tight">
                  {user.role === 'admin' ? 'Admin' : 'Resident'}
                </p>
              </div>
            </div> :


      <Link
        to="/login"
        onClick={onLinkClick}
        className="w-11 h-11 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white shadow-[0_8px_20px_-8px_rgba(45,106,79,0.55)] hover:bg-[#1b4332] transition-colors"
        aria-label="Sign in">
        
            <LogIn size={18} />
          </Link>
      }
      </div>
    </div>;

  return (
    <>
      {/* Desktop floating sidebar */}
      <motion.aside
        animate={{
          width: collapsed ? 56 : 256
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 30
        }}
        className="hidden lg:block fixed top-4 left-4 bottom-4 z-40">
        
        <SidebarContent isCollapsed={collapsed} showCollapseToggle />
      </motion.aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-[#E76F51] text-white p-1.5 rounded-xl shadow-sm">
            <PawPrint size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            StrayPaw
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user?.role !== 'admin' &&
          <Link
            to="/report"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E76F51] text-white hover:bg-[#d65d40] transition-colors shadow-sm"
            aria-label="Report a stray">
            
              <PlusCircle size={18} />
            </Link>
          }
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu">
            
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] lg:hidden" />
          
            <motion.aside
            initial={{
              x: '-110%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-110%'
            }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 220
            }}
            className="fixed top-4 left-4 bottom-4 w-72 max-w-[85vw] z-[70] lg:hidden">
            
              <div className="relative h-full">
                <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 z-20 p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close navigation menu">
                
                  <X size={20} />
                </button>
                <SidebarContent
                isCollapsed={false}
                onLinkClick={() => setIsOpen(false)} />
              
              </div>
            </motion.aside>
          </>
        }
      </AnimatePresence>
    </>);

}