/**
 * Reusable Card component with themed styling.
 *
 * @param {boolean} bordered - Add a subtle border
 * @param {"sm"|"md"|"lg"|"xl"} radius - Border radius size
 * @param {boolean} hover - Add hover shadow effect
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children
 */
function Card({
  bordered = false,
  radius = "lg",
  hover = false,
  className = "",
  children,
  ...props
}) {
  const radiusClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-[var(--radius-lg)]",
    xl: "rounded-[var(--radius-xl)]",
  };

  const classes = [
    "bg-parchment shadow-card transition-shadow duration-250",
    bordered ? "border border-warm-beige" : "",
    hover ? "hover:shadow-card-hover" : "",
    radiusClasses[radius],
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;
