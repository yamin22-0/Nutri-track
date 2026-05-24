import { useState, useEffect } from 'react'

function Navbar({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isLoggedIn = localStorage.getItem('token')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className={['lp-nav', scrolled ? 'scrolled' : ''].join(' ')}>
      <div className="lp-nav-inner">

        {/* LOGO */}
        <div
          className="lp-logo"
          onClick={() => (window.location.href = '/')}
          style={{ cursor: 'pointer' }}
        >
          <div className="lp-logo-mark">♥</div>
          <span 
            className="lp-logo-text"
            style={{ 
              color: theme === 'dark' ? '#F5F0E8' : '#2C2419'
            }}
          >
            NutriTrack
          </span>
        </div>

        {/* DESKTOP CENTRE LINKS - When NOT logged in (Landing Page) */}
        {!isLoggedIn ? (
          <div className="lp-nav-links">
            <span className="lp-nav-link" onClick={() => scrollToSection('home')}>Home</span>
            <span className="lp-nav-link" onClick={() => scrollToSection('features')}>Features</span>
            <span className="lp-nav-link" onClick={() => scrollToSection('how-it-works')}>How It Works</span>
            <span className="lp-nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
            <span className="lp-nav-link" onClick={() => scrollToSection('pricing')}>Pricing</span>
            <span className="lp-nav-link" onClick={() => scrollToSection('contact')}>Contact</span>
          </div>
        ) : (
          /* DESKTOP CENTRE LINKS - When logged in */
          <div className="lp-nav-links">
            <span className="lp-nav-link" onClick={() => (window.location.href = '/dashboard')}>
              Dashboard
            </span>
            <span className="lp-nav-link" onClick={() => (window.location.href = '/food-log')}>
              Food Log
            </span>
            <span className="lp-nav-link" onClick={() => (window.location.href = '/my-food-list')}>
              My Food List
            </span>
            <span className="lp-nav-link" onClick={() => (window.location.href = '/analytics')}>
              Analytics
            </span>
            <span className="lp-nav-link" onClick={() => (window.location.href = '/goals')}>
              Goals
            </span>
            <span className="lp-nav-link" onClick={() => (window.location.href = '/profile')}>
              Profile
            </span>
          </div>
        )}

        {/* DESKTOP RIGHT */}
        <div className="lp-nav-right">
          {!isLoggedIn ? (
            <>
              <button
                className="lp-nav-link"
                onClick={() => (window.location.href = '/login')}
                style={{ background: 'transparent', padding: '0.55rem 0' }}
              >
                Login
              </button>
              <button
                className="lp-nav-cta"
                onClick={() => (window.location.href = '/register')}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button className="lp-nav-logout" onClick={handleLogout}>
              Logout
            </button>
          )}

          {/* Theme toggle */}
          <button className="lp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="lp-hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lp-mobile-menu">
          {!isLoggedIn ? (
            <>
              <span className="lp-mobile-link" onClick={() => scrollToSection('home')}>Home</span>
              <span className="lp-mobile-link" onClick={() => scrollToSection('features')}>Features</span>
              <span className="lp-mobile-link" onClick={() => scrollToSection('how-it-works')}>How It Works</span>
              <span className="lp-mobile-link" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
              <span className="lp-mobile-link" onClick={() => scrollToSection('pricing')}>Pricing</span>
              <span className="lp-mobile-link" onClick={() => scrollToSection('contact')}>Contact</span>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/login')}>Login</span>
              <span className="lp-mobile-link lp-mobile-cta" onClick={() => (window.location.href = '/register')}>Sign Up</span>
            </>
          ) : (
            <>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/dashboard')}>Dashboard</span>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/food-log')}>Food Log</span>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/my-food-list')}>My Food List</span>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/analytics')}>Analytics</span>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/goals')}>Goals</span>
              <span className="lp-mobile-link" onClick={() => (window.location.href = '/profile')}>Profile</span>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
              <span className="lp-mobile-link lp-mobile-logout" onClick={handleLogout}>Logout</span>
            </>
          )}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
          <span className="lp-mobile-link" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>
      )}
    </nav>
  )
}

export default Navbar