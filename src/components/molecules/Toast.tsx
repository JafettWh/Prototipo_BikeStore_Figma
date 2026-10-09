import React from "react";
import Icon from "../atoms/Icon";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  actionLabel,
  onAction,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-[120] flex items-center gap-3.5 bg-[#161713] text-white px-5 py-3.5 shadow-2xl border border-white/10 rounded-sm animate-bounce-short text-xs"
      style={{ animation: "toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="w-7 h-7 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center shrink-0">
        {type === "success" && <Icon name="check" size={15} />}
        {type === "error" && <Icon name="alert-triangle" size={15} />}
        {type === "info" && <Icon name="sparkles" size={15} />}
      </span>

      <span className="font-medium tracking-wide text-gray-200">{message}</span>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="ml-2 text-[#ffd400] underline font-bold uppercase text-[10px] tracking-wider hover:text-white transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          className="ml-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;
