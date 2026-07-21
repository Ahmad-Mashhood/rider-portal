import React from 'react'
import { useAuth } from '../context/AppContext'
import Icon from './Icon'

export default function NotificationDrawer() {
  const { notifications, isNotifOpen, setIsNotifOpen, markAllRead } = useAuth()

  if (!isNotifOpen) return null

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsNotifOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#FFF8F0] shadow-2xl flex flex-col h-full border-l border-primary/10 animate-fade-in">
          
          {/* Header */}
          <div className="px-6 py-5 bg-[#ff6b35] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Icon name="notifications" filled className="text-white animate-bounce-soft" />
              <h2 className="text-lg font-bold tracking-wide">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-[#ab3500] text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsNotifOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="close" className="text-white" />
            </button>
          </div>

          {/* Action Toolbar */}
          {unreadCount > 0 && (
            <div className="px-6 py-2.5 bg-[#fff1ed] border-b border-[#e1bfb5]/20 flex justify-end">
              <button 
                onClick={markAllRead}
                className="text-xs font-bold text-[#ab3500] hover:text-[#ff6b35] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Icon name="done_all" size={16} />
                Mark all as read
              </button>
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {notifications.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  item.unread 
                    ? 'bg-white border-[#ff6b35]/30 shadow-sm relative overflow-hidden' 
                    : 'bg-white/60 border-[#e1bfb5]/20'
                }`}
              >
                {/* Left accent strip for unread */}
                {item.unread && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#ff6b35]" />
                )}

                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className={`text-sm ${item.unread ? 'font-extrabold text-[#261814]' : 'font-semibold text-[#594139]'}`}>
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-[#8d7168] whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-xs text-[#594139] leading-relaxed">
                  {item.message}
                </p>

                {item.unread && (
                  <div className="mt-2.5 flex justify-end">
                    <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-20">
                <Icon name="notifications_off" size={48} className="text-[#8d7168] mb-2" />
                <p className="text-sm font-semibold text-[#594139]">No notifications yet</p>
                <p className="text-xs text-[#8d7168]">We will notify you when things happen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
