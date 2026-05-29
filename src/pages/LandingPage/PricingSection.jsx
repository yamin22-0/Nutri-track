import { useState } from 'react'

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name:'Free', price:{ monthly:0, annual:0 }, period:'forever',
      desc:'Perfect for getting started with nutrition tracking.',
      features:['Up to 3 meals logged per day','Basic calorie tracking','Food database access','7-day history'],
      cta:'Get Started Free', href:'/register', highlight:false,
    },
    {
      name:'Pro', price:{ monthly:9, annual:7 }, period:'/ month',
      desc:'For serious health enthusiasts who want deep insights.',
      features:['Unlimited meal logging','AI photo recognition','50+ nutrient tracking','Unlimited history & reports','Goal adaptation engine','Priority support'],
      cta:'Start Pro Free', href:'/register?plan=pro', highlight:true,
    },
    {
      name:'Team', price:{ monthly:29, annual:23 }, period:'/ month',
      desc:'For coaches and nutritionists managing multiple clients.',
      features:['Everything in Pro','Up to 10 client accounts','Client progress dashboard','PDF report generation','Custom branding'],
      cta:'Contact Sales', href:'/contact', highlight:false,
    },
  ]

  return (
    <section id="pricing" style={{ scrollMarginTop:'64px' }}>
      <style>{css}</style>
      <div className="price-wrap">
        <div className="price-header">
          <div className="price-eyebrow"><span className="price-dot" />Simple Pricing</div>
          <h2 className="price-h2">No surprises,<br /><em>no hidden fees</em></h2>
          <p className="price-desc">Start free forever. Upgrade when you're ready.</p>

          {/* Annual toggle */}
          <div className="price-toggle">
            <span className={`price-toggle-label ${!annual?'active':''}`}>Monthly</span>
            <button className={`price-toggle-btn ${annual?'on':''}`} onClick={()=>setAnnual(p=>!p)}>
              <span className="price-toggle-knob" />
            </button>
            <span className={`price-toggle-label ${annual?'active':''}`}>
              Annual <span className="price-save-badge">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="price-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`price-card ${plan.highlight?'price-card--hl':''}`}>
              {plan.highlight && <div className="price-badge">Most Popular</div>}
              <div className="price-plan-name">{plan.name}</div>
              <div className="price-amount">
                <span className="price-currency">$</span>
                <span className="price-num">{annual ? plan.price.annual : plan.price.monthly}</span>
                <span className="price-period">{plan.price.monthly === 0 ? `/${plan.period}` : plan.period}</span>
              </div>
              <p className="price-plan-desc">{plan.desc}</p>
              <ul className="price-features">
                {plan.features.map((f,j)=>(
                  <li key={j} className="price-feature-item">
                    <span className="price-check">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={`price-cta ${plan.highlight?'price-cta--hl':''}`} onClick={()=>window.location.href=plan.href}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const css = `
  .price-wrap { background:var(--color-cream); padding:7rem 2rem; }
  .dark .price-wrap { background:#0f0f0f; }

  .price-header { max-width:1200px; margin:0 auto 4rem; text-align:center; }
  .price-eyebrow { display:inline-flex; align-items:center; gap:0.5rem; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-moss); margin-bottom:1.25rem; }
  .dark .price-eyebrow { color:var(--color-sage); }
  .price-dot { width:6px; height:6px; border-radius:50%; background:var(--color-sage); animation:pulse 2s infinite; }
  .price-h2 { font-family:var(--font-serif); font-size:clamp(2.2rem,4vw,3.2rem); font-weight:900; color:var(--color-bark); letter-spacing:-0.03em; line-height:1.1; margin-bottom:1rem; }
  .dark .price-h2 { color:#F5F0E8; }
  .price-h2 em { font-style:italic; color:var(--color-moss); }
  .dark .price-h2 em { color:var(--color-sage); }
  .price-desc { font-size:1rem; font-weight:300; color:var(--color-warm-mid); margin-bottom:2rem; }

  .price-toggle { display:inline-flex; align-items:center; gap:0.75rem; }
  .price-toggle-label { font-size:0.875rem; color:var(--color-warm-mid); transition:color 0.2s; }
  .price-toggle-label.active { color:var(--color-bark); font-weight:500; }
  .dark .price-toggle-label.active { color:#F5F0E8; }
  .price-toggle-btn { width:44px; height:24px; border-radius:100px; background:rgba(44,36,25,0.1); border:none; cursor:pointer; position:relative; transition:background 0.2s; }
  .price-toggle-btn.on { background:var(--color-moss); }
  .dark .price-toggle-btn { background:rgba(255,255,255,0.1); }
  .price-toggle-knob { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:white; transition:transform 0.2s; }
  .price-toggle-btn.on .price-toggle-knob { transform:translateX(20px); }
  .price-save-badge { background:var(--color-sage-pale); color:var(--color-moss); font-size:0.65rem; padding:0.15rem 0.5rem; border-radius:100px; margin-left:0.4rem; font-weight:600; }

  .price-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; align-items:start; }

  .price-card {
    background:#fff; border:1.5px solid rgba(44,36,25,0.09);
    border-radius:28px; padding:2.25rem 2rem; position:relative;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .price-card:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(44,36,25,0.08); }
  .dark .price-card { background:#161616; border-color:rgba(255,255,255,0.07); }
  .price-card--hl { background:var(--color-bark); border-color:var(--color-bark); transform:scale(1.03); }
  .price-card--hl:hover { transform:scale(1.03) translateY(-4px); }
  .dark .price-card--hl { background:var(--color-moss); border-color:var(--color-moss); }

  .price-badge { position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:var(--color-sage); color:var(--color-bark); font-size:0.68rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.35rem 1rem; border-radius:100px; white-space:nowrap; }

  .price-plan-name { font-size:0.72rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.75rem; }
  .price-card--hl .price-plan-name { color:var(--color-sage-light); }

  .price-amount { display:flex; align-items:baseline; gap:0.2rem; margin-bottom:0.5rem; }
  .price-currency { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:var(--color-bark); }
  .dark .price-currency { color:#F5F0E8; }
  .price-card--hl .price-currency { color:var(--color-cream); }
  .price-num { font-family:var(--font-serif); font-size:3.5rem; font-weight:900; letter-spacing:-0.04em; color:var(--color-bark); line-height:1; }
  .dark .price-num { color:#F5F0E8; }
  .price-card--hl .price-num { color:var(--color-cream); }
  .price-period { font-size:0.875rem; color:var(--color-warm-mid); }
  .price-card--hl .price-period { color:var(--color-sage-light); }

  .price-plan-desc { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); line-height:1.6; margin:0.75rem 0 1.5rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(44,36,25,0.08); }
  .price-card--hl .price-plan-desc { color:var(--color-sage-light); border-bottom-color:rgba(245,240,232,0.1); }
  .dark .price-plan-desc { border-bottom-color:rgba(255,255,255,0.07); }

  .price-features { list-style:none; display:flex; flex-direction:column; gap:0.7rem; margin-bottom:2rem; }
  .price-feature-item { display:flex; align-items:flex-start; gap:0.6rem; font-size:0.875rem; color:var(--color-bark); line-height:1.5; }
  .dark .price-feature-item { color:#D0CEC8; }
  .price-card--hl .price-feature-item { color:var(--color-cream); }
  .price-check { color:var(--color-moss); font-weight:700; flex-shrink:0; }
  .price-card--hl .price-check { color:var(--color-sage); }

  .price-cta { width:100%; padding:0.875rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.18); background:transparent; font-family:var(--font-sans); font-size:0.9rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.2s; }
  .price-cta:hover { background:rgba(44,36,25,0.05); border-color:var(--color-bark); }
  .dark .price-cta { color:#F5F0E8; border-color:rgba(255,255,255,0.15); }
  .dark .price-cta:hover { background:rgba(255,255,255,0.06); }
  .price-cta--hl { background:var(--color-sage); border-color:var(--color-sage); color:var(--color-bark); }
  .price-cta--hl:hover { background:var(--color-sage-light); border-color:var(--color-sage-light); transform:translateY(-1px); }

  @media(max-width:900px){ .price-grid{grid-template-columns:1fr; max-width:420px; margin:0 auto;} .price-card--hl{transform:scale(1);} .price-card--hl:hover{transform:translateY(-4px);} }
  @media(max-width:600px){ .price-wrap{padding:4rem 1.25rem;} }
`