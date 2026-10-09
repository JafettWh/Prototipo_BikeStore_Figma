import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "yellow" | "green" | "red" | "dark" | "outline" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "yellow",
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    yellow: "bg-[#ffd400] text-[#11120f] font-extrabold",
    green: "bg-[#dff4e9] text-[#167648] font-bold border border-[#b2e2cb]",
    red: "bg-[#fee2e2] text-[#b91c1c] font-bold border border-[#fca5a5]",
    dark: "bg-[#161713] text-[#ffd400] font-bold border border-[#333]",
    outline: "border border-[#dedfd9] text-[#6d6f69] bg-white font-medium",
    blue: "bg-[#e0f2fe] text-[#0369a1] font-bold border border-[#bae6fd]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[9px] tracking-wider uppercase",
    md: "px-2.5 py-1 text-[10px] tracking-wider uppercase",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
