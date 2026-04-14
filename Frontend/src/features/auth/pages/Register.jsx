import React, { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth.js'
import PerplexityLogo from '../../../assets/perplexity-ai-icon.webp'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)
  const { handleRegister, handleResendVerificationEmail } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setResendMessage('')
    setResendError('')

    const payload = { username, email, password }
    const response = await handleRegister(payload)

    if (response?.success) {
      setRegisteredEmail(email)
    }
  }

  const handleResendEmail = async () => {
    if (!registeredEmail) {
      return
    }

    setResendMessage('')
    setResendError('')
    setResendLoading(true)

    const success = await handleResendVerificationEmail({ email: registeredEmail })

    if (success) {
      setResendMessage('Verification email sent. Please check your inbox.')
    } else {
      setResendError('Failed to resend verification email. Please try again.')
    }

    setResendLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-600">Creating your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center overflow-hidden">
              <img src={PerplexityLogo} alt="Perplexity" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-black">Perplexity</h1>
              <p className="text-xs text-gray-500">GENERATIVE AI</p>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Create Account</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign up to get started with Perplexity AI</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="john_doe"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5 text-sm sm:text-base"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5 text-sm sm:text-base"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5 text-sm sm:text-base"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black text-white px-4 py-3 font-semibold transition hover:bg-gray-900 active:scale-95 mt-2 text-sm sm:text-base"
            >
              Create Account
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs sm:text-sm text-red-600 font-medium">Error</p>
              <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Verification Email Section */}
          {registeredEmail && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm0 3a1 1 0 000 2h6a1 1 0 000-2H8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Verify your email</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    We've sent a verification email to <span className="font-semibold text-gray-900">{registeredEmail}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Didn't receive it? Check your spam folder or resend below.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Resend Verification Email'
                )}
              </button>

              {/* Resend Success Message */}
              {resendMessage && (
                <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <p className="text-xs sm:text-sm text-emerald-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {resendMessage}
                  </p>
                </div>
              )}

              {/* Resend Error Message */}
              {resendError && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <p className="text-xs sm:text-sm text-red-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {resendError}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-black hover:text-gray-700 transition"
          >
            Login here
          </Link>
        </p>

        {/* Terms & Privacy */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="hover:text-gray-700 transition font-medium">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="hover:text-gray-700 transition font-medium">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default Register