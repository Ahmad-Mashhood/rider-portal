import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Icon from '../components/Icon'

export default function MockAuthPage() {
  const { provider } = useParams()
  const [loading, setLoading] = useState(false)

  const handleSelectAccount = () => {
    setLoading(true)
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'SOCIAL_AUTH_SUCCESS',
            token: `mock_${provider}_token_999`,
            user: {
              name: 'Ahmad Mshhood',
              email: 'ahmadmashhood.bcs018@gmail.com',
              phone: '+92 300 1234567'
            },
          },
          window.location.origin
        )
      }
      window.close()
    }, 1200)
  }

  // Set window title dynamically
  useEffect(() => {
    document.title = provider === 'google' ? 'Sign in - Google Accounts' : 'Log in with Facebook'
  }, [provider])

  if (provider === 'google') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[450px] bg-white border border-slate-200 rounded-lg shadow-md p-8 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-4 border-[#ab3500] border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs font-semibold text-slate-500">Connecting to Food Genie...</p>
            </div>
          )}

          {/* Google Logo */}
          <div className="flex justify-center mb-6">
            <svg className="w-12 h-12" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-[22px] font-normal text-slate-900 font-sans tracking-tight">Sign in with Google</h1>
            <p className="text-sm text-slate-600">to continue to <strong className="text-slate-800">Food Genie (Rider)</strong></p>
          </div>

          {/* Account Chooser */}
          <div className="space-y-3">
            <button
              onClick={handleSelectAccount}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">Ahmad Mshhood</p>
                <p className="text-xs text-slate-500 truncate">ahmadmashhood.bcs018@gmail.com</p>
              </div>
              <Icon name="chevron_right" size={18} className="text-slate-400" />
            </button>

            <button
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border border-transparent rounded-lg text-left transition-colors cursor-not-allowed opacity-50"
              disabled
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                <Icon name="person_add" size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-800">Use another account</p>
            </button>
          </div>

          <div className="mt-12 text-[12px] text-slate-500 leading-normal">
            To continue, Google will share your name, email address, language preference, and profile picture with Food Genie. Before using this app, you can review Food Genie's <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="/terms" target="_blank" className="text-blue-600 hover:underline">Terms of Service</a>.
          </div>
        </div>
      </div>
    )
  }

  // Facebook Layout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-[#1877f2] px-6 py-4 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="font-bold text-lg tracking-tight">facebook</span>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-4 border-[#1877f2] border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs font-semibold text-slate-500">Authorizing...</p>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                FG
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-800">Log in with Facebook</h2>
                <p className="text-xs text-slate-500 mt-0.5">Food Genie (Rider) is requesting access to your account.</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-normal">
                Food Genie will receive: your <strong>public profile</strong> (name, profile picture, age range, gender) and <strong>email address</strong>.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-2 border border-slate-100">
                <Icon name="info" size={16} className="text-slate-400" />
                <span className="text-[11px] text-slate-500">This does not let the app post to Facebook.</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => window.close()}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded text-sm hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectAccount}
                className="px-5 py-2.5 bg-[#1877f2] text-white font-semibold rounded text-sm hover:bg-[#1565c0] transition-colors cursor-pointer"
              >
                Continue as Ahmad
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
