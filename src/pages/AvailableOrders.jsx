import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useOrders } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

const AREA_COORDINATES = {
  'Jinnah Shaheed Road, Vehari': [30.0440, 72.3440],   // V-Chowk
  'People\'s Colony, Vehari': [30.0415, 72.3540],      // South-East
  'Garrison Park Road, Vehari': [30.0450, 72.3380],    // North-West
  'Sharqi Colony, Vehari': [30.0470, 72.3580],         // North-East
  'Club Road, Vehari': [30.0438, 72.3350]              // West
}

export default function AvailableOrders() {
  const navigate = useNavigate()
  const { rider, toggleOnline, setRider, notifications, setIsNotifOpen } = useAuth()
  const { orders, acceptOrder, skipOrder } = useOrders()

  const [isChangingArea, setIsChangingArea] = useState(false)
  const VEHARI_AREAS = [
    'Jinnah Shaheed Road, Vehari',
    'People\'s Colony, Vehari',
    'Garrison Park Road, Vehari',
    'Sharqi Colony, Vehari',
    'Club Road, Vehari'
  ]

  const ordersMapRef = useRef(null)

  useEffect(() => {
    if (!window.L || !rider || !rider.isOnline) return

    const selectedArea = rider.area || 'Jinnah Shaheed Road, Vehari'
    const centerPoint = AREA_COORDINATES[selectedArea] || [30.0442, 72.3441]
    
    const map = window.L.map('orders-map', {
      zoomControl: false,
      attributionControl: false
    }).setView(centerPoint, 14)
    
    ordersMapRef.current = map

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map)

    const centerIcon = window.L.divIcon({
      html: `<div class="bg-[#ff6b35] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-pulse"><span class="material-symbols-outlined text-[18px]">motorcycle</span></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    window.L.marker(centerPoint, { icon: centerIcon }).addTo(map)
      .bindPopup(`<b>Your Position:</b><br/>${selectedArea}`).openPopup()

    return () => {
      map.remove()
    }
  }, [rider?.isOnline, rider?.area])

  function handleAccept(order) {
    acceptOrder(order)
    navigate('/delivery')
  }

  function handleSkip(orderId) {
    skipOrder(orderId)
  }

  return (
    <div className="bg-[#FFF8F0] font-body-md text-on-background min-h-screen pb-24">

      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin-mobile h-16 bg-surface dark:bg-background shadow-sm">
        <div className="flex items-center gap-4">
          <h1
            className="font-headline-lg-mobile text-headline-lg-mobile font-bold"
            style={{ color: 'rgb(122, 46, 34)' }}
          >
            Food Genie
          </h1>
        </div>
        <button
          onClick={() => setIsNotifOpen(true)}
          className="hover:opacity-80 active:scale-95 transition-transform relative flex items-center justify-center p-2"
          style={{ color: 'rgb(122, 46, 34)' }}
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          {notifications.some(n => n.unread) && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full border border-surface animate-pulse" />
          )}
        </button>
      </header>

      {/* ── Main Content Canvas ──────────────────────────────────────────── */}
      <main className="mt-16 px-margin-mobile py-6 flex flex-col gap-6">

        {/* Online Status Toggle */}
        <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-primary/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${rider.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-label-bold text-label-bold text-primary-container uppercase">
              You are {rider.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="relative inline-flex items-center cursor-pointer" onClick={toggleOnline}>
            <div className={`w-11 h-6 rounded-full transition-colors ${rider.isOnline ? 'bg-primary-container' : 'bg-surface-container-high'}`}>
              <div
                className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all ${rider.isOnline ? 'translate-x-5' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Location Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">location_on</span>
              <div>
                <p className="text-on-surface-variant font-label-md text-label-md leading-none">Your Location</p>
                <p className="font-label-bold text-label-bold mt-1">{rider.area || 'Jinnah Shaheed Road, Vehari'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChangingArea(!isChangingArea)} 
              className="text-primary font-label-bold text-label-bold hover:underline"
            >
              {isChangingArea ? 'Cancel' : 'Change Area'}
            </button>
          </div>
          
          {isChangingArea && (
            <div className="bg-[#fff1ed] p-3 rounded-xl border border-primary/10 flex flex-col gap-2 mt-1 z-10">
              <p className="text-[12px] font-bold text-primary-container">Select Operating Area in Vehari:</p>
              <div className="flex flex-wrap gap-2">
                {VEHARI_AREAS.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      const updated = { ...rider, area }
                      setRider(updated)
                      localStorage.setItem('rider', JSON.stringify(updated))
                      setIsChangingArea(false)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      rider.area === area 
                        ? 'bg-primary-container text-white border-transparent' 
                        : 'bg-white text-on-surface-variant border-[#e1bfb5]/50 hover:bg-[#fff8f0]'
                    }`}
                  >
                    {area.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!rider.isOnline ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-lg border border-primary/10 flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
              <span className="material-symbols-outlined text-3xl">wifi_off</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-[#261814] font-bold">You are Offline</h3>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xs mx-auto">
                Please switch to <strong>Online</strong> to view nearby orders, receive delivery requests, and start earning.
              </p>
            </div>
            <button 
              onClick={toggleOnline}
              className="px-6 py-3 bg-[#ab3500] text-white rounded-full font-label-bold text-label-bold shadow-md hover:bg-[#ff6b35] transition-all active:scale-95 cursor-pointer"
            >
              Go Online
            </button>
          </div>
        ) : (
          <>
            {/* Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Orders Nearby</p>
                <p className="text-headline-md font-headline-md text-primary-container">{orders.length}</p>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Avg. Payout</p>
                <p className="text-headline-md font-headline-md text-primary-container">
                  Rs. {orders.length > 0 ? (orders.reduce((acc, o) => acc + (o.payout || 150), 0) / orders.length).toFixed(0) : 0}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Avg. Dist.</p>
                <p className="text-headline-md font-headline-md text-primary-container">2.5 km</p>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mt-2">
              <h2 className="font-headline-md text-headline-md">Available Now</h2>
              <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Live Updates
              </span>
            </div>

            {/* Order List */}
            <div className="flex flex-col gap-4">
              {orders.length === 0 && (
                <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2 block">inbox</span>
                  <p className="font-label-bold text-label-bold text-on-surface-variant">No orders available right now</p>
                  <p className="text-[13px] text-on-surface-variant mt-1">New orders will appear here automatically</p>
                </div>
              )}

              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-surface-container-lowest rounded-xl shadow-sm ${order.borderClass} p-4 flex flex-col gap-3 group active:scale-[0.98] transition-transform`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-label-bold text-label-bold text-primary-container">#{order.id}</span>
                    <span className="font-headline-md text-headline-md text-tertiary-container font-black">
                      Rs. {(order.payout || 150).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs text-on-surface-variant font-medium">Pickup</p>
                      <p className="text-sm font-semibold truncate mt-0.5">{order.restaurant}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-on-surface-variant font-medium">Dropoff</p>
                      <p className="text-sm font-semibold truncate mt-0.5">{order.customerAddress}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => handleAccept(order)}
                      className="bg-[#ab3500] hover:bg-[#ff6b35] text-white py-3 rounded-lg font-label-bold text-label-bold shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delivery_dining</span>
                      Accept
                    </button>
                    <button
                      id={`btn-skip-${order.id}`}
                      onClick={() => handleSkip(order.id)}
                      className="border border-[#2B2D42] text-[#2B2D42] py-3 rounded-lg font-label-bold text-label-bold active:translate-y-0.5 transition-all hover:bg-slate-100"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))}

              {/* Map View Placeholder - Real Leaflet Map */}
              <div className="mt-4 rounded-2xl overflow-hidden shadow-lg h-56 relative border-4 border-surface-container-highest">
                <div id="orders-map" className="w-full h-full z-0" />
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#261814] shadow-sm border border-primary/10">
                  📍 Live Vehari Map View
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav activeTab="orders" />
    </div>
  )
}
