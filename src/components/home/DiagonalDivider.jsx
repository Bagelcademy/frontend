const DiagonalDivider = ({ className }) => (
    <div className={`relative h-24 overflow-hidden ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polygon points="0,0 100,0 100,20 0,100" className="fill-current" />
      </svg>
    </div>
  );

  export default DiagonalDivider;