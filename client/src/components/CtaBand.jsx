import { Link } from 'react-router-dom';

export function CtaBand({ title, text, to = '/contact', label = 'Talk to our team' }) {
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <div>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <Link className="button button--sky" to={to}>
          {label}
        </Link>
      </div>
    </section>
  );
}
