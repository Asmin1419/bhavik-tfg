export function TFGMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TFG"
    >
      <rect width="40" height="40" rx="4" fill="#421F44" />
      <text
        x="50%"
        y="44%"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="600"
        fontSize="14"
        fill="#F7F4EE"
      >
        T F
      </text>
      <text
        x="50%"
        y="78%"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="600"
        fontSize="14"
        fill="#F7F4EE"
      >
        G
      </text>
    </svg>
  );
}
