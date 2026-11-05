import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
    : null;

export default function Workspace() {
  usePageTitle('Your workspace');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const firstName = user.fullName.split(' ')[0];

  const handleSignOut = async () => {
    setSigningOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageHero compact title={`Welcome, ${firstName}.`} intro={`You’re signed in as ${user.email}.`} />

      <section className="section section--mist">
        <div className="wrap workspace-grid">
          <div className="panel">
            <h2>Your account</h2>
            <dl className="account-list">
              <div><dt>Name</dt><dd>{user.fullName}</dd></div>
              <div><dt>Email</dt><dd>{user.email}</dd></div>
              <div>
                <dt>Previous sign-in</dt>
                <dd>{formatDate(user.previousLoginAt) ?? 'This is your first sign-in.'}</dd>
              </div>
            </dl>
            <div className="button-row">
              <button className="button button--outline" type="button" onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>

          <div className="panel">
            <h2>Need help?</h2>
            <p>
              For project questions, a password change or access for a colleague, contact your Future SoftTech team.
            </p>
            <div className="button-row">
              <Link className="button" to="/contact">Contact our team</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
