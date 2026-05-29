export default function HowItWorksSection() {
  const steps = [
    { num:'01', icon:'👤', title:'Create Your Profile', desc:'Tell us your goals, dietary preferences, and current health metrics. Takes under 2 minutes.' },
    { num:'02', icon:'📸', title:'Log Your Meals',      desc:'Snap a photo or search our database of 2M+ foods. AI fills in the nutrition details automatically.' },
    { num:'03', icon:'📊', title:'Track & Adjust',      desc:'See real-time feedback on your macros, calories, and nutrients. Get smart suggestions to hit your goals.' },
    { num:'04', icon:'🏆', title:'See Results',         desc:'Watch your progress week over week. Celebrate milestones and stay motivated with personalised insights.' },
  ]

  return (
    <section id="how-it-works" style={{ scrollMarginTop:'64px' }}>
      <style>{css}</style>
      <div className="hiw-wrap">
        <div className="hiw-header">
          <div className="hiw-eyebrow"><span className="hiw-dot" />Simple Process</div>
          <h2 className="hiw-h2">Up and running in <em>four steps</em></h2>
          <p className="hiw-desc">No complicated setup. No confusing dashboards. Just results.</p>
        </div>

        <div className="hiw-grid">
          {steps.map((s, i) => (
            <div className="hiw-card" key={i}>
              <div className="hiw-card-top">
                <span className="hiw-num">{s.num}</span>
                <div className="hiw-icon">{s.icon}</div>
              </div>
              <h3 className="hiw-title">{s.title}</h3>
              <p className="hiw-text">{s.desc}</p>
              {i < steps.length - 1 && <div className="hiw-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const css = `
  .hiw-wrap { background: var(--color-cream); padding: 7rem 2rem; }
  .dark .hiw-wrap { background: #0f0f0f; }

  .hiw-header { max-width: 1200px; margin: 0 auto 4rem; text-align: center; }
  .hiw-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-moss); margin-bottom:1.25rem; }
  .dark .hiw-eyebrow { color:var(--color-sage); }
  .hiw-dot { width:6px; height:6px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .hiw-h2 { font-family:var(--font-serif); font-size:clamp(2.2rem,4vw,3.2rem); font-weight:900; color:var(--color-bark); letter-spacing:-0.03em; line-height:1.05; margin-bottom:1rem; }
  .dark .hiw-h2 { color:#F5F0E8; }
  .hiw-h2 em { font-style:italic; color:var(--color-moss); }
  .dark .hiw-h2 em { color:var(--color-sage); }
  .hiw-desc { font-size:1rem; font-weight:300; color:var(--color-warm-mid); line-height:1.7; }

  .hiw-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }

  .hiw-card {
    background: #fff; border:1px solid rgba(44,36,25,0.08); border-radius:22px;
    padding: 2rem 1.75rem; position: relative;
    box-shadow: 0 2px 12px rgba(44,36,25,0.04);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .hiw-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(44,36,25,0.08); }
  .dark .hiw-card { background:#161616; border-color:rgba(255,255,255,0.07); }

  .hiw-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
  .hiw-num { font-family:var(--font-serif); font-size:2.8rem; font-weight:900; color:rgba(44,36,25,0.07); letter-spacing:-0.04em; line-height:1; }
  .dark .hiw-num { color:rgba(245,240,232,0.06); }
  .hiw-icon { width:50px; height:50px; background:var(--color-sage-pale); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; }
  .dark .hiw-icon { background:rgba(59,109,17,0.15); }
  .hiw-title { font-family:var(--font-serif); font-size:1.1rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.02em; margin-bottom:0.6rem; }
  .dark .hiw-title { color:#F5F0E8; }
  .hiw-text { font-size:0.875rem; font-weight:300; line-height:1.7; color:var(--color-warm-mid); }
  .hiw-arrow { position:absolute; top:50%; right:-1rem; transform:translateY(-50%); font-size:1.2rem; color:rgba(44,36,25,0.15); z-index:1; }
  .dark .hiw-arrow { color:rgba(255,255,255,0.1); }

  @media(max-width:900px){ .hiw-grid{grid-template-columns:repeat(2,1fr);} .hiw-arrow{display:none;} }
  @media(max-width:600px){ .hiw-wrap{padding:4rem 1.25rem;} .hiw-grid{grid-template-columns:1fr;} }
`