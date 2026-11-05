import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/images/logo.png';

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

// The header is position: fixed (see .site-header in app.css), so the logo and
// menu stay in exactly the same place while the page scrolls underneath.
export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A soft shadow appears once content scrolls beneath the header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu after navigating, or if the window grows to desktop width.
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const onChange = (event) => event.matches && setMenuOpen(false);
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const account = user
    ? { to: '/workspace', label: 'Your workspace' }
    : { to: '/login', label: 'Client login' };

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap header-inner">
          <Link className="brand" to="/" aria-label="Future SoftTech home">
            <img src={logo} alt="Future SoftTech" width="386" height="142" />
          </Link>

          <nav className="primary-nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link className="button button--small header-login" to={account.to}>
              {account.label}
            </Link>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile"
        hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
        <Link className="button" to={account.to}>
          {account.label}
        </Link>
      </nav>
    </>
  );
}
