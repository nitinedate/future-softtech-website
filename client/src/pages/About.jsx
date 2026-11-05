import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero.jsx';
import { CtaBand } from '../components/CtaBand.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import heroImg from '../assets/images/about2.avif';
import purposeImg from '../assets/images/about4.avif';
import nitinImg from '../assets/images/nitin_edate_photo.jpg';
import narayanImg from '../assets/images/narayan_edate_photo.jpg';

const VALUES = [
  { title: 'Thoughtful by design', text: 'We start from the real need and choose the simplest approach that can meet it well.' },
  { title: 'Built with care', text: 'Security, quality and maintainability are part of the work from the beginning.' },
  { title: 'Here for the long run', text: 'We value clear communication and relationships that continue beyond launch.' },
];

const TEAM = [
  {
    name: 'Nitin Edate',
    role: 'Founder and Tech Lead',
    img: nitinImg,
    bio: 'Technology leader with over 18 years of experience, primarily in the financial domain, spanning product development, infrastructure and automation.',
  },
  {
    name: 'Narayan Edate',
    role: 'Legal Consultant and Advisor',
    img: narayanImg,
    bio: 'Legal professional bringing more than 50 years of experience and guidance to the team’s work.',
  },
];

export default function About() {
  usePageTitle('About');
  return (
    <>
      <PageHero
        title="Technology with a human perspective."
        intro="We help businesses and learners make confident use of technology through thoughtful engineering, practical advice and long-term partnership."
        image={{ src: heroImg, alt: 'A team planning together at a whiteboard' }}
      />

      <section className="section section--mist">
        <div className="wrap">
          <figure className="quote">
            <blockquote>
              “The best solutions begin with listening, then make everyday work simpler.”
            </blockquote>
            <figcaption>Our approach</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Strong foundations. Honest collaboration. Useful outcomes.</h2>
          </div>
          <div className="feature-grid feature-grid--3">
            {VALUES.map((v) => (
              <article className="feature" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="wrap">
          <div className="section-head">
            <h2>Experience that stays close to the work.</h2>
          </div>
          <div className="team-grid">
            {TEAM.map((person) => (
              <article className="person" key={person.name}>
                <img src={person.img} alt={`Portrait of ${person.name}`} width="168" height="196" loading="lazy" />
                <div>
                  <h3>{person.name}</h3>
                  <p className="role">{person.role}</p>
                  <p>{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <img src={purposeImg} alt="People working together at laptops around a shared table" width="1200" height="800" loading="lazy" />
          <div>
            <h2>Make technology more capable and more accessible.</h2>
            <p>
              We bridge traditional systems and modern platforms through software, AI, cloud and learning
              experiences that help people and organizations keep growing.
            </p>
            <Link className="text-link" to="/services">Explore our services</Link>
          </div>
        </div>
      </section>

      <CtaBand title="Want to work with us?" text="Tell us what you’re planning and we’ll set up a conversation." />
    </>
  );
}
