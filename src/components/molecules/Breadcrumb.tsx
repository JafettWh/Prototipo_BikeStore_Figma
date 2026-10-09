import React from "react";
import Icon from "../atoms/Icon";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-[#777a71] my-4">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-[#bbb]">/</span>}
          {item.active ? (
            <span className="font-bold text-[#11120f]">{item.label}</span>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className="bg-transparent border-0 p-0 text-inherit hover:text-[#ffd400] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
