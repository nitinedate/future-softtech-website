import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <Link to="/" aria-label="Future SoftTech home">
            <img className="footer-logo" src={logo} alt="Future SoftTech" width="386" height="142" />
          </Link>
          <p className="footer-about">
            Practical software, AI and cloud solutions for organizations ready to grow with technology.
          </p>
        </div>
        <div className="footer-col">
          <h2>Explore</h2>
          <Link to="/about">About us</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Client login</Link>
        </div>
        <div className="footer-col">
          <h2>Get in touch</h2>
          <a href="mailto:support@future-softtech.co.in">support@future-softtech.co.in</a>
          <a href="tel:+919326560882">+91 93265 60882</a>
          <p>Office No. 200, Arenja Corner, Sector 17, Vashi, Navi Mumbai 400703</p>
        </div>
      </div>
      <div className="wrap">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Future SoftTech. All rights reserved.</span>
          <span>Engineering tomorrow’s intelligence.</span>
        </div>
      </div>
    </footer>
  );
}
