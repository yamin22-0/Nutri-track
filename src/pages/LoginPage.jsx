import { useState } from 'react'
import { motion } from 'framer-motion'
import { loginUser } from '../api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [user, setUser]         = useState(null)
  const [showPw, setShowPw]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const u = await loginUser(email, password)
      localStorage.setItem('token', u.id)
      localStorage.setItem('user', JSON.stringify(u))
      if (remember) localStorage.setItem('rememberedEmail', email)
      setUser(u)
      setDone(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────
  if (done) return (
    <>
      <style>{successStyle}</style>
      <div className="auth-success">
        <motion.div className="auth-success-card" initial={{ opacity:0, scale:0.9, y:24 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ duration:0.5, type:'spring' }}>
          <div className="auth-success-icon">👋</div>
          <h1 className="auth-success-title">Welcome back, <em>{user?.name?.split(' ')[0]}</em>!</h1>
          <p className="auth-success-desc">Great to see you again. Your nutrition journey continues — let's check in on your progress.</p>
          <div className="auth-success-stats">
            {[['Goal', user?.goal === 'lose' ? 'Lose Weight' : user?.goal === 'gain' ? 'Gain Muscle' : 'Stay Healthy'], ['Height', `${user?.height || '—'} cm`], ['Weight', `${user?.weight || '—'} kg`]].map(([k,v]) => (
              <div className="auth-success-stat" key={k}>
                <div className="auth-success-stat-val">{v}</div>
                <div className="auth-success-stat-label">{k}</div>
              </div>
            ))}
          </div>
          <button className="auth-success-btn" onClick={() => window.location.href='/dashboard'}>
            Go to Dashboard →
          </button>
          <button className="auth-success-link" onClick={() => window.location.href='/'}>
            Back to Home
          </button>
        </motion.div>
      </div>
    </>
  )

  // ── Login form ──────────────────────────────────
  return (
    <>
      <style>{loginStyle}</style>
      <div className="login-page">

        {/* LEFT panel */}
        <motion.div className="login-left" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}>
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1400&auto=format&fit=crop" alt="Fitness" />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
              <div className="login-eyebrow"><span className="login-eyebrow-dot" />Welcome back</div>
              <h1 className="login-left-title">Good to see<br />you <em>again.</em></h1>
              <p className="login-left-desc">Your health journey is ongoing. Sign in to pick up right where you left off.</p>
              <div className="login-left-stats">
                {[['1M+','Active Users'],['98%','Goal Success'],['50M+','Meals Tracked']].map(([v,l])=>(
                  <div key={l}>
                    <div className="login-stat-num">{v}</div>
                    <div className="login-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT panel */}
        <div className="login-right">
          <motion.div className="login-form-wrap" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>

            {/* Logo */}
            <div className="login-logo" onClick={() => window.location.href='/'}>
              <div className="login-logo-mark">♥</div>
              <span className="login-logo-text">NutriTrack</span>
            </div>

            <h2 className="login-heading">Sign in</h2>
            <p className="login-subheading">Welcome back — enter your details below</p>

            <div className="login-card">
              <form onSubmit={handleSubmit}>

                <div className="login-field">
                  <label className="login-label">Email Address</label>
                  <input className="login-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoFocus />
                </div>

                <div className="login-field">
                  <label className="login-label">Password</label>
                  <div className="login-pw-wrap">
                    <input className="login-input login-pw-input" type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(p=>!p)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="login-row">
                  <label className="login-remember">
                    <input type="checkbox" className="login-checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                    <span className="login-remember-text">Remember me</span>
                  </label>
                  <button type="button" className="login-forgot">Forgot password?</button>
                </div>

                <hr className="login-divider" />

                <button className="login-submit" type="submit" disabled={loading}>
                  {loading ? (
                    <><svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> Signing in…</>
                  ) : 'Sign In'}
                </button>

              </form>
            </div>

            {/* Social divider */}
            <div className="login-or"><span>or continue with</span></div>
            <div className="login-social">
              {[['G','Google'],['A','Apple']].map(([i,l])=>(
                <button key={l} className="login-social-btn" onClick={() => toast('Coming soon!')}>
                  <span className="login-social-icon">{i}</span>{l}
                </button>
              ))}
            </div>

            <p className="login-footer">
              Don't have an account?{' '}
              <button className="login-footer-link" onClick={() => window.location.href='/register'}>Sign up free</button>
            </p>

          </motion.div>
        </div>

      </div>
    </>
  )
}

const loginStyle = `
  .login-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; padding-top:64px; background:var(--color-cream); }
  .dark .login-page { background:#0f0f0f; }

  .login-left { position:relative; overflow:hidden; }
  .login-left img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
  .login-left-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(44,36,25,0.92) 0%, rgba(44,36,25,0.2) 55%, transparent 100%); }
  .login-left-content { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:3rem; }
  .login-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.7rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-sage-light); margin-bottom:1.25rem; }
  .login-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .login-left-title { font-family:var(--font-serif); font-size:clamp(2.4rem,3.5vw,3.4rem); font-weight:900; line-height:1.05; letter-spacing:-0.03em; color:#F5F0E8; margin-bottom:1rem; }
  .login-left-title em { font-style:italic; color:var(--color-sage); }
  .login-left-desc { font-size:0.9rem; font-weight:300; line-height:1.7; color:rgba(245,240,232,0.6); max-width:300px; margin-bottom:2rem; }
  .login-left-stats { display:flex; gap:2rem; }
  .login-stat-num { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:#F5F0E8; letter-spacing:-0.03em; }
  .login-stat-label { font-size:0.65rem; font-weight:400; letter-spacing:0.08em; text-transform:uppercase; color:rgba(245,240,232,0.45); margin-top:0.15rem; }

  .login-right { display:flex; align-items:center; justify-content:center; padding:3rem 2.5rem; background:var(--color-cream); overflow-y:auto; }
  .dark .login-right { background:#0f0f0f; }
  .login-form-wrap { width:100%; max-width:400px; }

  .login-logo { display:flex; align-items:center; gap:0.5rem; cursor:pointer; margin-bottom:2rem; }
  .login-logo-mark { width:28px; height:28px; background:var(--color-moss); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; }
  .login-logo-text { font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.02em; }
  .dark .login-logo-text { color:#F5F0E8; }

  .login-heading { font-family:var(--font-serif); font-size:2rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.4rem; }
  .dark .login-heading { color:#F5F0E8; }
  .login-subheading { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); margin-bottom:1.75rem; }

  .login-card { background:#fff; border:1px solid rgba(44,36,25,0.1); border-radius:20px; padding:1.75rem; box-shadow:0 4px 24px rgba(44,36,25,0.07); margin-bottom:1.25rem; }
  .dark .login-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }

  .login-field { margin-bottom:1.1rem; }
  .login-label { display:block; font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.45rem; }
  .dark .login-label { color:#6b7280; }
  .login-input { width:100%; padding:0.7rem 0.9rem; border-radius:10px; border:1.5px solid rgba(44,36,25,0.12); background:var(--color-cream); color:var(--color-bark); font-family:var(--font-sans); font-size:0.875rem; transition:border-color 0.2s, box-shadow 0.2s; outline:none; }
  .login-input:focus { border-color:var(--color-moss); box-shadow:0 0 0 3px rgba(59,109,17,0.1); }
  .login-input::placeholder { color:rgba(44,36,25,0.3); }
  .dark .login-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .dark .login-input::placeholder { color:rgba(255,255,255,0.2); }
  .dark .login-input:focus { border-color:var(--color-sage); box-shadow:0 0 0 3px rgba(151,196,89,0.12); }

  .login-pw-wrap { position:relative; }
  .login-pw-input { padding-right:2.5rem; }
  .login-pw-toggle { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:0.9rem; line-height:1; padding:0; }

  .login-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
  .login-remember { display:flex; align-items:center; gap:0.5rem; cursor:pointer; }
  .login-checkbox { width:15px; height:15px; border-radius:4px; cursor:pointer; accent-color:var(--color-moss); }
  .dark .login-checkbox { accent-color:var(--color-sage); }
  .login-remember-text { font-size:0.8rem; color:var(--color-warm-mid); }
  .login-forgot { font-size:0.8rem; font-weight:500; color:var(--color-moss); background:none; border:none; cursor:pointer; font-family:var(--font-sans); transition:color 0.2s; }
  .login-forgot:hover { color:var(--color-sage); }
  .dark .login-forgot { color:var(--color-sage); }

  .login-divider { border:none; border-top:1px solid rgba(44,36,25,0.08); margin:1.25rem 0; }
  .dark .login-divider { border-top-color:rgba(255,255,255,0.06); }

  .login-submit { width:100%; padding:0.875rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:0.9rem; font-weight:500; cursor:pointer; transition:background 0.2s, transform 0.15s; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
  .login-submit:hover:not(:disabled) { background:var(--color-moss); transform:translateY(-1px); }
  .login-submit:disabled { opacity:0.65; cursor:not-allowed; }
  .dark .login-submit { background:var(--color-moss); }
  .dark .login-submit:hover:not(:disabled) { background:var(--color-sage); color:#0f0f0f; }

  .login-or { text-align:center; font-size:0.78rem; color:var(--color-warm-mid); margin:1rem 0; position:relative; }
  .login-or::before, .login-or::after { content:''; position:absolute; top:50%; width:38%; height:1px; background:rgba(44,36,25,0.1); }
  .login-or::before { left:0; }
  .login-or::after { right:0; }
  .dark .login-or::before, .dark .login-or::after { background:rgba(255,255,255,0.07); }
  .login-or span { background:var(--color-cream); padding:0 0.75rem; position:relative; z-index:1; }
  .dark .login-or span { background:#0f0f0f; }

  .login-social { display:flex; gap:0.75rem; margin-bottom:1.25rem; }
  .login-social-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.7rem; border-radius:12px; border:1.5px solid rgba(44,36,25,0.12); background:#fff; color:var(--color-bark); font-family:var(--font-sans); font-size:0.85rem; font-weight:500; cursor:pointer; transition:all 0.2s; }
  .login-social-btn:hover { border-color:var(--color-moss); background:var(--color-sage-pale); }
  .dark .login-social-btn { background:#1a1a1a; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .dark .login-social-btn:hover { border-color:var(--color-sage); background:rgba(59,109,17,0.1); }
  .login-social-icon { width:20px; height:20px; border-radius:50%; background:var(--color-bark); color:var(--color-cream); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; }
  .dark .login-social-icon { background:var(--color-sage); color:var(--color-bark); }

  .login-footer { text-align:center; font-size:0.83rem; color:var(--color-warm-mid); }
  .login-footer-link { color:var(--color-moss); font-weight:500; background:none; border:none; cursor:pointer; font-family:var(--font-sans); font-size:inherit; }
  .login-footer-link:hover { color:var(--color-sage); }
  .dark .login-footer-link { color:var(--color-sage); }

  @keyframes spin { to { transform:rotate(360deg); } }
  .spin { animation:spin 0.8s linear infinite; }

  @media (max-width:900px) {
    .login-page { grid-template-columns:1fr; }
    .login-left { min-height:42vh; }
    .login-right { padding:2.5rem 1.5rem; }
  }
`

const successStyle = `
  .auth-success { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--color-cream); padding:2rem; }
  .dark .auth-success { background:#0f0f0f; }
  .auth-success-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:28px; padding:3rem 2.5rem; max-width:460px; width:100%; text-align:center; box-shadow:0 24px 64px rgba(44,36,25,0.1); }
  .dark .auth-success-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .auth-success-icon { font-size:3.5rem; margin-bottom:1.25rem; }
  .auth-success-title { font-family:var(--font-serif); font-size:2rem; font-weight:900; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.75rem; }
  .dark .auth-success-title { color:#F5F0E8; }
  .auth-success-title em { font-style:italic; color:var(--color-moss); }
  .dark .auth-success-title em { color:var(--color-sage); }
  .auth-success-desc { font-size:0.9rem; font-weight:300; color:var(--color-warm-mid); line-height:1.7; margin-bottom:2rem; }
  .auth-success-stats { display:flex; justify-content:center; gap:2rem; padding:1.25rem; background:var(--color-sage-pale); border-radius:16px; margin-bottom:2rem; }
  .dark .auth-success-stats { background:rgba(59,109,17,0.08); }
  .auth-success-stat-val { font-family:var(--font-serif); font-size:1rem; font-weight:700; color:var(--color-bark); }
  .dark .auth-success-stat-val { color:#F5F0E8; }
  .auth-success-stat-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-warm-mid); margin-top:2px; }
  .auth-success-btn { width:100%; padding:0.95rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:1rem; font-weight:500; cursor:pointer; margin-bottom:0.75rem; transition:background 0.2s, transform 0.15s; }
  .auth-success-btn:hover { background:var(--color-moss); transform:translateY(-2px); }
  .dark .auth-success-btn { background:var(--color-moss); }
  .auth-success-link { background:none; border:none; color:var(--color-warm-mid); font-family:var(--font-sans); font-size:0.85rem; cursor:pointer; transition:color 0.2s; }
  .auth-success-link:hover { color:var(--color-bark); }
  .dark .auth-success-link:hover { color:#F5F0E8; }
`