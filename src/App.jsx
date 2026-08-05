import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AppContext'
import logo from './assets/logo_transparent.png'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import AvailableOrders from './pages/AvailableOrders'
import ActiveDelivery from './pages/ActiveDelivery'
import EarningsOverview from './pages/EarningsOverview'
import MockAuthPage from './pages/MockAuthPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import NotificationDrawer from './components/NotificationDrawer'

// Simple route guard

function ProtectedRoute({ children }) {
  const { rider } = useAuth()
  if (!rider) {
    return <Navigate to="/login" replace />
  }
  return children
}

function TransitionLayout({ children, transitionStage }) {
  return (
    <div className="relative">
      <div className={transitionStage === "loading" ? "pointer-events-none select-none opacity-50" : ""}>
        {children}
      </div>

      {transitionStage !== "idle" && (
        <div
          className={`fixed inset-0 z-[9999] bg-[#fff8f6] flex flex-col items-center justify-center transition-opacity duration-300 ease-out ${
            transitionStage === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Radial glow background */}
          <div className="absolute inset-0 onboarding-gradient pointer-events-none" />

          <div className="relative flex flex-col items-center">
            {/* Soft ambient glow */}
            <div className="absolute inset-0 bg-[#ff6b35] blur-3xl opacity-20 rounded-full transform scale-150 animate-pulse" />

            {/* Logo container */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <img
                src={logo}
                alt="Food Genie"
                className="w-full h-full object-contain animate-pulse-soft"
              />
            </div>
          </div>

          {/* Loading dots */}
          <div className="mt-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ab3500] rounded-full animate-bounce" />
            <span className="w-2.5 h-2.5 bg-[#ab3500] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2.5 h-2.5 bg-[#ab3500] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState("idle") // "idle" | "loading" | "fading"
  const timerRef = useRef(null)
  const fadeTimerRef = useRef(null)

  useEffect(() => {
    // Skip transitions for the initial load or initial splash screen navigation to login, and also mock auth popups
    if (location.pathname === '/' || 
        location.pathname.startsWith('/mock-auth') || 
        (location.pathname === '/login' && displayLocation.pathname === '/')) {
      setDisplayLocation(location)
      return
    }

    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("loading")

      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)

      // Hold splash screen for 900ms, then switch route and start fade out
      timerRef.current = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage("fading")

        fadeTimerRef.current = setTimeout(() => {
          setTransitionStage("idle")
        }, 300) // Duration of fade-out animation
      }, 900)
    }
  }, [location, displayLocation])

  return (
    <TransitionLayout transitionStage={transitionStage}>
      <Routes location={displayLocation}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/mock-auth/:provider" element={<MockAuthPage />} />

        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><AvailableOrders /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute><ActiveDelivery /></ProtectedRoute>} />
        <Route path="/earnings" element={<ProtectedRoute><EarningsOverview /></ProtectedRoute>} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NotificationDrawer />
    </TransitionLayout>
  )
}
