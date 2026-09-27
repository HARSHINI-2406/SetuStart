import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../services/api';
import { Notification } from '../types';
import { Bell, CheckCircle2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    notificationsApi.getAll().then(setNotifications).catch(console.error);
  }, []);

  const handleMarkRead = async (id: number) => {
    await notificationsApi.markRead(id);
    notificationsApi.getAll().then(setNotifications);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">System Alerts</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">In-App Notifications</h1>
          <p className="text-xs text-slate-600">Updates regarding evaluations, milestone approvals, and payment SLA alerts.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="gov-panel p-8 text-center text-slate-500 text-xs">
            No notifications found.
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-lg gov-panel space-y-1.5 ${!n.is_read ? 'border-l-4 border-l-blue-700 bg-blue-50/20' : 'bg-white opacity-85'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                <span className="text-slate-500 text-[11px] font-mono">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              {!n.is_read && (
                <div className="pt-2 flex justify-end">
                  <button onClick={() => handleMarkRead(n.id)} className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
