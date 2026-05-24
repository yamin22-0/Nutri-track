function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      desc: 'Perfect for getting started with nutrition tracking.',
      features: [
        'Up to 3 meals logged per day',
        'Basic calorie tracking',
        'Food database access',
        '7-day history',
      ],
      cta: 'Get Started Free',
      href: '/register',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '9',
      period: 'per month',
      desc: 'For serious health enthusiasts who want deep insights.',
      features: [
        'Unlimited meal logging',
        'AI photo recognition',
        '50+ nutrient tracking',
        'Unlimited history & reports',
        'Goal adaptation engine',
        'Priority support',
      ],
      cta: 'Start Pro Free',
      href: '/register?plan=pro',
      highlight: true,
    },
    {
      name: 'Team',
      price: '29',
      period: 'per month',
      desc: 'For coaches and nutritionists managing multiple clients.',
      features: [
        'Everything in Pro',
        'Up to 10 client accounts',
        'Client progress dashboard',
        'PDF report generation',
        'Custom branding',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      highlight: false,
    },
  ]

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-inner">
        <div className="pricing-header">
          <span className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Simple Pricing
          </span>
          <h2 className="pricing-title">
            No surprises,<br /><em>no hidden fees</em>
          </h2>
          <p className="pricing-desc">
            Start free forever. Upgrade when you're ready.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div
              className={`pricing-card ${plan.highlight ? 'pricing-card--highlight' : ''}`}
              key={i}
            >
              {plan.highlight && (
                <div className="pricing-badge">Most Popular</div>
              )}
              <div className="pricing-plan-name">{plan.name}</div>
              <div className="pricing-price">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-period">/{plan.period}</span>
              </div>
              <p className="pricing-plan-desc">{plan.desc}</p>
              <ul className="pricing-features">
                {plan.features.map((f, j) => (
                  <li key={j} className="pricing-feature-item">
                    <span className="pricing-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`pricing-cta ${plan.highlight ? 'pricing-cta--highlight' : ''}`}
                onClick={() => (window.location.href = plan.href)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection