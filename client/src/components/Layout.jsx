import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout() {
  const { pathname } = useLocation();

  // Start each new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
