import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useOrders, useDelivery } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

const AREA_COORDINATES = {
  'Jinnah Shaheed Road, Vehari': [30.0440, 72.3440],   // V-Chowk
  'People\'s Colony, Vehari': [30.0415, 72.3540],      // South-East
  'Garrison Park Road, Vehari': [30.0450, 72.3380],    // North-West
  'Sharqi Colony, Vehari': [30.0470, 72.3580],         // North-East
  'Club Road, Vehari': [30.0438, 72.3350]              // West
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { rider, toggleOnline, logout, setRider, notifications, setIsNotifOpen } = useAuth()
  const { orders } = useOrders()
  const { earnings, totalDeliveries } = useDelivery()

  const [isChangingArea, setIsChangingArea] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState(rider?.name || '')
  const [editPhone, setEditPhone] = useState(rider?.phone || '')

  const VEHARI_AREAS = [
    'Jinnah Shaheed Road, Vehari',
    'People\'s Colony, Vehari',
    'Garrison Park Road, Vehari',
    'Sharqi Colony, Vehari',
    'Club Road, Vehari'
  ]

  const dashboardMapRef = useRef(null)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const handleStartEditProfile = () => {
    setIsEditingProfile(true)
    setEditName(rider?.name || '')
    setEditPhone(rider?.phone || '')
  }

  const handleSaveProfile = () => {
    const updated = { ...rider, name: editName, phone: editPhone }
    setRider(updated)
    localStorage.setItem('rider', JSON.stringify(updated))
    setIsEditingProfile(false)
  }

  // Real Leaflet Map for Dashboard
  useEffect(() => {
    if (!window.L || !rider || !rider.isOnline) return

    const selectedArea = rider.area || 'Jinnah Shaheed Road, Vehari'
    const centerPoint = AREA_COORDINATES[selectedArea] || [30.0442, 72.3441]
    
    const map = window.L.map('dashboard-map', {
      zoomControl: false,
      attributionControl: false
    }).setView(centerPoint, 14)
    
    dashboardMapRef.current = map

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

    return () => {
      map.remove()
    }
  }, [rider?.isOnline, rider?.area])

  return (
    <div className="bg-[#FFF8F0] font-body-md text-on-background min-h-screen pb-24">

      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin-mobile h-16 bg-surface shadow-sm">
        <div className="flex items-center gap-4">
          <h1
            className="font-headline-lg-mobile text-headline-lg-mobile font-bold"
            style={{ color: 'rgb(122, 46, 34)' }}
          >
            Food Genie
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="hover:opacity-80 active:scale-95 transition-transform flex items-center"
            style={{ color: 'rgb(122, 46, 34)' }}
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
          <button
            onClick={() => setIsNotifOpen(true)}
            className="hover:opacity-80 active:scale-95 transition-transform relative flex items-center justify-center p-2"
            style={{ color: 'rgb(122, 46, 34)' }}
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full border border-surface" />
            )}
          </button>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
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

        {/* Rider Profile Card - Now placed at the top! */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-primary/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#ab3500] bg-[#fff1ed] flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              🏍️
            </div>
            <div className="flex-1 min-w-0">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-sm font-bold text-[#261814] focus:ring-1 focus:ring-[#ab3500] outline-none"
                    placeholder="Name"
                    autoFocus
                  />
                  <p className="text-[13px] text-[#594139] px-2.5 py-1 select-none opacity-60">
                    {rider?.email || 'rider@foodgenie.com'}
                  </p>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#fff1ed] border border-[#e1bfb5]/60 rounded-lg px-2.5 py-1 text-xs text-[#8d7168] font-semibold focus:ring-1 focus:ring-[#ab3500] outline-none"
                    placeholder="Phone Number"
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-extrabold text-[#261814] text-lg truncate">{rider?.name || 'Rider Name'}</h2>
                  <p className="text-[13px] text-[#594139] mt-0.5 truncate">{rider?.email || 'rider@foodgenie.com'}</p>
                  <p className="text-[12px] text-[#8d7168] font-semibold mt-1">{rider?.phone || 'No phone number'}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {isEditingProfile ? (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleSaveProfile}
                  className="text-[#2e7d32] hover:bg-green-50 p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                  title="Save Details"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="text-[#b7102a] hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                  title="Cancel"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleStartEditProfile}
                  className="text-[#8d7168] hover:text-[#ab3500] hover:bg-[#fff1ed] p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                  title="Edit Profile"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[#b7102a] hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                  title="Log Out"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            )}
          </div>
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
                <div className="bg-[#fff1ed] p-3 rounded-xl border border-primary/10 flex flex-col gap-2 mt-1 z-10 animate-fade-in">
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

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Orders Nearby</p>
                <p className="text-headline-md font-headline-md text-primary-container">{orders.length}</p>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Today's Earn</p>
                <p className="text-headline-md font-headline-md text-primary-container">${earnings.today.toFixed(0)}</p>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm order-card-border flex flex-col justify-between h-24">
                <p className="text-on-surface-variant font-label-md text-label-md">Deliveries</p>
                <p className="text-headline-md font-headline-md text-primary-container">{totalDeliveries}</p>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mt-2">
              <h2 className="font-headline-md text-headline-md">Quick Access</h2>
              <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Live Updates
              </span>
            </div>

            {/* Action Cards */}
            <div className="flex flex-col gap-4">
              {/* Available Orders Card */}
              <button
                id="btn-available-orders"
                onClick={() => navigate('/orders')}
                className="bg-surface-container-lowest rounded-xl shadow-sm order-card-border p-4 flex items-center gap-4 group active:scale-[0.98] transition-transform w-full text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">delivery_dining</span>
                </div>
                <div className="flex-grow">
                  <p className="font-label-bold text-label-bold">Available Orders</p>
                  <p className="text-on-surface-variant text-[13px]">{orders.length} orders waiting near you</p>
                </div>
                <div className="flex items-center gap-1 text-primary-container">
                  <span className="font-headline-md text-headline-md font-black">{orders.length}</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </button>

              {/* Active Delivery Card */}
              <button
                id="btn-active-delivery"
                onClick={() => navigate('/delivery')}
                className="bg-surface-container-lowest rounded-xl shadow-sm accent-card-border p-4 flex items-center gap-4 group active:scale-[0.98] transition-transform w-full text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">local_shipping</span>
                </div>
                <div className="flex-grow">
                  <p className="font-label-bold text-label-bold">Active Delivery</p>
                  <p className="text-on-surface-variant text-[13px]">Track your current delivery</p>
                </div>
                <span className="material-symbols-outlined text-sm text-primary-container">chevron_right</span>
              </button>

              {/* Earnings Card */}
              <button
                id="btn-earnings"
                onClick={() => navigate('/earnings')}
                className="bg-surface-container-lowest rounded-xl shadow-sm order-card-border p-4 flex items-center gap-4 group active:scale-[0.98] transition-transform w-full text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div className="flex-grow">
                  <p className="font-label-bold text-label-bold">Earnings</p>
                  <p className="text-on-surface-variant text-[13px]">Today: ${earnings.today.toFixed(2)}</p>
                </div>
                <span className="material-symbols-outlined text-sm text-primary-container">chevron_right</span>
              </button>
            </div>

            {/* Real Leaflet Map View */}
            <div className="mt-4 rounded-2xl overflow-hidden shadow-lg h-56 relative border-4 border-surface-container-highest">
              <div id="dashboard-map" className="w-full h-full z-0" />
              <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#261814] shadow-sm border border-primary/10">
                📍 Live Vehari Map View
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav activeTab="profile" />
    </div>
  )
}
