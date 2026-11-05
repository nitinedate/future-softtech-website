import { PageHero } from '../components/PageHero.jsx';
import { CtaBand } from '../components/CtaBand.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import heroImg from '../assets/images/about3.avif';
import communityImg from '../assets/images/project1.avif';
import legalImg from '../assets/images/project2.avif';

const PROJECTS = [
  {
    sector: 'Social sector and community development',
    title: 'Benefactor and beneficiary network',
    text: 'A platform concept to connect organizations and communities in need with donors, volunteers and resource partners. It is designed to make social initiatives easier to discover and support.',
    tags: ['Community platform', 'Resource matching', 'Education support'],
    img: communityImg,
    alt: 'A volunteer at a community event',
  },
  {
    sector: 'AI and legal technology',
    title: 'AI-assisted lawsuite',
    text: 'A legal workflow concept that uses AI to review case documents, organize supporting evidence and highlight relevant details to help teams prepare lawsuit materials.',
    tags: ['AI document review', 'Evidence organization', 'Legal workflow'],
    img: legalImg,
    alt: 'A statue of Lady Justice holding scales',
  },
  {
    sector: 'Biotechnology and research services',
    title: 'LABRYTH biotech services platform',
    text: 'An AI-powered biotech services platform that connects clients with lab partners and manages outsourced research requests, with secure data, analytics and reporting.',
    tags: ['Biotech services', 'Research workflows', 'Secure tracking'],
    img: 'https://images.unsplash.com/photo-1668600418417-aa0c6ed84e8c?auto=format&fit=crop&w=1600&q=80',
    alt: 'A laboratory technician working at a computer',
    source: 'https://unsplash.com/photos/a-person-in-a-lab-coat-working-on-a-computer-NGlXhrLxM54',
    link: 'https://labryth.ai/',
    linkLabel: 'Visit LABRYTH',
  },
  {
    sector: 'Digital forensics and cybersecurity',
    title: 'Polaron Forensic Suite',
    text: 'A digital investigation suite covering disk and mobile forensics, vulnerability assessment and malware detection to help teams examine evidence and identify security risks.',
    tags: ['Disk forensics', 'Mobile forensics', 'Vulnerability assessment', 'Malware detection'],
    img: 'https://images.unsplash.com/photo-1763799342720-363e8c925cdd?auto=format&fit=crop&w=1600&q=80',
    alt: 'A smartphone with fingerprints, representing mobile evidence examination',
    source: 'https://unsplash.com/photos/smudged-smartphone-screen-with-fingerprints-LudGc7_khfY',
  },
  {
    sector: 'Furniture business software',
    title: 'FurniSuite',
    text: 'A modular furniture business platform designed to streamline work from quotation through delivery. Developed in association with Teqnalyze.',
    tags: ['Furniture workflows', 'Quotation to delivery', 'Teqnalyze association'],
    img: 'https://images.unsplash.com/photo-1773754532196-014342510e64?auto=format&fit=crop&w=1600&q=80',
    alt: 'A modern living room with contemporary furniture',
    source: 'https://unsplash.com/photos/modern-living-room-with-stylish-furniture-and-large-windows-FL-ZcDK8tMo',
    link: 'https://furnisuite.teqnalyze.com/',
    linkLabel: 'Visit FurniSuite',
    partner: 'Developed in association with Teqnalyze',
  },
  {
    sector: 'Water application',
    title: 'Gushing Water Application',
    text: 'An application project in progress, developed in association with Teqnalyze. More project details will be added as work progresses.',
    tags: ['Application development', 'Teqnalyze association'],
    img: 'https://images.unsplash.com/photo-1779132237925-ce23f09862ea?auto=format&fit=crop&w=1600&q=80',
    alt: 'Water rushing beside a concrete dam structure',
    source: 'https://unsplash.com/photos/rushing-water-next-to-a-concrete-dam-structure-yZ57IUXZb9A',
    status: 'Work in progress',
    partner: 'Developed in association with Teqnalyze',
  },
];

export default function Projects() {
  usePageTitle('Projects');
  return (
    <>
      <PageHero
        title="Ideas shaped into useful systems."
        intro="A selection of products and concepts built to connect people, improve decisions and support practical work."
        image={{ src: heroImg, alt: 'A person using a tablet computer' }}
      />

      <section className="section">
        <div className="wrap project-grid">
          {PROJECTS.map((project) => (
            <article className="project" key={project.title}>
              <div className="project-image">
                <img src={project.img} alt={project.alt} width="800" height="500" loading="lazy" />
                {project.status && <span className="project-status">{project.status}</span>}
                {project.source && (
                  <a className="project-image-credit" href={project.source} target="_blank" rel="noreferrer">
                    Image source
                  </a>
                )}
              </div>
              <p className="project-sector">{project.sector}</p>
              <h2>{project.title}</h2>
              <p>{project.text}</p>
              {project.partner && <p className="project-partner">{project.partner}</p>}
              <ul className="tags" aria-label="Focus areas">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              {project.link && (
                <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                  {project.linkLabel} <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Let’s make the next idea practical."
        text="Tell us what you want to improve or create. We’ll help define a clear path from the first conversation to delivery."
      />
    </>
  );
}
