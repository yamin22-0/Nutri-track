import { useEffect } from 'react'
import { motion } from 'framer-motion'

function useHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])
}

// Verified working Unsplash photo IDs
const FOODS = [
  { photo: 'photo-1512621776951-a57141f2eefd', name: 'Fresh Veggies'   },
  { photo: 'photo-1546069901-ba9599a7e63c', name: 'Healthy Salad'    },
  { photo: 'photo-1490645935967-10de6ba17061', name: 'Fruit Bowl'      },
  { photo: 'photo-1504674900247-0877df9cc836', name: 'Grilled Salmon'  },
  { photo: 'photo-1567306226416-28f0efdc88ce', name: 'Fresh Apple'     },
  { photo: 'photo-1498837167922-ddd27525d352', name: 'Healthy Plate'   },
  { photo: 'photo-1565958011703-44f9829ba187', name: 'Mixed Berries'   },
  { photo: 'photo-1567620905732-2d1ec7ab7445', name: 'Açaí Bowl'       },
  { photo: 'photo-1482049016688-2d3e1b311543', name: 'Avocado Toast'   },
  { photo: 'photo-1473093295043-cdd812d0e601', name: 'Pasta Dish'      },
  { photo: 'photo-1555939594-58d7cb561ad1', name: 'Chicken Bowl'     },
  { photo: 'photo-1540420773420-3366772f4999', name: 'Green Salad'     },
]

// Quadruple the array so we have plenty of items — prevents any visible gap
// The animation moves -25% (one quarter = one original set) for a perfect loop
const TICKER_ITEMS = [...FOODS, ...FOODS, ...FOODS, ...FOODS]

const ITEM_W = 96 // px — fixed width per item

export default function HeroSection() {
  useHashScroll()

  return (
    <section id="home" style={{ scrollMarginTop: '64px' }}>
      <div className="hero-wrap">

        <div className="hero-container">
          {/* LEFT */}
          <motion.div className="hero-left" initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              AI-Powered Health Tracking
            </div>

            <h1 className="hero-h1">
              Track Your{' '}
              <span className="hero-h1-accent">Health Journey</span>
            </h1>

            <p className="hero-desc">
              Monitor calories, track meals, and achieve your fitness goals with NutriTrack.
              Join over 1 million happy users living their healthiest lives.
            </p>

            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => window.location.href='/register'}>
                Get Started Free →
              </button>
              <button className="hero-btn-ghost" onClick={() => window.location.href='/login'}>
                Sign In
              </button>
            </div>

            <div className="hero-stats">
              {[['1M+','Active Users'],['50M+','Meals Tracked'],['4.9★','App Rating']].map(([v,l]) => (
                <div key={l}>
                  <div className="hero-stat-num">{v}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div className="hero-right" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.2 }}>
            <div className="hero-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop&crop=center&auto=format&q=80"
                alt="Healthy food"
                className="hero-img"
              />

              {/* Calorie ring */}
              <div className="hero-float-ring">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(44,36,25,0.08)" strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-moss)" strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="264" strokeDashoffset="42"
                    transform="rotate(-90 50 50)" />
                </svg>
                <div className="hero-float-ring-label">
                  <span className="hero-float-pct">84%</span>
                  <span className="hero-float-sub">of goal</span>
                </div>
              </div>

              {/* Macro chips */}
              {[
                { icon:'🍗', label:'Protein', value:'98g', sub:'/140g', cls:'hero-chip-1' },
                { icon:'🍚', label:'Carbs',   value:'156g', sub:'/250g', cls:'hero-chip-2' },
                { icon:'🥑', label:'Fat',     value:'42g',  sub:'/55g',  cls:'hero-chip-3' },
              ].map(({ icon, label, value, sub, cls }) => (
                <div key={label} className={`hero-chip ${cls}`}>
                  <span className="hero-chip-icon">{icon}</span>
                  <div>
                    <div className="hero-chip-label">{label}</div>
                    <div className="hero-chip-value">{value}<span className="hero-chip-sub">{sub}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── TICKER ── */}
        <div className="ticker-root">
          {/* Fade masks */}
          <div className="ticker-fade ticker-fade--l" aria-hidden="true" />
          <div className="ticker-fade ticker-fade--r" aria-hidden="true" />

          <div className="ticker-viewport">
            <div className="ticker-track">
              {TICKER_ITEMS.map((food, i) => (
                <div key={i} className="ticker-item">
                  <img
                    src={`https://images.unsplash.com/${food.photo}?w=120&h=120&fit=crop&crop=center&auto=format&q=75`}
                    alt={food.name}
                    className="ticker-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="ticker-name">{food.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .hero-wrap {
          min-height: 100vh;
          padding-top: 64px;
          background: var(--color-cream);
          display: flex;
          flex-direction: column;
        }
        .dark .hero-wrap { background: #0f0f0f; }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 2rem 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          flex: 1;
        }

        /* LEFT */
        .hero-left { display: flex; flex-direction: column; }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--color-moss); margin-bottom: 1.5rem;
        }
        .dark .hero-eyebrow { color: var(--color-sage); }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-sage); animation: pulse 2s infinite;
        }

        .hero-h1 {
          font-family: var(--font-serif);
          font-size: clamp(2.6rem, 5vw, 4.2rem);
          font-weight: 900; line-height: 1.1;
          letter-spacing: -0.03em; color: var(--color-bark); margin-bottom: 1.25rem;
        }
        .dark .hero-h1 { color: #F5F0E8; }
        .hero-h1-accent {
          background: linear-gradient(135deg, var(--color-moss), var(--color-sage));
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        .hero-desc {
          font-size: 1rem; font-weight: 300; line-height: 1.7;
          color: var(--color-warm-mid); max-width: 440px; margin-bottom: 2rem;
        }

        .hero-actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }

        .hero-btn-primary {
          font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500;
          color: var(--color-cream); background: var(--color-bark);
          border: none; border-radius: 100px; padding: 0.875rem 2rem;
          cursor: pointer; transition: background 0.2s, transform 0.15s;
        }
        .hero-btn-primary:hover { background: var(--color-moss); transform: translateY(-2px); }
        .dark .hero-btn-primary { background: var(--color-moss); }

        .hero-btn-ghost {
          font-family: var(--font-sans); font-size: 0.9rem; font-weight: 400;
          color: var(--color-bark); background: transparent;
          border: 1.5px solid rgba(44,36,25,0.2); border-radius: 100px;
          padding: 0.875rem 1.75rem; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .hero-btn-ghost:hover { border-color: var(--color-moss); color: var(--color-moss); }
        .dark .hero-btn-ghost { color: #F5F0E8; border-color: rgba(255,255,255,0.2); }

        .hero-stats { display: flex; gap: 2.5rem; }
        .hero-stat-num {
          font-family: var(--font-serif); font-size: 1.65rem; font-weight: 700;
          color: var(--color-bark); letter-spacing: -0.03em;
        }
        .dark .hero-stat-num { color: #F5F0E8; }
        .hero-stat-label {
          font-size: 0.68rem; font-weight: 400; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--color-warm-mid); margin-top: 0.2rem;
        }

        /* RIGHT */
        .hero-right { display: flex; justify-content: center; }
        .hero-img-wrap { position: relative; display: inline-block; }
        .hero-img {
          width: 100%; max-width: 440px; border-radius: 28px;
          box-shadow: 0 24px 48px rgba(44,36,25,0.14);
          display: block;
        }

        /* Ring */
        .hero-float-ring {
          position: absolute; top: -18px; right: -18px;
          width: 100px; height: 100px;
          background: #fff; border-radius: 50%;
          box-shadow: 0 8px 24px rgba(44,36,25,0.12);
          display: flex; align-items: center; justify-content: center;
        }
        .dark .hero-float-ring { background: #1a1a1a; }
        .hero-float-ring-label {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .hero-float-pct {
          font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;
          color: var(--color-bark); line-height: 1;
        }
        .dark .hero-float-pct { color: #F5F0E8; }
        .hero-float-sub { font-size: 0.58rem; color: var(--color-warm-mid); margin-top: 2px; }

        /* Macro chips */
        .hero-chip {
          position: absolute; background: #fff; border-radius: 14px;
          padding: 0.55rem 0.9rem; display: flex; align-items: center; gap: 0.6rem;
          box-shadow: 0 6px 18px rgba(44,36,25,0.1);
        }
        .dark .hero-chip { background: #1a1a1a; }
        .hero-chip-1 { top: 18%; left: -50px; }
        .hero-chip-2 { bottom: 28%; left: -30px; }
        .hero-chip-3 { bottom: 10%; right: -40px; }
        .hero-chip-icon { font-size: 1.2rem; }
        .hero-chip-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-warm-mid); }
        .hero-chip-value { font-size: 0.82rem; font-weight: 700; color: var(--color-bark); line-height: 1.2; }
        .dark .hero-chip-value { color: #F5F0E8; }
        .hero-chip-sub { font-size: 0.68rem; font-weight: 400; color: var(--color-warm-mid); margin-left: 1px; }

        /* ── TICKER ──
           Strategy: 4x items, animate -25% (= 1 set width)
           This means the visible window never sees a seam — there are always
           3 more full sets ahead before the loop resets.
           Fade masks cover any edge artifacts completely.
        */
        .ticker-root {
          position: relative;
          border-top: 1px solid rgba(44,36,25,0.08);
          padding: 1.5rem 0;
          overflow: hidden;
          background: var(--color-cream);
        }
        .dark .ticker-root { background: #0f0f0f; border-top-color: rgba(255,255,255,0.06); }

        /* Wide fade masks — key to hiding any loop seam */
        .ticker-fade {
          position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2;
          pointer-events: none;
        }
        .ticker-fade--l {
          left: 0;
          background: linear-gradient(to right, var(--color-cream) 40%, transparent 100%);
        }
        .ticker-fade--r {
          right: 0;
          background: linear-gradient(to left, var(--color-cream) 40%, transparent 100%);
        }
        .dark .ticker-fade--l { background: linear-gradient(to right, #0f0f0f 40%, transparent 100%); }
        .dark .ticker-fade--r { background: linear-gradient(to left,  #0f0f0f 40%, transparent 100%); }

        .ticker-viewport { overflow: hidden; width: 100%; }

        .ticker-track {
          display: flex;
          width: max-content;
          will-change: transform;
          /* Move exactly -25% = one original set (4x items ÷ 4 = 1 set) */
          animation: ticker-loop 28s linear infinite;
        }
        /* Pause on hover */
        .ticker-root:hover .ticker-track { animation-play-state: paused; }

        /* Fixed item width — no flex gap so math is exact */
        .ticker-item {
          width: ${ITEM_W}px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          cursor: default;
          transition: transform 0.2s;
        }
        .ticker-root:hover .ticker-item:hover { transform: translateY(-4px); }

        .ticker-img {
          width: 54px; height: 54px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--color-sage-light);
          background: var(--color-sage-pale);
        }
        .dark .ticker-img { border-color: rgba(151,196,89,0.25); background: rgba(59,109,17,0.1); }

        .ticker-name {
          font-size: 0.6rem; color: var(--color-warm-mid); text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
        }
        .dark .ticker-name { color: #6b7280; }

        /* -25% of 4x = exactly 1 original set width → seamless */
        @keyframes ticker-loop {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-container { grid-template-columns: 1fr; text-align: center; padding: 3.5rem 1.5rem 2rem; gap: 2.5rem; }
          .hero-desc { max-width: 100%; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-chip-1, .hero-chip-2, .hero-chip-3, .hero-float-ring { display: none; }
          .hero-img { max-width: 340px; }
        }
        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; align-items: stretch; }
          .hero-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
          .ticker-fade { width: 60px; }
          .ticker-img { width: 44px; height: 44px; }
        }
      `}</style>
    </section>
  )
}

