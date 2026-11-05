import { useState } from 'react';
import { PageHero } from '../components/PageHero.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import heroImg from '../assets/images/contact2.avif';

const SUPPORT_EMAIL = 'support@future-softtech.co.in';
const MAP_URL = 'https://maps.google.com/?q=Office+No+200+Arenja+Corner+Sector+17+Vashi+Navi+Mumbai';

export default function Contact() {
  usePageTitle('Contact');
  const [status, setStatus] = useState('');

  // The form prepares an email in the visitor's own mail app; nothing is sent
  // from the website itself.
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(data.get('subject') || 'Website enquiry');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`,
    );
    setStatus('Your email app should open with this message ready to send.');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageHero
        title="Let’s talk about what you’re building."
        intro="Tell us about your idea, a technology challenge or the kind of support you need. We’ll help you find a practical next step."
        image={{ src: heroImg, alt: 'A bright, modern office corridor' }}
      />

      <section className="section section--mist">
        <div className="wrap contact-layout">
          <form className="panel" onSubmit={handleSubmit}>
            <h2>Send us a message</h2>
            <p>This opens a ready-to-send email in your own email app.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field full">
                <label htmlFor="subject">What can we help with?</label>
                <input id="subject" name="subject" required />
              </div>
              <div className="field full">
                <label htmlFor="message">A few details</label>
                <textarea id="message" name="message" required placeholder="Your goals, timeline or the challenge you’re facing" />
              </div>
            </div>
            <button className="button" type="submit">Open email draft</button>
            <p className="form-status" aria-live="polite">{status}</p>
          </form>

          <div className="contact-details">
            <h2>Contact details</h2>
            <div className="detail">
              <h3>Visit</h3>
              <p>Office No. 200, Arenja Corner<br />Sector 17, Vashi, Navi Mumbai<br />Maharashtra 400703, India</p>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cobalt)', textDecoration: 'underline' }}>
                Open map directions
              </a>
            </div>
            <div className="detail">
              <h3>Email</h3>
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
            <div className="detail">
              <h3>Call</h3>
              <a href="tel:+919326560882">+91 93265 60882</a>
              <a href="tel:+912244816022">+91 22 4481 6022</a>
              <p className="muted">Monday to Saturday, 9:00 AM to 8:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
