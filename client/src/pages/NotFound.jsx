import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <>
      <PageHero compact title="We can’t find that page." intro="The link may be out of date, or the address may have a typo." />
      <section className="section">
        <div className="wrap">
          <Link className="button" to="/">Go to the home page</Link>
        </div>
      </section>
    </>
  );
}
