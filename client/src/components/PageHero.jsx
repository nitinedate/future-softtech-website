import { DiamondPair } from './Diamond.jsx';

export function PageHero({ title, intro, image, compact = false }) {
  return (
    <section className={`page-hero ${compact ? 'page-hero--compact' : ''}`}>
      <div className="wrap page-hero-inner">
        <div>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
        {image && <DiamondPair image={image} />}
      </div>
    </section>
  );
}
