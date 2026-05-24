import { useState, useEffect } from 'react'

const links = {
  Product:  ['Features', 'Pricing', 'Demo', 'FAQ'],
  Company:  ['About Us', 'Blog', 'Careers', 'Contact'],
  Legal:    ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

const stats = [
  { value: '1M+',  label: 'Active Users'  },
  { value: '50M+', label: 'Meals Tracked' },
  { value: '4.9',  label: 'App Rating'    },
  { value: '150+', label: 'Countries'     },
]

export default function Footer() {
  return (
    <>
      <style>{`
        .ft-root {
          background: #1C1610;
          color: #F5F0E8;
          font-family: var(--font-sans);
        }
        .dark .ft-root {
          background: #0f0f0f;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ft-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem 0;
        }

        /* ── Top strip ── */
        .ft-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(245,240,232,0.1);
          flex-wrap: wrap;
        }
        .ft-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .ft-logo-mark {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--color-moss);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ft-logo-mark svg { display: block; }
        .ft-logo-text {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #F5F0E8;
        }
        .ft-tagline {
          font-size: 0.8rem;
          color: rgba(245,240,232,0.45);
          max-width: 280px;
          line-height: 1.6;
        }
        .ft-app-btns {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }
        .ft-app-btn {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(245,240,232,0.15);
          background: rgba(245,240,232,0.06);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          font-family: var(--font-sans);
          text-align: left;
        }
        .ft-app-btn:hover {
          background: rgba(245,240,232,0.12);
          border-color: rgba(245,240,232,0.3);
        }
        .ft-app-btn-sub {
          font-size: 0.6rem;
          color: rgba(245,240,232,0.5);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          line-height: 1;
          margin-bottom: 2px;
        }
        .ft-app-btn-name {
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(245,240,232,0.9);
          display: block;
          line-height: 1;
        }

        /* ── Links grid ── */
        .ft-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid rgba(245,240,232,0.08);
        }
        .ft-col-title {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.4);
          margin-bottom: 1rem;
        }
        .ft-col-link {
          display: block;
          font-size: 0.875rem;
          color: rgba(245,240,232,0.65);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          padding: 0;
          margin-bottom: 0.65rem;
          transition: color 0.2s;
          text-align: left;
        }
        .ft-col-link:last-child { margin-bottom: 0; }
        .ft-col-link:hover { color: var(--color-sage); }

        /* ── Stats row ── */
        .ft-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid rgba(245,240,232,0.08);
        }
        .ft-stat {
          text-align: center;
        }
        .ft-stat-val {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #F5F0E8;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .ft-stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(245,240,232,0.35);
        }

        /* ── Bottom bar ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ft-copy {
          font-size: 0.78rem;
          color: rgba(245,240,232,0.3);
        }
        .ft-bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        .ft-bottom-link {
          font-size: 0.75rem;
          color: rgba(245,240,232,0.35);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: color 0.2s;
          padding: 0;
        }
        .ft-bottom-link:hover { color: rgba(245,240,232,0.7); }

        /* social */
        .ft-socials {
          display: flex;
          gap: 0.6rem;
          margin-top: 1rem;
        }
        .ft-social-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(245,240,232,0.12);
          background: rgba(245,240,232,0.05);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          color: rgba(245,240,232,0.5);
        }
        .ft-social-btn:hover {
          background: rgba(245,240,232,0.1);
          border-color: rgba(245,240,232,0.25);
          color: rgba(245,240,232,0.9);
        }

        @media (max-width: 768px) {
          .ft-inner { padding: 3rem 1.25rem 0; }
          .ft-top { flex-direction: column; align-items: flex-start; }
          .ft-links { grid-template-columns: 1fr 1fr; }
          .ft-stats { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .ft-bottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .ft-links { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">

          {/* ── Top: brand + app badges ── */}
          <div className="ft-top">
            <div>
              <div className="ft-brand" style={{ marginBottom: '0.75rem' }}>
                <div className="ft-logo-mark">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3C6.69 3 4 5.69 4 9c0 2.21 1.18 4.14 2.94 5.22L6.5 17h7l-.44-2.78A6 6 0 0016 9c0-3.31-2.69-6-6-6z" fill="white"/>
                  </svg>
                </div>
                <span className="ft-logo-text">NutriTrack</span>
              </div>
              <p className="ft-tagline">
                Your personal nutrition companion. Track calories, meals, and achieve your health goals.
              </p>
              <div className="ft-socials">
                {/* Email */}
                <button className="ft-social-btn" aria-label="Email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </button>
                {/* Twitter/X */}
                <button className="ft-social-btn" aria-label="Twitter">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                {/* Instagram */}
                <button className="ft-social-btn" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </button>
              </div>
            </div>

            {/* App store buttons */}
            <div className="ft-app-btns">
              <button className="ft-app-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(245,240,232,0.7)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <span className="ft-app-btn-sub">Download on the</span>
                  <span className="ft-app-btn-name">App Store</span>
                </div>
              </button>
              <button className="ft-app-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(245,240,232,0.7)"><path d="m3 20.5 9-9m0 0 9-9M12 11.5 3 2.5m9 9 9 9"/><path d="M3 2.5h.01M3 20.5h.01M21 2.5h.01M21 20.5h.01" stroke="rgba(245,240,232,0.7)" strokeWidth="1.5" fill="none"/></svg>
                <div>
                  <span className="ft-app-btn-sub">Get it on</span>
                  <span className="ft-app-btn-name">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          {/* ── Links ── */}
          <div className="ft-links">
            {Object.entries(links).map(([col, items]) => (
              <div key={col}>
                <div className="ft-col-title">{col}</div>
                {items.map(item => (
                  <button key={item} className="ft-col-link">{item}</button>
                ))}
              </div>
            ))}
          </div>

          {/* ── Stats ── */}
          <div className="ft-stats">
            {stats.map(({ value, label }) => (
              <div className="ft-stat" key={label}>
                <div className="ft-stat-val">{value}</div>
                <div className="ft-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div className="ft-bottom">
            <span className="ft-copy">© 2026 NutriTrack. All rights reserved.</span>
            <div className="ft-bottom-links">
              {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(l => (
                <button key={l} className="ft-bottom-link">{l}</button>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}