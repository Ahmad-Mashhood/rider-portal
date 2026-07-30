import React, { useState } from 'react'
import API from '../api'

export default function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  if (!isOpen) return null

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setInfoMsg('')
    try {
      const res = await API.post('/api/auth/forgot-password', { email: email.trim() })
      setInfoMsg(res.data.message || `Verification code sent to ${email.trim()}. Please check your Gmail inbox.`)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to send verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim()) return
    setLoading(true)
    setError('')
    try {
      await API.post('/api/auth/verify-otp', { email: email.trim(), otp: otp.trim() })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Invalid or expired OTP code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword.trim() || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword.trim()
      })
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setEmail('')
    setOtp('')
    setNewPassword('')
    setError('')
    setInfoMsg('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-[#ab3500]/20 space-y-6 relative text-slate-800">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#ab3500]/15 text-[#ab3500] flex items-center justify-center mx-auto text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-2xl font-extrabold text-[#261814]">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Enter Verification Code'}
            {step === 3 && 'Set New Password'}
            {step === 4 && 'Password Reset Complete!'}
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {step === 1 && 'Enter your registered rider email to receive a 6-digit password reset code.'}
            {step === 2 && `We sent a 6-digit verification code to ${email}`}
            {step === 3 && 'Choose a strong new password for your account.'}
            {step === 4 && 'Your password has been updated. You can now log in with your new credentials.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        {infoMsg && step === 2 && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-200 text-center font-bold">
            {infoMsg}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Gmail Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@email.com"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#ab3500]/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#ab3500] hover:bg-[#ff6b35] text-white rounded-full text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-center text-lg tracking-[0.5em] font-mono font-bold text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#ab3500]/20"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#ab3500] hover:bg-[#ff6b35] text-white rounded-full text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#ab3500]/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#ab3500] hover:bg-[#ff6b35] text-white rounded-full text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <button
              onClick={() => {
                handleClose()
                if (onPasswordResetSuccess) onPasswordResetSuccess()
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
