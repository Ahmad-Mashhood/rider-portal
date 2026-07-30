import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AppContext'
import API from '../api'
import { loginRiderWithGoogle, completeRiderOnboarding } from '../api/googleAuth'
import logo from '../assets/logo_transparent.png'
import ForgotPasswordModal from '../components/ForgotPasswordModal'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setRider } = useAuth()

  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Rider Google Onboarding Modal state
  const [onboardingData, setOnboardingData] = useState(null)
  const [onboardPhone, setOnboardPhone] = useState('')
  const [onboardPassword, setOnboardPassword] = useState('')
  const [onboardError, setOnboardError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await loginRiderWithGoogle()
      setLoading(false)
      if (data?.requires_details) {
        setOnboardingData(data)
      } else if (data.token) {
        const riderObj = data.user || { name: 'Rider', email: data.user?.email }
        setRider({
          ...riderObj,
          isOnline: true
        })
        navigate('/dashboard')
      }
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Google login failed')
    }
  }

  const handleCompleteOnboarding = async (e) => {
    e.preventDefault()
    if (!onboardPhone.trim() || !onboardPassword.trim()) {
      setOnboardError('Please enter your phone number and set your password.')
      return
    }
    setLoading(true)
    setOnboardError('')
    try {
      const data = await completeRiderOnboarding(onboardingData.firebaseToken, {
        phone: onboardPhone.trim(),
        password: onboardPassword.trim()
      })
      setLoading(false)
      setOnboardingData(null)
      const riderObj = data.user || { name: 'Rider', email: data.user?.email }
      setRider({
        ...riderObj,
        isOnline: true
      })
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setOnboardError(err.response?.data?.detail || err.message || 'Failed to complete registration.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = tab === 'login'
        ? { email, password }
        : { name, email, phone, password, role: 'rider' }

      const res = await API.post(endpoint, payload)
      const data = res.data
      const riderObj = data.user || data.rider || { name, email, role: 'rider' }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(riderObj))
      localStorage.setItem('rider', JSON.stringify(riderObj))
      
      setRider({
        ...riderObj,
        isOnline: true
      })

      navigate('/dashboard')
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.response?.data?.detail || err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-12 lg:p-0 bg-[#FFF8F0] relative">
      {/* Onboarding Modal for New Google Riders */}
      {onboardingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-[#ab3500]/20 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-[#261814]">Complete Rider Sign Up</h2>
              <p className="text-xs text-[#594139]">Provide your phone and password to finish setup</p>
            </div>

            {/* Google Profile Card */}
            <div className="bg-[#fff1ed] p-4 rounded-2xl border border-[#ab3500]/20 flex items-center gap-4">
              {onboardingData.googleProfile?.photoURL ? (
                <img
                  src={onboardingData.googleProfile.photoURL}
                  alt="Google Profile"
                  className="w-14 h-14 rounded-full border-2 border-[#ab3500] object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#ab3500] text-white font-bold flex items-center justify-center text-xl shadow-sm">
                  {onboardingData.googleProfile?.name?.charAt(0) || 'G'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base text-[#261814] truncate">{onboardingData.googleProfile?.name}</h4>
                <p className="text-xs text-[#594139] truncate">{onboardingData.googleProfile?.email}</p>
                <span className="text-[10px] font-extrabold text-[#ab3500] uppercase tracking-wider">Verified by Google</span>
              </div>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#261814]">Phone Number *</label>
                <input
                  type="text"
                  value={onboardPhone}
                  onChange={(e) => setOnboardPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  required
                  className="w-full px-4 py-3 bg-[#fff1ed] rounded-xl outline-none text-sm text-[#261814] border border-[#ab3500]/20 focus:ring-2 focus:ring-[#ab3500]/20"
                />
              </div>

              {/* Set Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#261814]">Set Password (For manual login) *</label>
                <input
                  type="password"
                  value={onboardPassword}
                  onChange={(e) => setOnboardPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#fff1ed] rounded-xl outline-none text-sm text-[#261814] border border-[#ab3500]/20 focus:ring-2 focus:ring-[#ab3500]/20"
                />
              </div>

              {onboardError && (
                <p className="text-xs font-semibold text-red-600 text-center bg-red-50 p-2 rounded-lg">{onboardError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOnboardingData(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#ab3500] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#ff6b35] transition-all"
                >
                  {loading ? 'Saving...' : 'Finish Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-[#FFF8F0] rounded-[32px] overflow-hidden shadow-2xl lg:h-[800px] border border-primary/10">

        {/* Branding Panel (desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#ff6b35] p-20 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ab3500] rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#b7102a] rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center border border-white/20">
                <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-[32px] font-extrabold text-white tracking-tight">Genie Rider</h1>
            </div>
            <h2 className="text-[32px] font-bold text-white max-w-md leading-tight">
              Deliver magic, earn on your schedule. Drive the flavor home.
            </h2>
          </div>
          <div className="relative z-10 my-4">
            <div className="w-72 h-72 mx-auto rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 bg-white flex items-center justify-center p-6 border border-primary/10">
              <img src={logo} alt="Food Genie Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <p className="text-[18px] text-white/80">Join professional riders delivering with Food Genie in Vehari.</p>
          </div>
        </div>

        {/* Auth Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FFF8F0] p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-8">

            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center border border-primary/10">
                  <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
                </div>
              </div>
              <h3 className="text-[24px] font-bold text-[#261814]">
                {tab === 'login' ? 'Rider Portal — Welcome Back!' : 'Apply as Rider'}
              </h3>
              <p className="text-[16px] text-[#594139] mt-2">
                {tab === 'login' ? 'Enter your details to view available orders.' : 'Fill details to begin your delivery journey.'}
              </p>
            </div>

            {/* Tab toggle */}
            <div className="bg-[#fff1ed] p-1.5 rounded-full flex gap-1 relative border border-primary/10">
              <div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white shadow-sm rounded-full transition-all duration-300 ease-out"
                style={{ left: tab === 'login' ? '6px' : 'calc(50%)' }}
              />
              <button 
                onClick={() => { setTab('login'); setError(''); }}  
                className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors ${tab === 'login' ? 'text-[#ab3500]' : 'text-[#594139]'}`}
              >
                Login
              </button>
              <button 
                onClick={() => { setTab('signup'); setError(''); }} 
                className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors ${tab === 'signup' ? 'text-[#ab3500]' : 'text-[#594139]'}`}
              >
                Register
              </button>
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-[#e1bfb5]/50 rounded-full hover:bg-[#fff1ed] transition-all active:scale-95 cursor-pointer shadow-sm font-semibold text-[#261814] text-sm disabled:opacity-50"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                width="20"
                height="20"
                alt="Google"
              />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#e1bfb5]/30"></div>
              <span className="text-xs text-[#8d7168] font-bold uppercase">or email</span>
              <div className="flex-1 h-px bg-[#e1bfb5]/30"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {tab === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#261814] ml-1">Full Name</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors">
                        person
                      </span>
                      <input 
                        className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50" 
                        placeholder="Alex Rider" 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-[#261814] ml-1">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors">
                      alternate_email
                    </span>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50" 
                      placeholder="rider@foodgenie.com" 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {tab === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#261814] ml-1">Phone Number</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors">
                        phone
                      </span>
                      <input 
                        className="w-full pl-12 pr-4 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50" 
                        placeholder="+92 300 1234567" 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[14px] font-semibold text-[#261814]">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-[12px] font-bold text-[#ab3500] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7168] group-focus-within:text-[#ab3500] transition-colors">
                      lock
                    </span>
                    <input 
                      className="w-full pl-12 pr-12 py-4 bg-[#fff1ed] border-none rounded-xl text-[16px] focus:ring-2 focus:ring-[#ab3500]/20 transition-all placeholder:text-[#8d7168]/50" 
                      placeholder="••••••••" 
                      type={showPw ? 'text' : 'password'} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d7168] hover:text-[#261814] flex items-center">
                      <span className="material-symbols-outlined">
                        {showPw ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#ab3500] text-white rounded-full text-[20px] font-semibold shadow-lg hover:bg-[#ff6b35] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Processing...
                  </>
                ) : (
                  tab === 'login' ? 'Log In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="pt-4 text-center">
              <p className="text-[12px] text-[#8d7168] leading-normal">
                By continuing, you agree to our{' '}
                <Link className="text-[#261814] underline font-bold hover:text-[#ab3500]" to="/terms">Terms of Service</Link> &amp;{' '}
                <Link className="text-[#261814] underline font-bold hover:text-[#ab3500]" to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </main>
  )
}
