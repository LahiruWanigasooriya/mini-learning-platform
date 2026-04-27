import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api/services';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      // Assuming response.data contains the array
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'WARNING': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-200 relative group"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
      >
        <Bell className={`h-5 w-5 ${isOpen ? 'text-[var(--accent)]' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[var(--bg-primary)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up border border-[var(--glass-border)]">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold uppercase tracking-wider hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-5 w-5 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" style={{ color: 'var(--text-primary)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>All caught up!</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && handleMarkAsRead(n.id)}
                    className={`p-4 transition-colors cursor-pointer group/item relative ${!n.read ? 'bg-[var(--accent-soft)]/30' : 'hover:bg-[var(--bg-secondary)]'}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-bold truncate ${!n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                            {n.title}
                          </p>
                          <button
                            onClick={(e) => handleDelete(n.id, e)}
                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-100 hover:text-red-500 rounded transition-all"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-[11px] leading-relaxed mt-0.5 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
                          {n.message}
                        </p>
                        <p className="text-[9px] mt-1.5 uppercase font-medium" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
              <button className="w-full py-1.5 text-[10px] font-bold text-center uppercase tracking-widest hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                View All Activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
