function ContactSection() {
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-card">
          <div className="section-header">
            <h2 className="section-title">Let’s <em>talk</em> health</h2>
            <p className="section-desc">Have questions or feedback? We’d love to hear from you.</p>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <input type="text" placeholder="Your Name" className="contact-input" />
              <input type="email" placeholder="Email Address" className="contact-input" />
            </div>
            <textarea placeholder="How can we help?" className="contact-input" rows="4"></textarea>
            <button type="submit" className="contact-btn">Send Message</button>
          </form>
        </div>
      </div>

      <style>{`
        .contact-section { padding: 6rem 2rem; background: var(--color-cream); }
        .dark .contact-section { background: #0f0f0f; }
        .container { max-width: 900px; margin: 0 auto; }
        
        .contact-card {
          background: #fff;
          padding: 4rem;
          border-radius: 40px;
          border: 1px solid rgba(44,36,25,0.08);
          box-shadow: 0 30px 60px rgba(44,36,25,0.04);
        }
        .dark .contact-card { background: #1a1a1a; border-color: rgba(255,255,255,0.07); }

        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 2.8rem);
          color: var(--color-bark);
          margin-bottom: 1rem;
        }
        .dark .section-title { color: #F5F0E8; }
        .section-title em { font-style: italic; color: var(--color-moss); }
        
        .section-desc { color: var(--color-warm-mid); }

        .contact-form { display: flex; flex-direction: column; gap: 1rem; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .contact-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          border: 1.5px solid rgba(44,36,25,0.1);
          background: #F9F7F2;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s;
        }
        .dark .contact-input { background: #252525; border-color: rgba(255,255,255,0.1); color: #F5F0E8; }
        
        .contact-input:focus { border-color: var(--color-moss); }

        .contact-btn {
          background: var(--color-bark);
          color: white;
          padding: 1rem;
          border-radius: 100px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.2s;
        }
        .dark .contact-btn { background: var(--color-moss); }
        .contact-btn:hover { opacity: 0.9; }

        @media (max-width: 768px) {
          .contact-card { padding: 2.5rem 1.5rem; border-radius: 28px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}

export default ContactSection