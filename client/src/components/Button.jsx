/**
 * Reusable Button component with themed variants.
 *
 * @param {"primary"|"secondary"|"ghost"|"dark"|"outline"} variant
 * @param {"sm"|"md"|"lg"} size
 * @param {boolean} fullWidth
 * @param {React.ReactNode} children
 * @param {function} onClick
 * @param {boolean} disabled
 * @param {string} className
 * @param {string} type
 */
function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-terracotta text-white hover:bg-burnt-umber hover:shadow-card-hover focus:ring-terracotta/50",
    secondary:
      "bg-deep-brown text-white hover:bg-burnt-umber hover:shadow-card-hover focus:ring-deep-brown/50",
    dark: "bg-charcoal text-white hover:bg-deep-brown hover:shadow-card-hover focus:ring-charcoal/50",
    ghost:
      "bg-transparent text-terracotta hover:bg-warm-beige focus:ring-terracotta/30",
    outline:
      "border border-terracotta text-terracotta bg-transparent hover:bg-terracotta hover:text-white focus:ring-terracotta/50",
  };

  const sizes = {
    sm: "px-4 py-2 rounded-md text-sm",
    md: "px-6 py-3 rounded-full text-base",
    lg: "px-8 py-4 rounded-full text-lg font-semibold",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "lg" ? 20 : size === "sm" ? 15 : 18} />}
      {children}
    </button>
  );
}

export default Button;
