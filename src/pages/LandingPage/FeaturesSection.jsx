function FeaturesSection() {
  const features = [
    { icon: '🥗', title: 'Smart Meal Logging', desc: 'Snap a photo and our AI identifies ingredients, portions, and macros in seconds.' },
    { icon: '📊', title: 'Deep Nutrition Insights', desc: 'Weekly and monthly trends across 50+ nutrients — not just calories.' },
    { icon: '🎯', title: 'Personalised Goals', desc: 'Goals that adapt as you progress, powered by real metabolic data.' },
    { icon: '💧', title: 'Hydration Tracker', desc: 'Log water intake and stay hydrated throughout the day.' },
    { icon: '🏃', title: 'Activity Integration', desc: 'Sync with fitness apps to track calories burned.' },
    { icon: '📈', title: 'Progress Reports', desc: 'Detailed PDF reports of your health journey.' },
  ]

  return (
    <section className="lp-features">
      <div className="lp-features-header">
        <h2>Powerful Features</h2>
        <p>Everything you need to track your health journey</p>
      </div>
      <div className="lp-features-grid">
        {features.map((f, i) => (
          <div className="lp-feature" key={i}>
            <div className="lp-feature-icon">{f.icon}</div>
            <h3 className="lp-feature-title">{f.title}</h3>
            <p className="lp-feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection