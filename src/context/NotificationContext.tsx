import React, { useEffect, useState, createContext, useContext } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'created_at' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clear: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    api.get<Notification[]>('/notifications')
      .then(setNotifications)
      .catch(() => { /* ignore */ });
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = async (n: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    try {
      const created = await api.post<Notification>('/notifications', n);
      setNotifications((prev) => [created, ...prev]);
    } catch { /* ignore */ }
  };

  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`, {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = async () => {
    await api.patch('/notifications/read-all', {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clear = async () => {
    await api.delete('/notifications');
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
