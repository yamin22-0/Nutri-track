export default function TestimonialsSection() {
  const testimonials = [
    { initials:'AK', name:'Amara Kwame',    role:'Marathon runner, Lagos',      color:'#97C459', quote:'NutriTrack made me realise I\'d been under-eating protein for years. Lost 12 kg in four months — and actually enjoyed the process.' },
    { initials:'SP', name:'Siosaia Pulu',   role:'Personal trainer, Auckland',  color:'#3B6D11', quote:'I recommend NutriTrack to every single one of my clients. The macro breakdown is the most accurate I\'ve ever seen in a free app.' },
    { initials:'MN', name:'Miriam Njoroge', role:'Nutritionist, Nairobi',       color:'#C0DD97', quote:'As a professional I\'m picky about nutrition data. NutriTrack\'s database is comprehensive and the AI logging saves my clients hours every week.' },
    { initials:'JO', name:'James Odhiambo', role:'Software engineer, Nairobi',  color:'#97C459', quote:'I\'ve tried every food tracking app. NutriTrack is the only one that actually stuck. The design is clean and it just works.' },
    { initials:'FA', name:'Fatuma Adan',    role:'Fitness coach, Mombasa',      color:'#3B6D11', quote:'My clients\' results have improved dramatically since I introduced them to NutriTrack. The goal-setting feature is a game changer.' },
    { initials:'BO', name:'Brian Omondi',   role:'Medical student, Nairobi',    color:'#C0DD97', quote:'Finally an app that takes nutrition seriously. The 50+ nutrient tracking is something I\'ve never seen anywhere else at this price.' },
  ]

  return (
    <section id="testimonials" style={{ scrollMarginTop:'64px' }}>
      <style>{css}</style>
      <div className="testi-wrap">
        <div className="testi-header">
          <div className="testi-eyebrow"><span className="testi-dot" />Real Stories</div>
          <h2 className="testi-h2">Loved by <em>1 million+</em><br />health enthusiasts</h2>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background:t.color }}>{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const css = `
  .testi-wrap { background:var(--color-sage-pale); padding:7rem 2rem; }
  .dark .testi-wrap { background:#111a09; }

  .testi-header { max-width:1200px; margin:0 auto 4rem; text-align:center; }
  .testi-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-moss); margin-bottom:1.25rem; }
  .dark .testi-eyebrow { color:var(--color-sage); }
  .testi-dot { width:6px; height:6px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .testi-h2 { font-family:var(--font-serif); font-size:clamp(2.2rem,4vw,3.2rem); font-weight:900; color:var(--color-bark); letter-spacing:-0.03em; line-height:1.1; }
  .dark .testi-h2 { color:#F5F0E8; }
  .testi-h2 em { font-style:italic; color:var(--color-moss); }
  .dark .testi-h2 em { color:var(--color-sage); }

  .testi-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }

  .testi-card {
    background:#fff; border-radius:24px; padding:2.25rem;
    border:1px solid rgba(44,36,25,0.06);
    display:flex; flex-direction:column; gap:1.75rem;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .testi-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(44,36,25,0.08); }
  .dark .testi-card { background:#1c2910; border-color:rgba(255,255,255,0.05); }

  .testi-quote { font-family:var(--font-serif); font-size:1rem; font-style:italic; line-height:1.65; color:var(--color-bark); flex:1; }
  .dark .testi-quote { color:#E8E4DC; }

  .testi-author { display:flex; align-items:center; gap:0.75rem; }
  .testi-avatar { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:white; flex-shrink:0; }
  .testi-name { font-size:0.875rem; font-weight:600; color:var(--color-bark); }
  .dark .testi-name { color:#F5F0E8; }
  .testi-role { font-size:0.72rem; color:var(--color-warm-mid); margin-top:2px; }

  @media(max-width:900px){ .testi-grid{grid-template-columns:repeat(2,1fr);} }
  @media(max-width:600px){ .testi-wrap{padding:4rem 1.25rem;} .testi-grid{grid-template-columns:1fr;} }
`