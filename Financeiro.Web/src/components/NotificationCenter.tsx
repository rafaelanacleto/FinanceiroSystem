import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Bell, BellRing, Check, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string; // 'Alert' | 'Success' | 'Info'
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get<Notification[]>('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-update every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const displayedNotifications = activeTab === 'all' ? notifications : unreadNotifications;

  const markAsRead = async (id: string) => {
    try {
      await api.put('/notifications/read', [id]);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = unreadNotifications.map((n) => n.id);
    if (unreadIds.length === 0) return;
    try {
      await api.put('/notifications/read', unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case 'Info':
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white dark:bg-slate-800';
    switch (type) {
      case 'Alert':
        return 'bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-500';
      case 'Success':
        return 'bg-emerald-50/50 dark:bg-emerald-950/10 border-l-4 border-emerald-500';
      case 'Info':
      default:
        return 'bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-blue-500';
    }
  };

  const formatNotificationTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center cursor-pointer"
        aria-label="Notificações"
      >
        {unreadNotifications.length > 0 ? (
          <>
            <BellRing className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md shadow-red-200">
              {unreadNotifications.length}
            </span>
          </>
        ) : (
          <Bell className="w-6 h-6" />
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-none z-50 overflow-hidden transform origin-top-right transition-all duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Notificações
              {unreadNotifications.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  {unreadNotifications.length} novas
                </span>
              )}
            </h3>
            {unreadNotifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Ler todas
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Não lidas ({unreadNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Todas ({notifications.length})
            </button>
          </div>

          {/* List Area */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-medium">Nenhuma notificação por aqui.</p>
              </div>
            ) : (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-all duration-200 flex gap-3 ${getNotificationBg(
                    notification.type,
                    notification.isRead
                  )}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <p className={`text-sm font-bold truncate ${
                        notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      notification.isRead ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {notification.message}
                    </p>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-[10px] font-black text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
