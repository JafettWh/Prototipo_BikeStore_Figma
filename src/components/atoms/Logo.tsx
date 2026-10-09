import React from "react";

interface LogoProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light"; // added variant for theme styling
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  onClick,
  size = "md",
  variant = "light",
  className = "",
}) => {
  const heights = {
    sm: "h-9",
    md: "h-12 sm:h-14",
    lg: "h-14 sm:h-16",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center bg-transparent border-0 p-0 text-left cursor-pointer transition-transform duration-200 hover:scale-[1.03] focus:outline-none ${className}`}
      aria-label="BikeStore - Ir al inicio"
    >
      <img
        src="/assets/logo.png"
        alt="BikeStore"
        className={`${heights[size]} w-auto object-contain select-none transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:drop-shadow-[0_4px_12px_rgba(255,212,0,0.3)]`}
        style={{
          filter: "contrast(1.08)",
        }}
      />
    </button>
  );
};

export default Logo;
