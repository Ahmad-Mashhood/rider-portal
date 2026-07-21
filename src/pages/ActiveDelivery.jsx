import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders, useDelivery, useAuth } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

// Delivery status machine — matches Stitch export visual tracker
const STATUS_STEPS = [
  { key: 'accepted',   label: 'Accepted',   icon: 'receipt_long' },
  { key: 'picked_up',  label: 'Picked Up',  icon: 'check' },
  { key: 'on_the_way', label: 'On the Way', icon: 'delivery_dining' },
  { key: 'delivered',  label: 'Delivered',  icon: 'flag' },
]

const ROUTE_COORDINATES = [
  [30.0450, 72.3381], // Start: Burger Genie Central (Club Road / Garrison Park)
  [30.0447, 72.3381], // Moving south on Club Road
  [30.0444, 72.3381],
  [30.0442, 72.3381], // Junction of Club Rd & Multan Rd
  [30.0442, 72.3400], // Turning East on Jinnah Shaheed Rd
  [30.0442, 72.3420],
  [30.0442, 72.3441], // V-Chowk
  [30.0442, 72.3460],
  [30.0442, 72.3480],
  [30.0442, 72.3500],
  [30.0442, 72.3520],
  [30.0442, 72.3540], // Turn south at People's Colony Rd
  [30.0435, 72.3540], // Going south on People's Colony Rd
  [30.0430, 72.3540],
  [30.0425, 72.3540],
  [30.0415, 72.3540]  // End: James Wilson (Customer)
]

function getButtonLabel(status) {
  switch (status) {
    case 'accepted':   return 'Confirm Pickup'
    case 'picked_up':  return 'Start Delivery'
    case 'on_the_way': return 'Mark as Delivered'
    case 'delivered':  return '✓ Delivered!'
    default:           return 'Next Step'
  }
}

export default function ActiveDelivery() {
  const navigate = useNavigate()
  const { currentOrder, clearCurrentOrder } = useOrders()
  const { deliveryStatus, advanceStatus, completeDelivery, resetStatus } = useDelivery()
  const { rider, toggleOnline, notifications, setIsNotifOpen } = useAuth()

  const [processingDelivered, setProcessingDelivered] = useState(false)
  const [currentRouteStepIdx, setCurrentRouteStepIdx] = useState(0)

  const mapRef = useRef(null)
  const markerRef = useRef(null)

  // Initialize Map
  useEffect(() => {
    if (!window.L || !document.getElementById('delivery-map')) return

    const startPoint = ROUTE_COORDINATES[0]
    
    const map = window.L.map('delivery-map', {
      zoomControl: false,
      attributionControl: false
    }).setView(startPoint, 14)
    
    mapRef.current = map

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map)

    // Pins using beautiful L.divIcon matching the Stitch design system
    const restaurantIcon = window.L.divIcon({
      html: `<div class="bg-[#ff6b35] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">restaurant</span></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    const customerIcon = window.L.divIcon({
      html: `<div class="bg-[#b7102a] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">person_pin_circle</span></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    const riderIcon = window.L.divIcon({
      html: `<div class="bg-[#ab3500] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-pulse"><span class="material-symbols-outlined text-[20px]">pedal_bike</span></div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    })

    window.L.marker(ROUTE_COORDINATES[0], { icon: restaurantIcon }).addTo(map)
    window.L.marker(ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1], { icon: customerIcon }).addTo(map)

    // Route line
    window.L.polyline(ROUTE_COORDINATES, {
      color: '#ff6b35',
      weight: 6,
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(map)

    // Rider
    const riderMarker = window.L.marker(ROUTE_COORDINATES[0], { icon: riderIcon }).addTo(map)
    markerRef.current = riderMarker

    // Adjust view to fit bounds
    map.fitBounds(ROUTE_COORDINATES, { padding: [50, 50] })

    return () => {
      map.remove()
    }
  }, [rider?.isOnline])

  // Animate Rider Movement when status is 'on_the_way'
  useEffect(() => {
    if (deliveryStatus === 'on_the_way') {
      const interval = setInterval(() => {
        setCurrentRouteStepIdx(prevIdx => {
          const nextIdx = prevIdx + 1
          if (nextIdx < ROUTE_COORDINATES.length) {
            const nextCoord = ROUTE_COORDINATES[nextIdx]
            if (markerRef.current) {
              markerRef.current.setLatLng(nextCoord)
            }
            if (mapRef.current) {
              mapRef.current.panTo(nextCoord)
            }
            return nextIdx
          } else {
            clearInterval(interval)
            return prevIdx
          }
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [deliveryStatus])

  // Reset when status is reset (e.g. back to accepted)
  useEffect(() => {
    if (deliveryStatus === 'accepted') {
      setCurrentRouteStepIdx(0)
      if (markerRef.current) {
        markerRef.current.setLatLng(ROUTE_COORDINATES[0])
      }
      if (mapRef.current) {
        mapRef.current.setView(ROUTE_COORDINATES[0], 14)
      }
    }
  }, [deliveryStatus])

  // Use currentOrder or a sensible fallback so the page always renders
  const order = currentOrder || {
    id: '2489',
    restaurant: 'Burger Genie Central',
    restaurantAddress: '452 Broadway, Manhattan',
    customer: { name: 'James Wilson', address: 'Apt 4B, 112 W 34th St' },
    payout: 15.50,
    estimatedTime: '8 mins',
    distance: '2.4 miles',
  }

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === deliveryStatus)

  function handleActionButton() {
    if (deliveryStatus === 'on_the_way') {
      // Final step: complete delivery
      setProcessingDelivered(true)
      setTimeout(() => {
        completeDelivery({ id: order.id, payout: order.payout })
        clearCurrentOrder()
        resetStatus()
        setProcessingDelivered(false)
        navigate('/orders')
      }, 1500)
    } else if (deliveryStatus !== 'delivered') {
      advanceStatus()
    }
  }

  if (!rider || !rider.isOnline) {
    return (
      <div className="bg-background text-[#2B2D42] font-body-md min-h-screen flex flex-col justify-between">
        {/* Top AppBar */}
        <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin-mobile h-16 bg-surface shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
              Active Delivery
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="flex items-center justify-center p-2 text-on-surface-variant hover:opacity-80 active:scale-95 transition-transform relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b35] rounded-full border border-surface animate-pulse" />
              )}
            </button>
          </div>
        </header>

        {/* Lock Screen */}
        <main className="flex-grow pt-16 pb-20 flex flex-col items-center justify-center px-6">
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-lg border border-primary/10 flex flex-col items-center justify-center py-16 gap-4 w-full max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
              <span className="material-symbols-outlined text-3xl">wifi_off</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-[#261814] font-bold">You are Offline</h3>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xs mx-auto">
                Please switch to <strong>Online</strong> on the dashboard to view and complete deliveries.
              </p>
            </div>
            <button 
              onClick={toggleOnline}
              className="px-6 py-3 bg-[#ab3500] text-white rounded-full font-label-bold text-label-bold shadow-md hover:bg-[#ff6b35] transition-all active:scale-95 cursor-pointer"
            >
              Go Online
            </button>
          </div>
        </main>

        <BottomNav activeTab="delivery" />
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-hidden">

      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin-mobile h-16 bg-surface shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
            Active Delivery
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="flex items-center justify-center p-2 text-on-surface-variant hover:opacity-80 active:scale-95 transition-transform relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b35] rounded-full border border-surface animate-pulse" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-16 pb-20 relative flex flex-col h-screen">

        {/* ── Map Section (Top 50%) ──────────────────────────────────────── */}
        <section className="h-1/2 w-full relative bg-surface-container-high overflow-hidden">
          {/* Leaflet Map Div container */}
          <div id="delivery-map" className="w-full h-full z-0" />
        </section>

        {/* ── Delivery Info Card (Bottom Sheet) ─────────────────────────── */}
        <section className="h-1/2 w-full bg-surface-container-lowest rounded-t-[32px] shadow-[0_-8px_24px_rgba(43,45,66,0.08)] z-20 flex flex-col px-margin-mobile py-6 overflow-y-auto border-t border-outline-variant">

          {/* Pull Handle */}
          <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-6" />

          {/* Header Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Order #{order.id}</h2>
              <p className="font-body-md text-on-surface-variant">Estimated Delivery</p>
            </div>
            <div className="text-right">
              <div className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-container font-black">
                {order.estimatedTime || '8 mins'}
              </div>
              <div className="font-label-bold text-label-bold text-tertiary">
                {order.distance || '2.4 miles away'}
              </div>
            </div>
          </div>

          {/* Status Tracker — 4-step version */}
          <div className="relative flex justify-between items-center mb-8 px-2">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-surface-variant z-0" />
            {/* Filled progress line */}
            <div
              className="absolute top-4 left-0 h-[2px] bg-primary-container z-0 transition-all duration-500"
              style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIdx
              const isCurrent = idx === currentStepIdx
              const isPending = idx > currentStepIdx
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-1">
                  <div
                    className={`rounded-full flex items-center justify-center shadow-md transition-all border-2 border-white ${
                      isCurrent
                        ? 'w-10 h-10 bg-primary-container text-on-primary-container pulsing-status'
                        : isDone
                        ? 'w-8 h-8 bg-primary-container text-on-primary-container'
                        : 'w-8 h-8 bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${isCurrent ? 'text-base' : 'text-sm'}`}
                      style={isCurrent || isDone ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {isDone ? 'check' : step.icon}
                    </span>
                  </div>
                  <span
                    className={`font-label-md text-label-md ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isDone
                        ? 'text-on-surface font-bold'
                        : 'text-on-surface-variant'
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Delivery Details Grid */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* Restaurant */}
            <div className="bg-surface-container p-4 rounded-xl flex items-center gap-4 border-l-4 border-primary-container">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGBt_SNvzjOir_DrIiYa-s0xNegjaBzHiMp17lm8-VshQahQjqzwrEYEszg7yQ7LW38IipQJKdD4YZltw55AGB__3hoTdLhbxMMNEvYoihvyqGpHmHf2DAS_JtFyS7K68e6HeBDgSOpRXf1W-cwGIx_yF74rCG-6BZQP1MCeXMjxp8cBkaMzHOkcZo6P4EKxhJrB9BTcoe19Vr3JAONiyA3REE7dOWkhlEjdRJyfKdaRt-w-VcCM7iwjQC887Rmu_RrmI6pX9BqSO0"
                  alt="Restaurant food"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-label-bold text-label-bold text-on-surface">{order.restaurant}</h3>
                <p className="text-xs text-on-surface-variant truncate">{order.restaurantAddress}</p>
              </div>
              <div className="flex items-center text-primary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {currentStepIdx >= 1 ? 'check_circle' : 'pending'}
                </span>
                <span className="text-[10px] font-bold ml-1">{currentStepIdx >= 1 ? 'PICKED UP' : 'PENDING'}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-surface-container p-4 rounded-xl flex items-center gap-4 border-l-4 border-secondary">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo7pK9TEDfSu_ONvPHkqtSCZBSP0-NkaWekOmr0ipOfd7gtwVQd4odZZ5JsiwsPLcJCDoYfdjEhxbu1s_9vC1nfAn6UFP3MXFQxFjERAkCUYPMjOQuv2pFz_tLMJbwTjz2_7FJTPSh48uPTs0Q4NDX3C1gLS9QyNRX8AD2zZH3fdnXVKgSR3nL-pk2wozMYc87GLKoLWQE0ERO_zr0PrXZfM343Idg846chvRBc5082Dby-NHo9vuACufSOXlc9dziXiekZCWRGVBL"
                  alt="Customer"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-label-bold text-label-bold text-on-surface">{order.customer?.name || 'Customer'}</h3>
                <p className="text-xs text-on-surface-variant truncate">{order.customer?.address || order.customerAddress}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center hover:opacity-80 active:scale-95 transition-all">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center hover:opacity-80 active:scale-95 transition-all">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="btn-delivery-action"
            onClick={handleActionButton}
            disabled={deliveryStatus === 'delivered' || processingDelivered}
            className={`w-full py-4 rounded-xl font-headline-md text-headline-md font-bold shadow-lg active:translate-y-0.5 transition-all mb-4 flex items-center justify-center gap-2 ${
              processingDelivered
                ? 'bg-surface-container text-on-surface-variant opacity-80'
                : deliveryStatus === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-primary-container text-on-primary-container'
            }`}
          >
            {processingDelivered ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                Processing...
              </>
            ) : (
              getButtonLabel(deliveryStatus)
            )}
          </button>
        </section>
      </main>

      <BottomNav activeTab="delivery" />
    </div>
  )
}
