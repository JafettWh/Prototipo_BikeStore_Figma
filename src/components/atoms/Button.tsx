import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-[10px] gap-1.5",
    md: "h-12 px-6 text-[11px] gap-2.5",
    lg: "h-14 px-8 text-xs gap-3",
  };

  const variantStyles = {
    primary:
      "bg-[#ffd400] text-[#11120f] border border-[#ffd400] hover:bg-[#ffe048] hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow",
    secondary:
      "bg-transparent text-white border border-[#777] hover:border-white hover:bg-white/10",
    dark:
      "bg-[#11120f] text-white border border-[#11120f] hover:bg-[#252622] hover:-translate-y-0.5",
    outline:
      "bg-transparent text-[#11120f] border border-[#dedfd9] hover:border-[#11120f] hover:bg-black/5",
    danger:
      "bg-[#ef4444] text-white border border-[#ef4444] hover:bg-[#dc2626] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-current border-transparent hover:bg-black/5 p-2",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export default Button;
