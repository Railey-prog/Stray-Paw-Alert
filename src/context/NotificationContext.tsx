import React, { useEffect, useState, createContext, useContext } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
const NOTIFICATIONS_KEY = 'straypaw:notifications';
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clear: () => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
export function NotificationProvider({
  children


}: {children: React.ReactNode;}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
      if (raw) {
        setNotifications(JSON.parse(raw));
      }
    } catch {

      /* ignore */}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
    } catch {

      /* ignore */}
  }, [notifications]);
  const userNotifications = user ?
  notifications.filter((n) => n.user_id === user.id) :
  [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;
  const addNotification = (
  n: Omit<Notification, 'id' | 'created_at' | 'read'>) =>
  {
    const newNotif: Notification = {
      ...n,
      id: `n${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  const markAllAsRead = () => {
    if (!user) return;
    setNotifications((prev) =>
    prev.map((n) =>
    n.user_id === user.id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  const clear = () => {
    if (!user) return;
    setNotifications((prev) => prev.filter((n) => n.user_id !== user.id));
  };
  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clear
      }}>
      
      {children}
    </NotificationContext.Provider>);

}
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};