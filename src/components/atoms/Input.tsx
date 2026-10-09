import React, { useState } from "react";
import Icon from "./Icon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  showTogglePassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  className = "",
  id,
  type = "text",
  showTogglePassword = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const actualType = isPasswordField && showPassword ? "text" : type;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
          {isPasswordField && (
            <span className="text-[9px] font-semibold text-[#888]">
              (Mínimo 8 caracteres)
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-[#6d6f69] pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={actualType}
          className={`
            w-full h-12 bg-white border text-xs px-3.5 transition-colors
            placeholder:text-[#999] focus:outline-none focus:border-[#ffd400] focus:ring-2 focus:ring-[#ffd400]/40
            ${icon ? "pl-10" : ""}
            ${isPasswordField && showTogglePassword ? "pr-11" : ""}
            ${error ? "border-red-500 ring-1 ring-red-500" : "border-[#dedfd9]"}
            ${className}
          `}
          {...props}
        />

        {isPasswordField && showTogglePassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            className="absolute right-3 p-1.5 text-[#777] hover:text-[#11120f] transition-colors bg-transparent border-0 cursor-pointer flex items-center justify-center"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
          </button>
        )}
      </div>

      {error && <span className="text-[10px] text-red-600 font-medium">{error}</span>}
      {helper && !error && (
        <span className="text-[10px] text-[#6d6f69]">{helper}</span>
      )}
    </div>
  );
};

export default Input;
