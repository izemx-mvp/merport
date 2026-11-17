export function CurrentLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`current-lines ${className}`} viewBox="0 0 760 340" fill="none" aria-hidden="true">
      <path className="current-track" d="M-15 82H210L288 160H570L682 48H740" />
      <path className="current-track current-track-delay" d="M-15 155H163L258 250H520L638 132H740" />
      <path className="current-track current-track-slow" d="M-15 228H120L213 320H476L584 212H740" />
      <path d="M734 39L750 48L734 57M734 123L750 132L734 141M734 203L750 212L734 221" />
      <circle cx="211" cy="82" r="4" /><circle cx="258" cy="155" r="4" /><circle cx="213" cy="228" r="4" />
    </svg>
  );
}

export function CableCutaway({ className = "" }: { className?: string }) {
  return (
    <svg className={`cable-cutaway ${className}`} viewBox="0 0 440 440" fill="none" role="img" aria-label="Coupe technique d’un câble électrique">
      <circle className="cable-outer" cx="220" cy="220" r="198" />
      <circle className="cable-sheath" cx="220" cy="220" r="163" />
      <circle className="cable-fill" cx="220" cy="220" r="135" />
      <circle className="cable-core" cx="220" cy="220" r="92" />
      <circle className="cable-core-inner" cx="220" cy="220" r="53" />
      <path className="cable-label" d="M277 91 347 47M346 47h48M301 342l56 50m-57-50 3 21m-3-21 21 6" />
      <text x="356" y="41">Gaine</text><text x="365" y="416">Conducteur</text>
    </svg>
  );
}
