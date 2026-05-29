import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { registerUser } from '../api'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Account',  icon: '👤' },
  { id: 2, label: 'Body',     icon: '📏' },
  { id: 3, label: 'Goals',    icon: '🎯' },
]

const GOALS = [
  { value: 'lose',     label: 'Lose Weight',    icon: '📉', desc: 'Burn fat, feel lighter' },
  { value: 'maintain', label: 'Stay Healthy',   icon: '⚖️',  desc: 'Maintain current weight' },
  { value: 'gain',     label: 'Build Muscle',   icon: '💪', desc: 'Gain strength and mass' },
]

const ACTIVITY = [
  { value: 'sedentary', label: 'Sedentary',    desc: 'Little or no exercise' },
  { value: 'light',     label: 'Light',        desc: '1–3 days / week' },
  { value: 'moderate',  label: 'Moderate',     desc: '3–5 days / week' },
  { value: 'active',    label: 'Active',       desc: '6–7 days / week' },
]

export default function RegisterPage() {
  const [step, setStep]       = useState(1)
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser]       = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    height: '', weight: '', age: '',
    goal: 'maintain', activityLevel: 'moderate',
  })

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }

  function validateStep() {
    if (step === 1) {
      if (!form.name.trim())              { toast.error('Enter your name');          return false }
      if (!form.email.includes('@'))      { toast.error('Enter a valid email');      return false }
      if (form.password.length < 6)       { toast.error('Password min 6 characters'); return false }
      if (form.password !== form.confirm) { toast.error('Passwords do not match');   return false }
    }
    if (step === 2) {
      if (!form.height || !form.weight)   { toast.error('Enter height and weight');  return false }
    }
    return true
  }

  function next() {
    if (!validateStep()) return
    if (step < 3) { setStep(s => s + 1); return }
    handleSubmit()
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const u = await registerUser(form)
      localStorage.setItem('token', u.id)
      localStorage.setItem('user', JSON.stringify(u))
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
          <div className="auth-success-icon">🎉</div>
          <h1 className="auth-success-title">You're in, <em>{user?.name?.split(' ')[0]}</em>!</h1>
          <p className="auth-success-desc">Your NutriTrack account is ready. Start tracking your nutrition and crushing your goals.</p>
          <div className="auth-success-stats">
            {[['Goal', GOALS.find(g=>g.value===form.goal)?.label], ['Activity', form.activityLevel], ['Weight', `${form.weight} kg`]].map(([k,v])=>(
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

  // ── Registration form ───────────────────────────
  return (
    <>
      <style>{regStyle}</style>
      <div className="reg-page">

        {/* LEFT panel */}
        <div className="reg-left">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=80" alt="Healthy food" />
          <div className="reg-left-overlay" />
          <div className="reg-left-content">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
              <div className="reg-eyebrow"><span className="reg-eyebrow-dot" />Start your journey</div>
              <h1 className="reg-left-title">Fuel your body.<br /><em>Track</em> your goals.</h1>
              <p className="reg-left-desc">Join over 1 million people building healthier habits with NutriTrack.</p>
              <div className="reg-left-stats">
                {[['1M+','Active Users'],['50M+','Meals Tracked'],['4.9★','App Rating']].map(([v,l])=>(
                  <div key={l}>
                    <div className="reg-stat-num">{v}</div>
                    <div className="reg-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT panel */}
        <div className="reg-right">
          <motion.div className="reg-form-wrap" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>

            {/* Logo */}
            <div className="reg-logo" onClick={() => window.location.href='/'}>
              <div className="reg-logo-mark">♥</div>
              <span className="reg-logo-text">NutriTrack</span>
            </div>

            {/* Step indicator */}
            <div className="reg-steps">
              {STEPS.map((s, i) => (
                <div key={s.id} className="reg-step-wrap">
                  <div className={`reg-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}>
                    {step > s.id ? '✓' : s.icon}
                  </div>
                  <div className="reg-step-label">{s.label}</div>
                  {i < STEPS.length - 1 && <div className={`reg-step-line ${step > s.id ? 'done' : ''}`} />}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="reg-progress-track">
              <div className="reg-progress-fill" style={{ width: `${((step-1)/2)*100}%` }} />
            </div>

            {/* Step content */}
            <div className="reg-card">
              <AnimatePresence mode="wait">

                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.25 }}>
                    <div className="reg-step-title">Create your account</div>
                    <div className="reg-step-desc">Start with your basic info</div>
                    <div className="reg-field">
                      <label className="reg-label">Full Name</label>
                      <input className="reg-input" type="text" placeholder="Aisha Hassan" value={form.name} onChange={e=>set('name',e.target.value)} autoFocus />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Email Address</label>
                      <input className="reg-input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)} />
                    </div>
                    <div className="reg-row">
                      <div className="reg-field">
                        <label className="reg-label">Password</label>
                        <input className="reg-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>set('password',e.target.value)} />
                      </div>
                      <div className="reg-field">
                        <label className="reg-label">Confirm</label>
                        <input className="reg-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e=>set('confirm',e.target.value)} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.25 }}>
                    <div className="reg-step-title">Your body stats</div>
                    <div className="reg-step-desc">Helps us personalise your goals</div>
                    <div className="reg-row">
                      <div className="reg-field">
                        <label className="reg-label">Height (cm)</label>
                        <input className="reg-input" type="number" placeholder="170" value={form.height} onChange={e=>set('height',e.target.value)} autoFocus />
                      </div>
                      <div className="reg-field">
                        <label className="reg-label">Weight (kg)</label>
                        <input className="reg-input" type="number" placeholder="70" value={form.weight} onChange={e=>set('weight',e.target.value)} />
                      </div>
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Age</label>
                      <input className="reg-input" type="number" placeholder="25" value={form.age} onChange={e=>set('age',e.target.value)} />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Activity Level</label>
                      <div className="reg-option-grid">
                        {ACTIVITY.map(a => (
                          <div key={a.value} className={`reg-option ${form.activityLevel===a.value?'selected':''}`} onClick={() => set('activityLevel', a.value)}>
                            <div className="reg-option-title">{a.label}</div>
                            <div className="reg-option-desc">{a.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.25 }}>
                    <div className="reg-step-title">What's your goal?</div>
                    <div className="reg-step-desc">We'll tailor your plan accordingly</div>
                    <div className="reg-goal-grid">
                      {GOALS.map(g => (
                        <div key={g.value} className={`reg-goal-card ${form.goal===g.value?'selected':''}`} onClick={() => set('goal', g.value)}>
                          <div className="reg-goal-icon">{g.icon}</div>
                          <div className="reg-goal-title">{g.label}</div>
                          <div className="reg-goal-desc">{g.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div className="reg-summary">
                      <div className="reg-summary-title">Your Summary</div>
                      <div className="reg-summary-grid">
                        {[['Name',form.name],['Height',`${form.height} cm`],['Weight',`${form.weight} kg`],['Activity',form.activityLevel]].map(([k,v])=>(
                          <div key={k} className="reg-summary-item">
                            <div className="reg-summary-label">{k}</div>
                            <div className="reg-summary-val">{v||'—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="reg-nav">
              {step > 1 && (
                <button className="reg-back-btn" onClick={() => setStep(s=>s-1)}>← Back</button>
              )}
              <button className="reg-next-btn" onClick={next} disabled={loading} style={{ marginLeft: step===1?'auto':'0' }}>
                {loading ? (
                  <><svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> Creating…</>
                ) : step === 3 ? 'Create Account' : 'Continue →'}
              </button>
            </div>

            <p className="reg-footer">Already have an account? <button className="reg-footer-link" onClick={() => window.location.href='/login'}>Sign in</button></p>

          </motion.div>
        </div>

      </div>
    </>
  )
}

const regStyle = `
  .reg-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; padding-top:64px; background:var(--color-cream); }
  .dark .reg-page { background:#0f0f0f; }

  .reg-left { position:relative; overflow:hidden; }
  .reg-left img { width:100%; height:100%; object-fit:cover; display:block; }
  .reg-left-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(44,36,25,0.92) 0%, rgba(44,36,25,0.3) 55%, transparent 100%); }
  .reg-left-content { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:3rem; }
  .reg-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.7rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-sage-light); margin-bottom:1.25rem; }
  .reg-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .reg-left-title { font-family:var(--font-serif); font-size:clamp(2.2rem,3.5vw,3.2rem); font-weight:900; line-height:1.05; letter-spacing:-0.03em; color:#F5F0E8; margin-bottom:1rem; }
  .reg-left-title em { font-style:italic; color:var(--color-sage); }
  .reg-left-desc { font-size:0.9rem; font-weight:300; line-height:1.7; color:rgba(245,240,232,0.6); max-width:320px; margin-bottom:2rem; }
  .reg-left-stats { display:flex; gap:2rem; }
  .reg-stat-num { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:#F5F0E8; letter-spacing:-0.03em; }
  .reg-stat-label { font-size:0.65rem; font-weight:400; letter-spacing:0.08em; text-transform:uppercase; color:rgba(245,240,232,0.45); margin-top:0.15rem; }

  .reg-right { display:flex; align-items:flex-start; justify-content:center; padding:3rem 2.5rem; background:var(--color-cream); overflow-y:auto; }
  .dark .reg-right { background:#0f0f0f; }
  .reg-form-wrap { width:100%; max-width:440px; padding-top:1rem; }

  .reg-logo { display:flex; align-items:center; gap:0.5rem; cursor:pointer; margin-bottom:2rem; }
  .reg-logo-mark { width:28px; height:28px; background:var(--color-moss); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; }
  .reg-logo-text { font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.02em; }
  .dark .reg-logo-text { color:#F5F0E8; }

  .reg-steps { display:flex; align-items:flex-start; gap:0; margin-bottom:0.75rem; }
  .reg-step-wrap { display:flex; align-items:center; gap:0; flex:1; flex-direction:column; position:relative; }
  .reg-step { width:36px; height:36px; border-radius:50%; border:2px solid rgba(44,36,25,0.15); background:#fff; display:flex; align-items:center; justify-content:center; font-size:0.9rem; color:var(--color-warm-mid); transition:all 0.3s; flex-shrink:0; }
  .dark .reg-step { background:#1a1a1a; border-color:rgba(255,255,255,0.1); }
  .reg-step.active { border-color:var(--color-moss); background:var(--color-moss); color:white; box-shadow:0 0 0 4px rgba(59,109,17,0.15); }
  .reg-step.done { border-color:var(--color-moss); background:var(--color-sage-pale); color:var(--color-moss); font-size:0.8rem; font-weight:700; }
  .dark .reg-step.done { background:rgba(59,109,17,0.15); }
  .reg-step-label { font-size:0.65rem; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; color:var(--color-warm-mid); margin-top:0.4rem; }
  .reg-step-line { position:absolute; top:18px; left:calc(50% + 18px); right:calc(-50% + 18px); height:2px; background:rgba(44,36,25,0.1); z-index:0; }
  .dark .reg-step-line { background:rgba(255,255,255,0.08); }
  .reg-step-line.done { background:var(--color-moss); }

  .reg-progress-track { height:3px; background:rgba(44,36,25,0.08); border-radius:100px; margin-bottom:1.5rem; overflow:hidden; }
  .dark .reg-progress-track { background:rgba(255,255,255,0.08); }
  .reg-progress-fill { height:100%; background:var(--color-moss); border-radius:100px; transition:width 0.4s ease; }

  .reg-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; padding:1.75rem; box-shadow:0 4px 24px rgba(44,36,25,0.06); margin-bottom:1rem; min-height:280px; }
  .dark .reg-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .reg-step-title { font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.02em; margin-bottom:0.25rem; }
  .dark .reg-step-title { color:#F5F0E8; }
  .reg-step-desc { font-size:0.8rem; color:var(--color-warm-mid); margin-bottom:1.25rem; }

  .reg-field { margin-bottom:1rem; }
  .reg-label { display:block; font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.4rem; }
  .dark .reg-label { color:#6b7280; }
  .reg-input { width:100%; padding:0.7rem 0.9rem; border-radius:10px; border:1.5px solid rgba(44,36,25,0.12); background:var(--color-cream); color:var(--color-bark); font-family:var(--font-sans); font-size:0.875rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  .reg-input:focus { border-color:var(--color-moss); box-shadow:0 0 0 3px rgba(59,109,17,0.1); }
  .dark .reg-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .dark .reg-input::placeholder { color:rgba(255,255,255,0.2); }
  .reg-row { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }

  .reg-option-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; }
  .reg-option { padding:0.75rem; border-radius:12px; border:1.5px solid rgba(44,36,25,0.1); background:var(--color-cream); cursor:pointer; transition:all 0.2s; }
  .dark .reg-option { background:#252525; border-color:rgba(255,255,255,0.08); }
  .reg-option:hover { border-color:var(--color-moss); }
  .reg-option.selected { border-color:var(--color-moss); background:var(--color-sage-pale); }
  .dark .reg-option.selected { background:rgba(59,109,17,0.12); }
  .reg-option-title { font-size:0.8rem; font-weight:600; color:var(--color-bark); margin-bottom:0.15rem; }
  .dark .reg-option-title { color:#F5F0E8; }
  .reg-option-desc { font-size:0.7rem; color:var(--color-warm-mid); }

  .reg-goal-grid { display:grid; grid-template-columns:1fr; gap:0.6rem; margin-bottom:1.25rem; }
  .reg-goal-card { display:flex; align-items:center; gap:1rem; padding:0.9rem 1rem; border-radius:14px; border:1.5px solid rgba(44,36,25,0.1); background:var(--color-cream); cursor:pointer; transition:all 0.2s; }
  .dark .reg-goal-card { background:#252525; border-color:rgba(255,255,255,0.08); }
  .reg-goal-card:hover { border-color:var(--color-moss); }
  .reg-goal-card.selected { border-color:var(--color-moss); background:var(--color-sage-pale); }
  .dark .reg-goal-card.selected { background:rgba(59,109,17,0.12); }
  .reg-goal-icon { font-size:1.5rem; flex-shrink:0; }
  .reg-goal-title { font-size:0.875rem; font-weight:600; color:var(--color-bark); }
  .dark .reg-goal-title { color:#F5F0E8; }
  .reg-goal-desc { font-size:0.75rem; color:var(--color-warm-mid); }

  .reg-summary { background:var(--color-sage-pale); border-radius:14px; padding:1rem; }
  .dark .reg-summary { background:rgba(59,109,17,0.08); }
  .reg-summary-title { font-size:0.7rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-moss); margin-bottom:0.75rem; }
  .reg-summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
  .reg-summary-item { background:#fff; border-radius:10px; padding:0.5rem 0.75rem; }
  .dark .reg-summary-item { background:rgba(255,255,255,0.05); }
  .reg-summary-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-warm-mid); }
  .reg-summary-val { font-size:0.85rem; font-weight:600; color:var(--color-bark); }
  .dark .reg-summary-val { color:#F5F0E8; }

  .reg-nav { display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; }
  .reg-back-btn { padding:0.8rem 1.25rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.15); background:transparent; color:var(--color-bark); font-family:var(--font-sans); font-size:0.875rem; cursor:pointer; transition:all 0.2s; }
  .reg-back-btn:hover { background:rgba(44,36,25,0.05); }
  .dark .reg-back-btn { border-color:rgba(255,255,255,0.12); color:#F5F0E8; }
  .reg-next-btn { flex:1; padding:0.875rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:0.9rem; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition:background 0.2s, transform 0.15s; }
  .reg-next-btn:hover:not(:disabled) { background:var(--color-moss); transform:translateY(-1px); }
  .reg-next-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .dark .reg-next-btn { background:var(--color-moss); }
  .dark .reg-next-btn:hover:not(:disabled) { background:var(--color-sage); color:#0f0f0f; }

  .reg-footer { text-align:center; font-size:0.83rem; color:var(--color-warm-mid); }
  .reg-footer-link { color:var(--color-moss); font-weight:500; background:none; border:none; cursor:pointer; font-family:var(--font-sans); font-size:inherit; }
  .reg-footer-link:hover { color:var(--color-sage); }
  .dark .reg-footer-link { color:var(--color-sage); }

  @keyframes spin { to { transform:rotate(360deg); } }
  .spin { animation:spin 0.8s linear infinite; }

  @media (max-width:900px) {
    .reg-page { grid-template-columns:1fr; }
    .reg-left { min-height:40vh; }
    .reg-right { padding:2rem 1.5rem; }
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