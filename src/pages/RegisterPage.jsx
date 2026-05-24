import { useState } from 'react'
import { motion } from 'framer-motion'
import { registerUser } from '../api'
import toast from 'react-hot-toast'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    goal: 'maintain',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const user = await registerUser(formData)
      localStorage.setItem('token', user.id)
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('Account created! Sample meals added.')
      window.location.href = '/dashboard'
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="reg-page">
        <div className="reg-left">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="reg-left-overlay" />
          <div className="reg-left-content">
            <div className="w-32 h-4 bg-white/20 rounded animate-pulse mb-4" />
            <div className="w-48 h-12 bg-white/20 rounded animate-pulse mb-4" />
            <div className="w-64 h-16 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="reg-right">
          <div className="reg-form-wrap">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8 animate-pulse" />
            <div className="reg-card">
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                </div>
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
        .reg-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 64px;
          background: var(--color-cream);
        }

        .reg-left {
          position: relative;
          overflow: hidden;
        }
        .reg-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .reg-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(44,36,25,0.85) 0%, rgba(44,36,25,0.3) 50%, transparent 100%);
        }
        .reg-left-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .reg-eyebrow {
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
        .reg-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--color-sage);
          animation: pulse 2s infinite;
        }
        .reg-left-title {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 3.5vw, 3.4rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #F5F0E8;
          margin-bottom: 1rem;
        }
        .reg-left-title em {
          font-style: italic;
          color: var(--color-sage);
        }
        .reg-left-desc {
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(245,240,232,0.6);
          max-width: 320px;
          margin-bottom: 2rem;
        }
        .reg-stats {
          display: flex;
          gap: 2rem;
        }
        .reg-stat-num {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #F5F0E8;
          letter-spacing: -0.03em;
        }
        .reg-stat-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.45);
          margin-top: 0.15rem;
        }

        .reg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          background: var(--color-cream);
          overflow-y: auto;
        }
        .dark .reg-right {
          background: #0f0f0f;
        }
        .reg-form-wrap {
          width: 100%;
          max-width: 400px;
        }
        .reg-heading {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-bark);
          letter-spacing: -0.03em;
          margin-bottom: 0.4rem;
        }
        .dark .reg-heading {
          color: #F5F0E8;
        }
        .reg-subheading {
          font-size: 0.875rem;
          font-weight: 300;
          color: var(--color-warm-mid);
          margin-bottom: 2rem;
        }

        .reg-card {
          background: #fff;
          border: 1px solid rgba(44,36,25,0.1);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 32px rgba(44,36,25,0.07);
          margin-bottom: 1.25rem;
        }
        .dark .reg-card {
          background: #1a1a1a;
          border-color: rgba(255,255,255,0.07);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }
        .reg-field {
          margin-bottom: 1.1rem;
        }
        .reg-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-warm-mid);
          margin-bottom: 0.45rem;
        }
        .dark .reg-label {
          color: #6b7280;
        }
        .reg-input {
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
        }
        .reg-input::placeholder {
          color: rgba(44,36,25,0.3);
        }
        .reg-input:focus {
          border-color: var(--color-moss);
          box-shadow: 0 0 0 3px rgba(59,109,17,0.1);
        }
        .dark .reg-input {
          background: #252525;
          border-color: rgba(255,255,255,0.1);
          color: #F5F0E8;
        }
        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .reg-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888780' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          cursor: pointer;
        }
        .reg-divider {
          border: none;
          border-top: 1px solid rgba(44,36,25,0.08);
          margin: 1.25rem 0;
        }
        .reg-submit {
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
        .reg-submit:hover:not(:disabled) {
          background: var(--color-moss);
          transform: translateY(-1px);
        }
        .reg-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .dark .reg-submit {
          background: var(--color-moss);
          color: #fff;
        }
        .reg-footer {
          text-align: center;
          font-size: 0.83rem;
          color: var(--color-warm-mid);
        }
        .reg-footer-link {
          color: var(--color-moss);
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: inherit;
          transition: color 0.2s;
        }
        .reg-footer-link:hover {
          color: var(--color-sage);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @media (max-width: 900px) {
          .reg-page { grid-template-columns: 1fr; }
          .reg-left { min-height: 42vh; }
          .reg-right { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-left">
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1400&auto=format&fit=crop"
            alt="Healthy lifestyle"
          />
          <div className="reg-left-overlay" />
          <div className="reg-left-content">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="reg-eyebrow">
                <div className="reg-eyebrow-dot" />
                Your wellness, your journey
              </div>
              <h1 className="reg-left-title">
                Fuel your body.<br />
                <em>Track</em> your goals.
              </h1>
              <p className="reg-left-desc">
                Monitor nutrition, build healthy habits, and reach your fitness goals with personalised insights.
              </p>
              <div className="reg-stats">
                {[['12K+', 'Active Users'], ['98%', 'Goal Success'], ['500+', 'Food Items']].map(([v, l]) => (
                  <div key={l}>
                    <div className="reg-stat-num">{v}</div>
                    <div className="reg-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="reg-right">
          <motion.div
            className="reg-form-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="reg-heading">Create account</h2>
            <p className="reg-subheading">Start your nutrition journey today</p>

            <div className="reg-card">
              <form onSubmit={handleSubmit}>
                <div className="reg-field">
                  <label className="reg-label">Full Name</label>
                  <input className="reg-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>

                <div className="reg-field">
                  <label className="reg-label">Email Address</label>
                  <input className="reg-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>

                <div className="reg-field reg-row">
                  <div>
                    <label className="reg-label">Password</label>
                    <input className="reg-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="reg-label">Confirm</label>
                    <input className="reg-input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                  </div>
                </div>

                <div className="reg-field reg-row">
                  <div>
                    <label className="reg-label">Weight (kg)</label>
                    <input className="reg-input" type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="70" />
                  </div>
                  <div>
                    <label className="reg-label">Height (cm)</label>
                    <input className="reg-input" type="number" name="height" value={formData.height} onChange={handleChange} placeholder="175" />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">Your Goal</label>
                  <select className="reg-input reg-select" name="goal" value={formData.goal} onChange={handleChange}>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Muscle</option>
                  </select>
                </div>

                <hr className="reg-divider" />

                <button className="reg-submit" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating account…
                    </>
                  ) : 'Create Account'}
                </button>
              </form>
            </div>

            <p className="reg-footer">
              Already have an account?{' '}
              <button className="reg-footer-link" onClick={() => (window.location.href = '/login')}>
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage