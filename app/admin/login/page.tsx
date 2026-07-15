'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type AuthMode = 'signin' | 'forgot' | 'verification'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signin')
  
  // Sign In States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  
  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('')
  
  // Verification States
  const [code, setCode] = useState(['', '', '', ''])
  const [activeOtpEmail, setActiveOtpEmail] = useState('')
  const [timer, setTimer] = useState(60)
  const [resendSuccess, setResendSuccess] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any
    if (mode === 'verification' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [mode, timer])

  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      if (data.requireOtp) {
        setActiveOtpEmail(data.email)
        setTimer(60)
        setResendSuccess('')
        setMode('verification')
      } else {
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!resetEmail) { setError('Please enter your email address.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }
      setActiveOtpEmail(resetEmail)
      setTimer(60)
      setResendSuccess('')
      setMode('verification')
    } catch (err: any) {
      setError(err.message || 'Error sending verification code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerificationSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const enteredCode = code.join('')
    if (enteredCode.length < 4) { setError('Please enter the 4-digit code.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeOtpEmail, otp: enteredCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Incorrect verification code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    if (timer > 0) return
    setError('')
    setResendSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeOtpEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }
      setResendSuccess('Verification code resent successfully!')
      setTimer(60)
      setTimeout(() => setResendSuccess(''), 4000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  function handleCodeChange(index: number, val: string) {
    if (isNaN(Number(val))) return
    const newCode = [...code]
    newCode[index] = val.slice(-1)
    setCode(newCode)
    
    // Auto-focus next input
    if (val && index < 3) {
      const nextInputId = `code-in-${index + 1}`
      const nextInputEl = document.getElementById(nextInputId)
      nextInputEl?.focus()
    }
  }

  return (
    <div className="h-screen flex font-sans bg-white overflow-hidden">

      {/* ── Left panel ── Classic Editorial Light Panel with Newspaper Wash */}
      <div className="animate-[admin-fade-in_0.4s_ease_both] flex-[0_0_50%] relative bg-[#faf8f5] border-r border-[#e7e5e4] flex flex-col justify-center p-14 box-border overflow-hidden">
        {/* Newspaper print visual wash */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&q=80"
          alt="Newspaper print"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] grayscale contrast-[1.15] z-[1] pointer-events-none"
        />

        {/* Center Editorial quotes/brand intro (No ADMIN text logo at top) */}
        <div className="max-w-[440px] z-[2] my-auto">
          {/* Accent-colored brand vertical indicator bar */}
          <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.05s_both] w-9 h-[3px] bg-[#1e40af] mb-7 rounded-full" />
          <h2 className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.1s_both] font-serif text-[34px] font-normal text-[#1c1917] leading-[1.35] m-0 mb-[22px] tracking-[-0.02em]">
            "Freedom of the press is not just important to democracy, it is democracy."
          </h2>
          <p className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.15s_both] text-[#78716c] text-[14.5px] leading-[1.65] m-0">
            Manage and curate with absolute clarity. Access your editorial console to publish, modify, and review articles across the portal.
          </p>
        </div>

        {/* Bottom stats details */}
        <div className="z-[2]">
          <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.2s_both] flex gap-10 pt-7 border-t border-[#e7e5e4]">
            {[{ v: '1,284', l: 'Total Articles' }, { v: '2.4M', l: 'Monthly Readers' }].map((s) => (
              <div key={s.l}>
                <div className="text-[#1c1917] text-[18px] font-bold">{s.v}</div>
                <div className="text-[#78716c] text-[11px] mt-[3px] uppercase tracking-[0.06em]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── Clean White Form Area */}
      <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_both] flex-1 flex items-center justify-center p-12 bg-white box-border">
        <div className="w-full max-w-[360px]">
          
          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <div>
              <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.05s_both] mb-8">
                <h1 className="text-[26px] font-extrabold text-[#1c1917] m-0 tracking-[-0.03em]">
                  Sign In
                </h1>
                <p className="text-[13.5px] text-[#78716c] mt-2 leading-[1.5]">
                  Enter your credentials to access the admin console.
                </p>
              </div>

              {error && (
                <div className="animate-[admin-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-[6px] px-[14px] py-[10px] text-[13px] mb-[18px] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.1s_both] flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="text-[11px] font-bold text-[#1c1917] uppercase tracking-[0.06em]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e] flex">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <input
                      id="login-email" type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@newssite.com"
                      className="w-full border-[1.5px] border-[#e5e7eb] rounded-lg py-2.5 text-[#111] outline-none bg-white box-border transition-all duration-150 ease-in-out font-inherit focus:border-[#1e40af] focus:ring-3 focus:ring-[#1e40af]/6 pl-9 h-[42px] text-[13.5px]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.15s_both] flex flex-col gap-1.5">
                  <label htmlFor="login-password" className="text-[11px] font-bold text-[#1c1917] uppercase tracking-[0.06em]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e] flex">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input
                      id="login-password" type={showPass ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border-[1.5px] border-[#e5e7eb] rounded-lg py-2.5 text-[#111] outline-none bg-white box-border transition-all duration-150 ease-in-out font-inherit focus:border-[#1e40af] focus:ring-3 focus:ring-[#1e40af]/6 pl-9 pr-10 h-[42px] text-[13.5px]"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#a8a29e] flex p-0">
                      {showPass
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {/* Forgot Password Link Below Password Field */}
                  <div className="mt-1 flex justify-start">
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setError('') }}
                      className="bg-transparent border-none p-0 text-[#1e40af] hover:text-[#1d4ed8] text-[12.5px] cursor-pointer underline underline-offset-[3px] transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px]"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit" type="submit" disabled={loading}
                  className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_0.2s_both] bg-[#1e40af] hover:bg-[#1d4ed8] text-white border-none rounded-lg h-[42px] text-[13.5px] font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 mt-3 flex items-center justify-center gap-2 transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(30,64,175,0.25)]"
                >
                  {/* {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>} */}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>


              </form>
            </div>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_both]">
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-[#1c1917] m-0 tracking-[-0.02em]">
                  Reset Password
                </h1>
                <p className="text-[13.5px] text-[#78716c] mt-2 leading-[1.5]">
                  Enter your email address to receive a verification code.
                </p>
              </div>

              {error && (
                <div className="animate-[admin-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-[6px] px-[14px] py-[10px] text-[13px] mb-[18px] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                {/* Email input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="forgot-email" className="text-[11px] font-bold text-[#1c1917] uppercase tracking-[0.06em]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e] flex">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <input
                      id="forgot-email" type="email" value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@newssite.com"
                      className="w-full border-[1.5px] border-[#e5e7eb] rounded-lg py-2.5 text-[#111] outline-none bg-white box-border transition-all duration-150 ease-in-out font-inherit focus:border-[#1e40af] focus:ring-3 focus:ring-[#1e40af]/6 pl-9 h-[42px] text-[13.5px]"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white border-none rounded-lg h-[42px] text-[13.5px] font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 mt-2 flex items-center justify-center gap-2 transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(30,64,175,0.25)]"
                >
                  {/* {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>} */}
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>

                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    onClick={() => { setMode('signin'); setError('') }}
                    className="bg-transparent border-none p-0 text-[#a8a29e] text-[13px] cursor-pointer underline underline-offset-[3px] transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px]"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE: MAIL VERIFICATION */}
          {mode === 'verification' && (
            <div className="animate-[admin-fade-up_0.45s_cubic-bezier(0.16,1,0.3,1)_both]">
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-[#1c1917] m-0 tracking-[-0.02em]">
                  Verify Email
                </h1>
                <p className="text-[13.5px] text-[#78716c] mt-2 leading-[1.5]">
                  We sent a 4-digit code to <span className="text-[#1c1917] font-semibold">{activeOtpEmail}</span>.
                </p>
              </div>

              {error && (
                <div className="animate-[admin-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-[6px] px-[14px] py-[10px] text-[13px] mb-[18px] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {resendSuccess && (
                <div className="animate-[admin-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] rounded-[6px] px-[14px] py-[10px] text-[13px] mb-[18px] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/><path d="M12 2a10 10 0 1 0 10 10"/></svg>
                  {resendSuccess}
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-5">
                {/* Code Inputs */}
                <div className="flex gap-3 justify-center">
                  {code.map((num, idx) => (
                    <input
                      key={idx}
                      id={`code-in-${idx}`}
                      type="text"
                      maxLength={1}
                      value={num}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      className="w-14 h-14 border-[1.5px] border-[#e7e5e4] focus:border-[#1e40af] rounded-lg text-center text-xl font-bold text-[#1c1917] outline-none transition-all duration-150 ease-in-out focus:ring-3 focus:ring-[#1e40af]/6"
                    />
                  ))}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white border-none rounded-lg h-[42px] text-[13.5px] font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 flex items-center justify-center gap-2 transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(30,64,175,0.25)]"
                >
                  {/* {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>} */}
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <div className="text-center flex flex-col gap-2.5">
                  <div className="text-[12.5px] text-[#78716c]">
                    Didn't receive the code?{' '}
                    {timer > 0 ? (
                      <span className="text-[#a8a29e] font-semibold">Resend in {timer}s</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="bg-transparent border-none p-0 text-[#1e40af] font-semibold cursor-pointer underline"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setMode('signin'); setError('') }}
                    className="bg-transparent border-none p-0 text-[#a8a29e] text-[13px] cursor-pointer underline underline-offset-[3px] transition-all duration-150 ease-in-out hover:opacity-[0.88] hover:-translate-y-[1px]"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
