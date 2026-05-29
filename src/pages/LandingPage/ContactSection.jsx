import { useState } from 'react'

export default function ContactSection() {
  const [form, setForm]       = useState({ name:'', email:'', message:'' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{ scrollMarginTop:'64px' }}>
      <style>{css}</style>
      <div className="ct-wrap">
        <div className="ct-inner">

          {/* Left: info */}
          <div className="ct-left">
            <div className="ct-eyebrow"><span className="ct-dot" />Get in Touch</div>
            <h2 className="ct-h2">Let's talk<br /><em>health</em></h2>
            <p className="ct-desc">Have questions about NutriTrack, need help with your plan, or want to explore partnerships? We'd love to hear from you.</p>

            <div className="ct-info-list">
              {[
                { icon:'📧', label:'Email Us',      value:'hello@nutritrack.app' },
                { icon:'💬', label:'Live Chat',     value:'Available 9am – 6pm EAT' },
                { icon:'📍', label:'Headquarters',  value:'Nairobi, Kenya' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="ct-info-item">
                  <div className="ct-info-icon">{icon}</div>
                  <div>
                    <div className="ct-info-label">{label}</div>
                    <div className="ct-info-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="ct-right">
            {submitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">✅</div>
                <h3 className="ct-success-title">Message sent!</h3>
                <p className="ct-success-desc">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button className="ct-success-btn" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', message:'' }) }}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label className="ct-label">Your Name</label>
                    <input className="ct-input" type="text" placeholder="Aisha Hassan" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Email Address</label>
                    <input className="ct-input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
                  </div>
                </div>
                <div className="ct-field">
                  <label className="ct-label">Message</label>
                  <textarea className="ct-input ct-textarea" placeholder="How can we help?" rows="5" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} required />
                </div>
                <button type="submit" className="ct-submit">Send Message →</button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

const css = `
  .ct-wrap { background:var(--color-bark); padding:7rem 2rem; }
  .dark .ct-wrap { background:#0a0a0a; }

  .ct-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1.4fr; gap:5rem; align-items:start; }

  .ct-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-sage); margin-bottom:1.25rem; }
  .ct-dot { width:6px; height:6px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .ct-h2 { font-family:var(--font-serif); font-size:clamp(2.5rem,4vw,3.5rem); font-weight:900; color:#F5F0E8; letter-spacing:-0.03em; line-height:1.05; margin-bottom:1.25rem; }
  .ct-h2 em { font-style:italic; color:var(--color-sage); }
  .ct-desc { font-size:0.95rem; font-weight:300; color:var(--color-warm-light); line-height:1.75; margin-bottom:2.5rem; }

  .ct-info-list { display:flex; flex-direction:column; gap:1.25rem; }
  .ct-info-item { display:flex; align-items:center; gap:1rem; }
  .ct-info-icon { width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
  .ct-info-label { font-size:0.7rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.15rem; }
  .ct-info-value { font-size:0.875rem; color:#F5F0E8; }

  .ct-right { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:2.5rem; }

  .ct-form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .ct-field { margin-bottom:1.25rem; }
  .ct-label { display:block; font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-bottom:0.4rem; }
  .ct-input { width:100%; padding:0.8rem 1rem; border-radius:12px; border:1.5px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.06); color:#F5F0E8; font-family:var(--font-sans); font-size:0.9rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; resize:none; }
  .ct-input::placeholder { color:rgba(255,255,255,0.25); }
  .ct-input:focus { border-color:var(--color-sage); box-shadow:0 0 0 3px rgba(151,196,89,0.12); }
  .ct-textarea { min-height:120px; }
  .ct-submit { width:100%; padding:0.95rem; border-radius:100px; border:none; background:var(--color-sage); color:var(--color-bark); font-family:var(--font-sans); font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s, transform 0.15s; }
  .ct-submit:hover { background:var(--color-sage-light); transform:translateY(-1px); }

  .ct-success { text-align:center; padding:2rem 1rem; }
  .ct-success-icon { font-size:3rem; margin-bottom:1rem; }
  .ct-success-title { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:#F5F0E8; margin-bottom:0.75rem; }
  .ct-success-desc { font-size:0.9rem; color:var(--color-warm-light); line-height:1.7; margin-bottom:1.5rem; }
  .ct-success-btn { padding:0.75rem 2rem; border-radius:100px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#F5F0E8; font-family:var(--font-sans); font-size:0.875rem; cursor:pointer; transition:background 0.2s; }
  .ct-success-btn:hover { background:rgba(255,255,255,0.06); }

  @media(max-width:900px){ .ct-inner{grid-template-columns:1fr; gap:3rem;} .ct-form-row{grid-template-columns:1fr;} }
  @media(max-width:600px){ .ct-wrap{padding:4rem 1.25rem;} }
`