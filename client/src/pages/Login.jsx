import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DiamondTiles } from '../components/Diamond.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import deviceImg from '../assets/images/contact1.avif';
import codeImg from '../assets/images/photo1.avif';

export default function Login() {
  usePageTitle('Client login');
  const { user, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Only return to paths on this site, never to an outside address.
  const from = location.state?.from;
  const destination =
    typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/workspace';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!checking && user) return <Navigate to={destination} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password, remember);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-aside">
        <div>
          <h2>Your client portal.</h2>
          <p>
            Sign in with the email address your Future SoftTech team registered for you. Accounts are
            created by our team, so there is no sign-up form.
          </p>
        </div>
        <DiamondTiles
          assemble
          large={{ src: deviceImg, alt: 'A phone and laptop on a desk' }}
          small={{ src: codeImg, alt: 'Code on a laptop screen' }}
        />
      </aside>

      <div className="login-main">
        <div className="login-form">
          <h1>Sign in</h1>
          <p>Welcome back. Enter your details to continue.</p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert" role="alert">
                {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error) && !email.trim()}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(error) && !password}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-controls="login-password"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Keep me signed in for 30 days
            </label>

            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="login-help">
            Forgotten your password or need an account? <Link to="/contact">Contact our team</Link> and we’ll
            set it up for you.
          </p>
        </div>
      </div>
    </div>
  );
}
