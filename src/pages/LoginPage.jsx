import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AppContext'
import API from '../api'
import { loginWithGoogle } from '../api/googleAuth'
import logo from '../assets/logo_transparent.png'

const GoogleSVG = () => (
  <svg className="w-5 h-5 animate-pulse-soft" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function LoginPage() {
  const navigate = useNavigate()
  const { setRider } = useAuth()

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'SOCIAL_AUTH_SUCCESS') {
        const { token, user } = event.data
        localStorage.setItem('token', token)
        localStorage.setItem('rider', JSON.stringify(user))
        setRider(user)
        navigate('/dashboard')
      }
    }
    window.addEventListener('message', handleAuthMessage)
    return () => window.removeEventListener('message', handleAuthMessage)
  }, [navigate, setRider])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await loginWithGoogle('rider')
      if (data.user) {
        setRider({
          name: data.user.name || 'Rider',
          email: data.user.email,
          phone: data.user.phone || '',
          isOnline: true
        })
      }
      navigate('/deliveries')
    } catch (err) {
      setError(err.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      handleGoogleLogin()
      return
    }
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    window.open(
      `/mock-auth/${provider}`,
      `Sign in with ${provider}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    )
  }
  
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Handle real API authentication
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
        name: riderObj.name || 'Rider',
        email: riderObj.email || email,
        phone: riderObj.phone || phone || '',
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

  // Handle Demo/Mock Login
  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      const mockRider = {
        name: 'Alex Rider',
        email: 'alex.rider@foodgenie.com',
        phone: '+92 300 9876543',
        isOnline: true
      }
      localStorage.setItem('token', 'mock_rider_token_999')
      localStorage.setItem('rider', JSON.stringify(mockRider))
      setRider(mockRider)
      setLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-12 lg:p-0 bg-[#FFF8F0]">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-[#FFF8F0] rounded-[32px] overflow-hidden shadow-2xl lg:h-[800px] border border-primary/10">

        {/* ── Branding Panel (desktop only) ──────────────────── */}
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
            <p className="text-[18px] text-white/80">Join 10k+ professional riders delivering with Food Genie.</p>
          </div>
        </div>

        {/* ── Auth Panel ─────────────────────────────────────── */}
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

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-[#e1bfb5]/50 rounded-full hover:bg-[#fff1ed] transition-colors active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  width="20"
                  height="20"
                  alt="Google"
                />
                <span className="text-[14px] font-semibold text-slate-800">
                  {loading ? 'Signing in...' : 'Google'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-[#e1bfb5]/50 rounded-full hover:bg-[#fff1ed] transition-colors active:scale-95 cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-[14px] font-semibold text-slate-800">Facebook</span>
              </button>
            </div>

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
    </main>
  )
}
