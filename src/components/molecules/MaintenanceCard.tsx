import React from "react";
import { MaintenanceService } from "../../types";
import { formatCOP } from "../../utils/formatters";
import Icon from "../atoms/Icon";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

interface MaintenanceCardProps {
  service: MaintenanceService;
  onBook: (service: MaintenanceService) => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ service, onBook }) => {
  return (
    <article
      className={`
        relative flex flex-col bg-white border transition-all duration-300 rounded-sm overflow-hidden text-left
        ${
          service.popular
            ? "border-[#ffd400] shadow-xl ring-2 ring-[#ffd400]/40 -translate-y-1"
            : "border-[#dedfd9] hover:border-black/30 hover:shadow-lg hover:-translate-y-0.5"
        }
      `}
    >
      {service.popular && (
        <div className="absolute top-0 right-0 bg-[#ffd400] text-[#11120f] font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 z-10">
          Servicio Recomendado
        </div>
      )}

      {/* Imagen representativa del servicio */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <Badge variant="dark" size="sm">
            {service.category}
          </Badge>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300">
            <Icon name="clock" size={13} /> {service.duration}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] tracking-tight mb-2">
          {service.name}
        </h3>

        <p className="text-xs text-[#6d6f69] leading-relaxed mb-4">
          {service.summary}
        </p>

        {/* Lista de lo que incluye */}
        <div className="mt-2 mb-6 space-y-2 border-t border-[#dedfd9] pt-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#11120f] block">
            Protocolo de Taller Incluido:
          </span>
          <ul className="space-y-1.5 text-xs text-[#333]">
            {service.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#167648] mt-0.5 shrink-0">
                  <Icon name="check" size={13} />
                </span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer de Tarjeta con Precio y Botón */}
        <div className="mt-auto pt-4 border-t border-[#dedfd9] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#777a71] block">
              Inversión estimada
            </span>
            <span className="font-['Barlow_Condensed'] font-bold text-2xl text-[#11120f]">
              {formatCOP(service.price)}
            </span>
          </div>

          <Button
            variant={service.popular ? "primary" : "dark"}
            size="sm"
            onClick={() => onBook(service)}
            icon={<Icon name="calendar" size={14} />}
            iconPosition="left"
          >
            Agendar
          </Button>
        </div>
      </div>
    </article>
  );
};

export default MaintenanceCard;
