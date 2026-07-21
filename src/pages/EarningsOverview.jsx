import React, { useState } from 'react'
import { useDelivery, useAuth } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

const RANGES = ['daily', 'weekly', 'monthly']

function getEarningsForRange(range, earnings) {
  switch (range) {
    case 'daily':   return { label: 'Today',      value: earnings.today }
    case 'weekly':  return { label: 'This Week',   value: earnings.weekly }
    case 'monthly': return { label: 'This Month',  value: earnings.monthly }
    default:        return { label: 'This Week',   value: earnings.weekly }
  }
}

export default function EarningsOverview() {
  const { earnings, completedOrders, totalDeliveries, avgPerOrder } = useDelivery()
  const { notifications, setIsNotifOpen } = useAuth()
  const [activeRange, setActiveRange] = useState('weekly')

  const { label, value } = getEarningsForRange(activeRange, earnings)

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24">

      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin-mobile h-16 bg-surface dark:bg-background shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-primary-fixed-dim">
            Earnings
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="text-primary active:scale-95 transition-transform hover:opacity-80 relative flex items-center justify-center p-2"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full border border-surface animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* ── Main Content Canvas ──────────────────────────────────────────── */}
      <main className="pt-20 px-margin-mobile flex flex-col gap-6">

        {/* Toggle Switcher */}
        <div className="flex bg-surface-container rounded-xl p-1 shadow-sm">
          {RANGES.map(range => (
            <button
              key={range}
              id={`btn-${range}`}
              onClick={() => setActiveRange(range)}
              className={`flex-1 py-2 text-label-md font-label-md transition-all rounded-lg capitalize ${
                activeRange === range
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Card */}
        <section className="earnings-card p-md rounded-xl shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">{label}</p>
            <h2 className="text-on-background font-headline-lg text-headline-lg mt-1">
              ${value.toFixed(2)}
            </h2>
          </div>
          <button className="w-full bg-primary-container text-white font-label-bold text-label-bold py-4 rounded-lg active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            Request Payout
          </button>
        </section>

        {/* Earnings Chart (Bento Style) */}
        <section className="bg-surface rounded-xl p-md shadow-sm border border-outline-variant/30">
          <div className="flex justify-between items-end h-40 gap-2 mb-2">
            {[
              { day: 'MON', h: '40%' },
              { day: 'TUE', h: '65%' },
              { day: 'WED', h: '90%', highlight: true },
              { day: 'THU', h: '55%' },
              { day: 'FRI', h: '75%' },
              { day: 'SAT', h: '30%' },
              { day: 'SUN', h: '20%' },
            ].map(({ day, h, highlight }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    highlight
                      ? 'bg-primary-container shadow-sm'
                      : 'bg-primary-container/20 hover:bg-primary-container'
                  }`}
                  style={{ height: h }}
                />
                <span
                  className={`text-[10px] font-bold ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-label-md text-on-surface-variant font-medium">Daily Performance</p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-md rounded-xl shadow-sm border-l-4 border-primary">
            <p className="text-on-surface-variant text-label-md font-label-md">Total Deliveries</p>
            <p className="text-on-background text-headline-md font-headline-md mt-1">{totalDeliveries}</p>
          </div>
          <div className="bg-surface p-md rounded-xl shadow-sm border-l-4 border-primary">
            <p className="text-on-surface-variant text-label-md font-label-md">Avg. Per Order</p>
            <p className="text-on-background text-headline-md font-headline-md mt-1">${avgPerOrder.toFixed(2)}</p>
          </div>
        </div>

        {/* Recent Activity List */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline-md text-headline-md text-on-background">Recent Deliveries</h3>
            <button className="text-primary font-label-bold text-label-md">View All</button>
          </div>
          <div className="space-y-3">
            {completedOrders.slice(0, 8).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="bg-surface p-md rounded-xl flex items-center justify-between shadow-sm border border-outline-variant/20 active:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">delivery_dining</span>
                  </div>
                  <div>
                    <p className="font-label-bold text-on-background">Order #{item.id}</p>
                    <p className="text-xs text-on-surface-variant">{item.time}</p>
                  </div>
                </div>
                <p className="font-headline-md text-primary">+${item.amount.toFixed(2)}</p>
              </div>
            ))}

            {completedOrders.length === 0 && (
              <div className="bg-surface p-md rounded-xl text-center shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-3xl text-outline block mb-1">history</span>
                <p className="text-on-surface-variant text-label-md">No deliveries yet</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav activeTab="earnings" />
    </div>
  )
}
