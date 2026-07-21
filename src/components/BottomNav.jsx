import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * Shared bottom navigation bar — matches the Stitch HTML exports exactly.
 * activeTab: 'orders' | 'delivery' | 'earnings' | 'profile'
 */
export default function BottomNav({ activeTab }) {
  const NAV_BG = 'rgb(122, 46, 34)'
  const ACTIVE_BG = 'rgb(249, 124, 74)'

  const tabs = [
    { key: 'orders',   to: '/orders',   icon: 'delivery_dining', label: 'Orders'   },
    { key: 'delivery', to: '/delivery', icon: 'task_alt',         label: 'Delivery' },
    { key: 'earnings', to: '/earnings', icon: 'account_balance_wallet', label: 'Earnings' },
    { key: 'profile',  to: '/dashboard', icon: 'person',          label: 'Profile'  },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 border-t border-outline-variant shadow-lg"
      style={{ backgroundColor: NAV_BG }}
    >
      {tabs.map(({ key, to, icon, label }) => {
        const isActive = activeTab === key
        return (
          <NavLink
            key={key}
            to={to}
            className="flex flex-col items-center justify-center rounded-xl p-2 min-w-[72px] active:translate-y-0.5 transition-all text-white"
            style={isActive ? { backgroundColor: ACTIVE_BG } : {}}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {icon}
            </span>
            <span className="font-label-md text-label-md mt-0.5">{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
