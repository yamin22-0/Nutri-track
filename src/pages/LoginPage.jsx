import { useState } from 'react'
import { motion } from 'framer-motion'
import { loginUser } from '../api'
import toast from 'react-hot-toast'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const user = await loginUser(email, password)
      localStorage.setItem('token', user.id)
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('Welcome back!')
      window.location.href = '/dashboard'
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Skeleton loading state
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <div className="w-32 h-4 bg-white/20 rounded animate-pulse mb-4" />
            <div className="w-48 h-12 bg-white/20 rounded animate-pulse mb-4" />
            <div className="w-64 h-16 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8 animate-pulse" />
            <div className="login-card">
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 64px;
          background: var(--color-cream);
        }

        /* ── LEFT: image panel ── */
        .login-left {
          position: relative;
          overflow: hidden;
        }
        .login-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(44,36,25,0.85) 0%, rgba(44,36,25,0.2) 55%, transparent 100%);
        }
        .login-left-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .login-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-sage-light);
          margin-bottom: 1.25rem;
        }
        .login-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--color-sage);
          animation: pulse 2s infinite;
        }
        .login-left-title {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 3.5vw, 3.4rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #F5F0E8;
          margin-bottom: 1rem;
        }
        .login-left-title em {
          font-style: italic;
          color: var(--color-sage);
        }
        .login-left-desc {
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(245,240,232,0.6);
          max-width: 300px;
          margin-bottom: 2rem;
        }
        .login-stats {
          display: flex;
          gap: 2rem;
        }
        .login-stat-num {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #F5F0E8;
          letter-spacing: -0.03em;
        }
        .login-stat-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.45);
          margin-top: 0.15rem;
        }

        /* ── RIGHT: form panel ── */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          background: var(--color-cream);
          overflow-y: auto;
        }
        .dark .login-right {
          background: #0f0f0f;
        }
        .login-form-wrap {
          width: 100%;
          max-width: 400px;
        }
        .login-heading {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-bark);
          letter-spacing: -0.03em;
          margin-bottom: 0.4rem;
        }
        .dark .login-heading {
          color: #F5F0E8;
        }
        .login-subheading {
          font-size: 0.875rem;
          font-weight: 300;
          color: var(--color-warm-mid);
          margin-bottom: 2rem;
        }

        /* ── Form card ── */
        .login-card {
          background: #fff;
          border: 1px solid rgba(44,36,25,0.1);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 32px rgba(44,36,25,0.07);
          margin-bottom: 1.25rem;
        }
        .dark .login-card {
          background: #1a1a1a;
          border-color: rgba(255,255,255,0.07);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }
        .login-field {
          margin-bottom: 1.1rem;
        }
        .login-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-warm-mid);
          margin-bottom: 0.45rem;
        }
        .dark .login-label {
          color: #6b7280;
        }
        .login-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1.5px solid rgba(44,36,25,0.13);
          background: var(--color-cream);
          color: var(--color-bark);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          -webkit-appearance: none;
        }
        .login-input::placeholder {
          color: rgba(44,36,25,0.3);
        }
        .login-input:focus {
          border-color: var(--color-moss);
          box-shadow: 0 0 0 3px rgba(59,109,17,0.1);
        }
        .dark .login-input {
          background: #252525;
          border-color: rgba(255,255,255,0.1);
          color: #F5F0E8;
        }
        .dark .login-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .dark .login-input:focus {
          border-color: var(--color-sage);
          box-shadow: 0 0 0 3px rgba(151,196,89,0.12);
        }
        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .login-checkbox {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          border: 1.5px solid rgba(44,36,25,0.2);
          background: var(--color-cream);
          cursor: pointer;
          accent-color: var(--color-moss);
        }
        .dark .login-checkbox {
          background: #252525;
          border-color: rgba(255,255,255,0.15);
          accent-color: var(--color-sage);
        }
        .login-remember-text {
          font-size: 0.8rem;
          color: var(--color-warm-mid);
        }
        .login-forgot {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-moss);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: color 0.2s;
        }
        .login-forgot:hover { color: var(--color-sage); }
        .dark .login-forgot { color: var(--color-sage); }
        .dark .login-forgot:hover { color: var(--color-sage-light); }

        .login-divider {
          border: none;
          border-top: 1px solid rgba(44,36,25,0.08);
          margin: 1.25rem 0;
        }
        .dark .login-divider {
          border-top-color: rgba(255,255,255,0.06);
        }
        .login-submit {
          width: 100%;
          padding: 0.85rem;
          border-radius: 100px;
          border: none;
          background: var(--color-bark);
          color: var(--color-cream);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .login-submit:hover:not(:disabled) {
          background: var(--color-moss);
          transform: translateY(-1px);
        }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .dark .login-submit { background: var(--color-moss); color: #fff; }
        .dark .login-submit:hover:not(:disabled) { background: var(--color-sage); color: #0f0f0f; }

        .login-footer {
          text-align: center;
          font-size: 0.83rem;
          color: var(--color-warm-mid);
        }
        .login-footer-link {
          color: var(--color-moss);
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: inherit;
          transition: color 0.2s;
        }
        .login-footer-link:hover { color: var(--color-sage); }
        .dark .login-footer-link { color: var(--color-sage); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @media (max-width: 900px) {
          .login-page { grid-template-columns: 1fr; }
          .login-left { min-height: 42vh; }
          .login-right { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <div className="login-page">

        {/* ── LEFT: image ── */}
        <motion.div
          className="login-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1400&auto=format&fit=crop"
            alt="People exercising outdoors"
          />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="login-eyebrow">
                <div className="login-eyebrow-dot" />
                Welcome back
              </div>
              <h1 className="login-left-title">
                Good to see<br />
                you <em>again.</em>
              </h1>
              <p className="login-left-desc">
                Your health journey is ongoing. Sign in to pick up right where you left off.
              </p>
              <div className="login-stats">
                {[['12K+', 'Active Users'], ['98%', 'Goal Success'], ['500+', 'Food Items']].map(([v, l]) => (
                  <div key={l}>
                    <div className="login-stat-num">{v}</div>
                    <div className="login-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── RIGHT: form ── */}
        <div className="login-right">
          <motion.div
            className="login-form-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="login-heading">Sign in</h2>
            <p className="login-subheading">Welcome back — enter your details below</p>

            <div className="login-card">
              <form onSubmit={handleSubmit}>

                <div className="login-field">
                  <label className="login-label">Email Address</label>
                  <input
                    className="login-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Password</label>
                  <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="login-row">
                  <label className="login-remember">
                    <input
                      className="login-checkbox"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="login-remember-text">Remember me</span>
                  </label>
                  <button type="button" className="login-forgot">Forgot password?</button>
                </div>

                <hr className="login-divider" />

                <button className="login-submit" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </button>

              </form>
            </div>

            <p className="login-footer">
              Don't have an account?{' '}
              <button className="login-footer-link" onClick={() => (window.location.href = '/register')}>
                Sign up
              </button>
            </p>
          </motion.div>
        </div>

      </div>
    </>
  )
}

export default LoginPage