interface OSymbolProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function OSymbol({ size = 60, className = '', animated = true }: OSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={animated ? 'mark-o' : ''}
    >
      {/* Glow effect */}
      <defs>
        <filter id="oGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="30"
        cy="30"
        r="20"
        stroke="#E4A11B"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        filter="url(#oGlow)"
        className={className}
      />
    </svg>
  );
}
