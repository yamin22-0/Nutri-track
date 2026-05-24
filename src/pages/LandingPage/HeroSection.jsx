function HeroSection() {
  return (
    <section className="lp-hero" id="home">
      <div className="lp-hero-left">
        <div className="lp-eyebrow">
          <span className="lp-eyebrow-dot" />
          AI-Powered Health Tracking
        </div>
        <h1 className="lp-h1">
          Track Your<br />
          <em>Health</em><br />
          Journey
        </h1>
        <p className="lp-desc">
          Monitor calories, track meals, and achieve your fitness goals with NutriTrack.
          Join over 1 million happy users living their healthiest lives.
        </p>
        <div className="lp-actions">
          <button className="lp-btn-primary" onClick={() => window.location.href = "/register"}>
            Get Started Free
          </button>
          <button className="lp-btn-ghost" onClick={() => window.location.href = "/login"}>
            Sign In
          </button>
        </div>
        <div className="lp-stats">
          <div>
            <div className="lp-stat-num">1M+</div>
            <div className="lp-stat-label">Active Users</div>
          </div>
          <div>
            <div className="lp-stat-num">50M+</div>
            <div className="lp-stat-label">Meals Tracked</div>
          </div>
          <div>
            <div className="lp-stat-num">4.9★</div>
            <div className="lp-stat-label">App Rating</div>
          </div>
        </div>
      </div>
      <div className="lp-hero-right">
        <img
          className="lp-hero-img"
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=900&fit=crop"
          alt="Healthy food and nutrition"
        />
        <div className="lp-hero-overlay" />
        <div className="lp-deco-line" />
        <div className="lp-float-pill">✦ New AI Meal Scan</div>
        <div className="lp-hero-badge">
          <div className="lp-badge-label">Today's Goal</div>
          <div className="lp-badge-num">1,840</div>
          <div className="lp-badge-sub">of 2,000 kcal</div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection