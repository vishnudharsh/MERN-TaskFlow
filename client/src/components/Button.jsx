import clsx from "clsx";

export default function Button({ 
  type = "button", 
  className, 
  label, 
  icon, 
  onClick,
  disabled = false 
}) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}