import { PageHero } from '../components/PageHero.jsx';
import { CtaBand } from '../components/CtaBand.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import heroImg from '../assets/images/photo4.avif';

const SERVICES = [
  {
    title: 'Software and product engineering',
    text: 'Custom web platforms, APIs and applications shaped around the way your organization works.',
    items: ['Custom applications', 'Backend APIs and microservices', 'System integration', 'Product development'],
  },
  {
    title: 'AI and intelligent automation',
    text: 'Intelligent features and automated processes that help teams make better use of their time.',
    items: ['AI and machine learning integration', 'Document workflows', 'Automation built around real use cases'],
  },
  {
    title: 'Cloud and infrastructure',
    text: 'Secure cloud foundations, system integration and reliable ongoing operations.',
    items: ['Cloud-native solutions', 'DevOps', 'Infrastructure management', 'Migration and performance optimization'],
  },
  {
    title: 'Quality and technology education',
    text: 'Testing that protects your releases, and training that connects learning with industry.',
    items: ['Quality assurance', 'Test automation', 'Hands-on training', 'Curriculum support and mentorship'],
  },
];

const STEPS = [
  { title: 'Align on the problem', text: 'We start by understanding the work, the people involved and what a good result looks like.' },
  { title: 'Shape the solution', text: 'We agree on scope and approach with your team before anything is built.' },
  { title: 'Deliver in reviewable steps', text: 'You see working progress regularly and can steer it as it takes shape.' },
  { title: 'Keep it dependable', text: 'After launch we help maintain, monitor and improve what we built together.' },
];

export default function Services() {
  usePageTitle('Services');
  return (
    <>
      <PageHero
        title="Technology for the work ahead."
        intro="From custom products to cloud operations and practical training, we bring the right expertise around your goals."
        image={{ src: heroImg, alt: 'Close-up of a processor mounted on a motherboard' }}
      />

      <section className="section">
        <div className="wrap">
          <div className="service-list">
            {SERVICES.map((service) => (
              <article className="service-row" key={service.title}>
                <h3>{service.title}</h3>
                <div>
                  <p>{service.text}</p>
                  <ul className="diamond-list">
                    {service.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="wrap">
          <div className="section-head">
            <h2>Clear scope. Careful delivery. Ongoing support.</h2>
            <p>Every engagement follows the same four steps, whatever its size.</p>
          </div>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li className="step" key={step.title}>
                <span className="step-num" aria-hidden="true">{index + 1}</span>
                <h3><span className="visually-hidden">Step {index + 1}: </span>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="One partner across the technology journey."
        text="Bring us a focused challenge or a broader transformation. We’ll help you find a practical starting point."
        label="Discuss your requirements"
      />
    </>
  );
}
