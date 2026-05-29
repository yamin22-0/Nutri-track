export default function FeaturesSection() {
  const features = [
    { icon:'🥗', title:'Smart Meal Logging',      desc:'Snap a photo and our AI identifies ingredients, portions, and macros in seconds.', size:'large' },
    { icon:'📊', title:'Deep Nutrition Insights', desc:'Weekly and monthly trends across 50+ nutrients — not just calories.',              size:'small' },
    { icon:'🎯', title:'Personalised Goals',      desc:'Goals that adapt as you progress, powered by real metabolic data.',                size:'small' },
    { icon:'💧', title:'Hydration Tracker',       desc:'Log water intake and stay hydrated throughout the day with smart reminders.',     size:'small' },
    { icon:'🏃', title:'Activity Integration',    desc:'Sync with fitness apps to automatically adjust your calorie targets.',            size:'small' },
    { icon:'📈', title:'Progress Reports',        desc:'Detailed weekly PDF reports sent straight to your inbox.',                        size:'large' },
  ]

  return (
    <section id="features" style={{ scrollMarginTop:'64px' }}>
      <style>{css}</style>
      <div className="feat-wrap">
        <div className="feat-header">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Everything you need</div>
          <h2 className="feat-h2">Powerful features,<br /><em>beautifully simple</em></h2>
          <p className="feat-desc">Everything you need to understand, track, and improve your nutrition — all in one place.</p>
        </div>

        <div className="feat-bento">
          {features.map((f, i) => (
            <div key={i} className={`feat-card feat-card--${f.size} ${i===0?'feat-card--accent':''}`}>
              <div className="feat-icon">{f.icon}</div>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-text">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const css = `
  .feat-wrap { background: var(--color-bark); padding: 7rem 2rem; }
  .dark .feat-wrap { background: #0a0a0a; }

  .feat-header { max-width: 1200px; margin: 0 auto 3.5rem; text-align: center; }
  .feat-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--color-sage); margin-bottom: 1.25rem;
  }
  .feat-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .feat-h2 {
    font-family: var(--font-serif); font-size: clamp(2.2rem,4vw,3.2rem);
    font-weight: 900; color: #F5F0E8; letter-spacing: -0.03em;
    line-height: 1.05; margin-bottom: 1rem;
  }
  .feat-h2 em { font-style: italic; color: var(--color-sage); }
  .feat-desc { font-size: 1rem; font-weight: 300; color: var(--color-warm-light); max-width: 500px; margin: 0 auto; line-height: 1.7; }

  .feat-bento {
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto;
    gap: 1px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 24px;
    overflow: hidden;
  }

  .feat-card {
    background: rgba(255,255,255,0.03);
    padding: 2.5rem 2rem;
    transition: background 0.2s;
  }
  .feat-card:hover { background: rgba(255,255,255,0.06); }
  .feat-card--large { grid-column: span 2; }
  .feat-card--accent { background: rgba(59,109,17,0.15); }
  .feat-card--accent:hover { background: rgba(59,109,17,0.2); }

  .feat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-bottom: 1.25rem;
  }
  .feat-title {
    font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;
    color: #F5F0E8; letter-spacing: -0.02em; margin-bottom: 0.6rem;
  }
  .feat-text { font-size: 0.875rem; font-weight: 300; line-height: 1.7; color: var(--color-warm-light); }

  @media (max-width: 900px) { .feat-bento { grid-template-columns: repeat(2, 1fr); } .feat-card--large { grid-column: span 2; } }
  @media (max-width: 600px) { .feat-wrap { padding: 4rem 1.25rem; } .feat-bento { grid-template-columns: 1fr; } .feat-card--large { grid-column: span 1; } }
`