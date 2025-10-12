const CircuitPattern = ({ className }) => (

    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 10 0 L 10 10 M 0 10 L 20 10"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-current opacity-10"
          />
        </pattern>
        <rect x="0" y="0" width="100" height="100" fill="url(#circuit)" />
      </svg>
    </div>
  );
  export default CircuitPattern;