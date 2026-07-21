import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_transparent.png'

export default function SplashPage() {
  const navigate  = useNavigate()
  const screenRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (screenRef.current) screenRef.current.classList.add('fade-out')
      setTimeout(() => navigate('/login'), 800)
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div
      id="splash-screen"
      ref={screenRef}
      className="fixed inset-0 z-[100] bg-[#FFF8F0] flex flex-col items-center justify-center"
    >
      {/* Radial glow background */}
      <div className="absolute inset-0 onboarding-gradient pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Soft ambient glow */}
        <div className="absolute inset-0 bg-[#ff6b35] blur-3xl opacity-20 rounded-full transform scale-150 animate-pulse" />

        {/* Logo container without background/shadow */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
          <img
            src={logo}
            alt="Food Genie"
            className="w-full h-full object-contain animate-pulse-soft"
          />
        </div>
      </div>

      {/* Loading dots */}
      <div className="mt-10 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#ab3500] rounded-full animate-bounce" />
        <span className="w-2.5 h-2.5 bg-[#ab3500] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  )
}
