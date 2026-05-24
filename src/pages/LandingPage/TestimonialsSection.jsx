function TestimonialsSection() {
  const testimonials = [
    {
      initials: 'AK',
      name: 'Amara Kwame',
      role: 'Marathon runner, Lagos',
      quote:
        'NutriTrack made me realise I had been under-eating protein for years. Lost 12 kg in four months — and actually enjoyed the process.',
      color: '#97C459',
    },
    {
      initials: 'SP',
      name: 'Siosaia Pulu',
      role: 'Personal trainer, Auckland',
      quote:
        'I recommend NutriTrack to every single one of my clients. The macro breakdown is the most accurate I have ever seen in a free app.',
      color: '#3B6D11',
    },
    {
      initials: 'MN',
      name: 'Miriam Njoroge',
      role: 'Nutritionist, Nairobi',
      quote:
        'As a professional I am picky about nutrition data. NutriTrack\'s database is comprehensive and the AI logging saves my clients hours every week.',
      color: '#C0DD97',
    },
  ]

  return (
    <section className="testi-section" id="testimonials">
      <div className="testi-inner">
        <div className="testi-header">
          <span className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Real Stories
          </span>
          <h2 className="testi-title">
            Loved by <em>1 million+</em><br />health enthusiasts
          </h2>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
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

export default TestimonialsSection