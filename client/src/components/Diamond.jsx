// Diamond-cropped imagery based on the rotated squares in the logo mark.

const Outline = ({ className }) => (
  <div className={`diamond diamond--outline ${className}`} aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="50,1 99,50 50,99 1,50" />
    </svg>
  </div>
);

// Four tiles: two photos on one diagonal, a solid and an outlined tile on the other.
export function DiamondTiles({ large, small, assemble = false, className = '' }) {
  return (
    <div className={`tiles ${assemble ? 'assemble' : ''} ${className}`}>
      <div className="diamond t-a">
        <img src={large.src} alt={large.alt} width="540" height="540" fetchPriority="high" />
      </div>
      <div className="diamond t-b">
        <img src={small.src} alt={small.alt} width="270" height="270" />
      </div>
      <div className="diamond diamond--solid t-c" aria-hidden="true" />
      <Outline className="t-d" />
    </div>
  );
}

// A single photo with a small solid tile, for the inner page headings.
export function DiamondPair({ image }) {
  return (
    <div className="tiles-pair">
      <div className="diamond p-a">
        <img src={image.src} alt={image.alt} width="320" height="320" />
      </div>
      <div className="diamond diamond--solid p-b" aria-hidden="true" />
    </div>
  );
}
