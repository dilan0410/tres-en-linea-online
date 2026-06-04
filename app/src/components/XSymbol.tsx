interface XSymbolProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function XSymbol({ size = 60, className = '', animated = true }: XSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={animated ? 'mark-x' : ''}
    >
      {/* Glow effect */}
      <defs>
        <filter id="xGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* First line */}
      <line
        x1="12"
        y1="12"
        x2="48"
        y2="48"
        stroke="#D93877"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#xGlow)"
        className={className}
      />
      {/* Second line */}
      <line
        x1="48"
        y1="12"
        x2="12"
        y2="48"
        stroke="#D93877"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#xGlow)"
        className={className}
      />
    </svg>
  );
}
