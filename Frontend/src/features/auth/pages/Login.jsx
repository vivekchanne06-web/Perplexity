import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'
import { useSelector } from 'react-redux'
import PerplexityLogo from '../../../assets/perplexity-ai-icon.webp'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = useSelector(state => state.auth.user)
  const error = useSelector(state => state.auth.error)

  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  // If user is already logged in, redirect
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      return
    }

    setIsSubmitting(true)
    const isSuccess = await handleLogin({ email, password })
    setIsSubmitting(false)

    if (isSuccess) {
      navigate('/')
    }
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
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5 text-sm sm:text-base disabled:opacity-50"
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Password
                </label>

              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-black/5 text-sm sm:text-base disabled:opacity-50"
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !password.trim()}
              className="w-full rounded-lg bg-black text-white px-4 py-3 font-semibold transition hover:bg-gray-900 active:scale-95 mt-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>

          </div>

          {/* Social Login Buttons */}

        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-black hover:text-gray-700 transition"
          >
            Create one
          </Link>
        </p>

        {/* Terms & Privacy */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="hover:text-gray-700 transition font-medium">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="hover:text-gray-700 transition font-medium">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default Login
