import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DiamondTiles } from '../components/Diamond.jsx';
import { CtaBand } from '../components/CtaBand.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import codeImg from '../assets/images/photo1.avif';
import teamImg from '../assets/images/photo3.avif';
import aiImg from '../assets/images/photo2.avif';

const SERVICES = [
  {
    title: 'Software engineering',
    text: 'Custom web platforms, APIs and applications shaped around the way your organization works.',
  },
  {
    title: 'AI and automation',
    text: 'Intelligent features and automated processes that help teams make better use of their time.',
  },
  {
    title: 'Cloud and infrastructure',
    text: 'Secure cloud foundations, system integration and reliable ongoing operations.',
  },
  {
    title: 'Technology education',
    text: 'Practical training, mentorship and curriculum support that connect learning with industry.',
  },
];

// The tile animation plays once per visit, not every time someone returns to Home.
let heroHasAssembled = false;

export default function Home() {
  usePageTitle('Software, AI and cloud solutions');
  const [assemble] = useState(() => !heroHasAssembled);
  useEffect(() => {
    heroHasAssembled = true;
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <h1>Build a future that works better.</h1>
            <p className="lead">
              Future SoftTech brings software engineering, AI, cloud and technology education together
              to help organizations solve real problems and move forward with confidence.
            </p>
            <div className="button-row">
              <Link className="button button--sky" to="/services">Explore our services</Link>
              <Link className="button button--ghost-light" to="/about">Meet the team</Link>
            </div>
          </div>
          <DiamondTiles
            assemble={assemble}
            large={{ src: codeImg, alt: 'Code on a laptop screen' }}
            small={{ src: teamImg, alt: 'A team working together around laptops' }}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Good technology starts with understanding the work.</h2>
            <p>
              We combine technical depth with practical thinking to make digital tools that are useful,
              dependable and ready to grow.
            </p>
          </div>
          <div className="feature-grid">
            {SERVICES.map((item) => (
              <article className="feature" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="wrap split">
          <img src={aiImg} alt="Illustration of artificial intelligence and connected systems" width="800" height="450" loading="lazy" />
          <div>
            <h2>Make complex technology feel clear.</h2>
            <p>
              From early planning to delivery and support, we work alongside your team and keep the focus
              on outcomes that matter.
            </p>
            <Link className="text-link" to="/projects">See selected projects</Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Your next step can start with a conversation."
        text="Share the challenge you are working through. We’ll help you explore a practical way forward."
      />
    </>
  );
}
