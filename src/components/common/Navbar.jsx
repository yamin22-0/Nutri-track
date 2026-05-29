import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Home',         href: '/',           section: null        },
  { label: 'Features',     href: '/#features',  section: 'features'  },
  { label: 'How It Works', href: '/#how-it-works', section: 'how-it-works' },
  { label: 'Testimonials', href: '/#testimonials', section: 'testimonials' },
  { label: 'Pricing',      href: '/#pricing',   section: 'pricing'   },
  { label: 'Contact',      href: '/#contact',   section: 'contact'   },
]

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled]   = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Apply dark class to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  function handleNavClick(e, link) {
    e.preventDefault()
    setMenuOpen(false)
    // If we're on the landing page already, just scroll
    if (window.location.pathname === '/') {
      if (link.section) {
        scrollToSection(link.section)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Navigate to landing page with hash, then scroll handled by useEffect on landing page
      window.location.href = link.href
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <>
      <style>{navCss}</style>
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-nav-inner">

          {/* Logo */}
          <div className="lp-logo" onClick={() => window.location.href = '/'}>
            <div className="lp-logo-mark">♥</div>
            <span className="lp-logo-text">NutriTrack</span>
          </div>

          {/* Desktop centre links — only show on landing page */}
          {!isLoggedIn && (
            <div className="lp-nav-links">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="lp-nav-link"
                  onClick={e => handleNavClick(e, link)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {isLoggedIn && (
            <div className="lp-nav-links">
              <a className="lp-nav-link" href="/dashboard">Dashboard</a>
              <a className="lp-nav-link" href="/food-log">Food Log</a>
              <a className="lp-nav-link" href="/analytics">Analytics</a>
            </div>
          )}

          {/* Right side */}
          <div className="lp-nav-right">
            {!isLoggedIn ? (
              <>
                <a className="lp-nav-link" href="/login">Login</a>
                <button className="lp-nav-cta" onClick={() => window.location.href = '/register'}>
                  Sign Up
                </button>
              </>
            ) : (
              <button className="lp-nav-logout" onClick={handleLogout}>Sign Out</button>
            )}

            <button className="lp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button className="lp-hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lp-mobile-menu">
            {!isLoggedIn ? (
              <>
                {NAV_LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="lp-mobile-link"
                    onClick={e => handleNavClick(e, link)}
                  >
                    {link.label}
                  </a>
                ))}
                <a className="lp-mobile-link lp-mobile-cta" href="/register">Sign Up Free</a>
              </>
            ) : (
              <>
                <a className="lp-mobile-link" href="/dashboard">Dashboard</a>
                <a className="lp-mobile-link" href="/food-log">Food Log</a>
                <a className="lp-mobile-link" href="/analytics">Analytics</a>
                <span className="lp-mobile-link lp-mobile-logout" onClick={handleLogout}>Sign Out</span>
              </>
            )}
            <span className="lp-mobile-link" onClick={() => { toggleTheme(); setMenuOpen(false) }}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
          </div>
        )}
      </nav>
    </>
  )
}

const navCss = `
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(245,240,232,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(44,36,25,0.08);
    transition: box-shadow 0.3s ease, background 0.3s ease;
  }
  .dark .lp-nav { background: rgba(15,15,15,0.92); border-bottom-color: rgba(255,255,255,0.06); }
  .lp-nav.scrolled { box-shadow: 0 2px 24px rgba(44,36,25,0.07); }
  .dark .lp-nav.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,0.4); }

  .lp-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 2rem;
    height: 64px; display: flex; align-items: center;
    justify-content: space-between; gap: 1.5rem;
  }

  .lp-logo {
    display: flex; align-items: center; gap: 0.5rem;
    text-decoration: none; flex-shrink: 0; cursor: pointer;
  }
  .lp-logo-mark {
    width: 32px; height: 32px; background: var(--color-moss);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; color: white; font-size: 14px; flex-shrink: 0;
  }
  .lp-logo-text {
    font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;
    color: var(--color-bark); letter-spacing: -0.02em; white-space: nowrap;
  }
  .dark .lp-logo-text { color: #F5F0E8; }

  .lp-nav-links {
    display: flex; align-items: center; gap: 0.25rem;
    flex: 1; justify-content: center;
  }
  .lp-nav-link {
    font-size: 0.825rem; font-weight: 400; color: var(--color-warm-mid);
    letter-spacing: 0.01em; cursor: pointer; text-decoration: none;
    padding: 0.4rem 0.75rem; border-radius: 8px;
    transition: color 0.2s, background 0.2s; white-space: nowrap;
  }
  .lp-nav-link:hover { color: var(--color-bark); background: rgba(44,36,25,0.05); }
  .dark .lp-nav-link { color: #94a3b8; }
  .dark .lp-nav-link:hover { color: #F5F0E8; background: rgba(255,255,255,0.05); }

  .lp-nav-right { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }

  .lp-nav-cta {
    font-family: var(--font-sans); font-size: 0.825rem; font-weight: 500;
    color: var(--color-cream); background: var(--color-bark);
    border: none; border-radius: 100px; padding: 0.55rem 1.25rem;
    cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.15s;
  }
  .lp-nav-cta:hover { background: var(--color-moss); transform: translateY(-1px); }
  .dark .lp-nav-cta { background: var(--color-moss); }

  .lp-nav-logout {
    font-family: var(--font-sans); font-size: 0.825rem; font-weight: 400;
    color: #ef4444; background: transparent; border: 1px solid #ef4444;
    border-radius: 100px; padding: 0.5rem 1.1rem; cursor: pointer;
    transition: background 0.2s;
  }
  .lp-nav-logout:hover { background: rgba(239,68,68,0.07); }

  .lp-theme-btn {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid rgba(44,36,25,0.15); background: transparent;
    cursor: pointer; font-size: 0.95rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .lp-theme-btn:hover { background: rgba(44,36,25,0.06); }
  .dark .lp-theme-btn { border-color: rgba(255,255,255,0.12); }

  .lp-hamburger {
    display: none; width: 36px; height: 36px; border-radius: 8px;
    border: 1px solid rgba(44,36,25,0.15); background: transparent;
    cursor: pointer; font-size: 1rem;
    align-items: center; justify-content: center; transition: background 0.2s;
    color: var(--color-bark);
  }
  .lp-hamburger:hover { background: rgba(44,36,25,0.06); }
  .dark .lp-hamburger { border-color: rgba(255,255,255,0.12); color: #F5F0E8; }

  .lp-mobile-menu {
    display: flex; flex-direction: column; gap: 0.25rem;
    padding: 0.75rem 1.5rem 1.25rem;
    border-top: 1px solid rgba(44,36,25,0.08);
    max-width: 1200px; margin: 0 auto;
  }
  .dark .lp-mobile-menu { border-top-color: rgba(255,255,255,0.06); }

  .lp-mobile-link {
    padding: 0.65rem 0.75rem; border-radius: 10px; font-size: 0.9rem;
    color: var(--color-bark); cursor: pointer; text-decoration: none;
    display: block; transition: background 0.15s;
  }
  .lp-mobile-link:hover { background: rgba(44,36,25,0.05); }
  .dark .lp-mobile-link { color: #F5F0E8; }
  .dark .lp-mobile-link:hover { background: rgba(255,255,255,0.05); }
  .lp-mobile-cta { background: var(--color-bark); color: var(--color-cream) !important; text-align: center; margin-top: 0.25rem; }
  .lp-mobile-cta:hover { background: var(--color-moss) !important; }
  .lp-mobile-logout { color: #ef4444 !important; }

  @media (max-width: 768px) {
    .lp-nav-inner { padding: 0 1.25rem; }
    .lp-nav-links { display: none; }
    .lp-nav-cta, .lp-nav-logout { display: none; }
    .lp-hamburger { display: flex; }
  }
`