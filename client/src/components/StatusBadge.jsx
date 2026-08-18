/**
 * Reusable StatusBadge component for order statuses.
 *
 * Supports all backend statuses:
 *   pending | confirmed | in production | completed | delivered
 *
 * @param {string} status
 * @param {string} className
 */
function StatusBadge({ status, className = "" }) {
  const statusConfig = {
    pending: {
      bg: "bg-sage-light",
      text: "text-deep-brown",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-warm-beige",
      text: "text-terracotta",
      label: "Confirmed",
    },
    "in production": {
      bg: "bg-warm-beige",
      text: "text-terracotta",
      label: "In Production",
    },
    completed: {
      bg: "bg-sage",
      text: "text-white",
      label: "Completed",
    },
    delivered: {
      bg: "bg-deep-brown",
      text: "text-gold-accent",
      label: "Delivered",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`
        inline-flex
        items-center
        px-4
        py-2
        rounded-full
        text-sm
        font-medium
        transition-colors
        ${config.bg}
        ${config.text}
        ${className}
      `}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;
