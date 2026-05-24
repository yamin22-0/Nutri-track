function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Tell us your goals, dietary preferences, and current health metrics. Takes under 2 minutes.',
      icon: '👤',
    },
    {
      num: '02',
      title: 'Log Your Meals',
      desc: 'Snap a photo or search our database of 2M+ foods. AI fills in the nutrition details automatically.',
      icon: '📸',
    },
    {
      num: '03',
      title: 'Track & Adjust',
      desc: 'See real-time feedback on your macros, calories, and nutrients. Get smart suggestions to hit your goals.',
      icon: '📊',
    },
    {
      num: '04',
      title: 'See Results',
      desc: 'Watch your progress week over week. Celebrate milestones and stay motivated with personalised insights.',
      icon: '🏆',
    },
  ]

  return (
    <section className="hiw-section" id="how-it-works">
      <div className="hiw-inner">
        <div className="hiw-header">
          <span className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Simple Process
          </span>
          <h2 className="hiw-title">
            Up and running in <em>four steps</em>
          </h2>
          <p className="hiw-desc">
            No complicated setup. No confusing dashboards. Just results.
          </p>
        </div>

        <div className="hiw-steps">
          {steps.map((step, i) => (
            <div className="hiw-card" key={i}>
              <div className="hiw-card-top">
                <span className="hiw-card-num">{step.num}</span>
                <div className="hiw-card-icon">{step.icon}</div>
              </div>
              <h3 className="hiw-card-title">{step.title}</h3>
              <p className="hiw-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection