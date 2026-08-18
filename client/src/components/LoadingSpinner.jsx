function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizeClasses[size]}
          border-4
          border-sage-light
          border-t-terracotta
          rounded-full
          animate-spin
        `}
      />

      <p className="text-sage">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
