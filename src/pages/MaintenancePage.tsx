import React from "react";
import { MaintenanceService, Page } from "../types";
import MaintenanceCard from "../components/molecules/MaintenanceCard";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";

interface MaintenancePageProps {
  services: MaintenanceService[];
  onOpenScheduleModal: (service?: MaintenanceService) => void;
  onOpenTrackingModal: () => void;
  onNavigate: (page: Page) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  services,
  onOpenScheduleModal,
  onOpenTrackingModal,
  onNavigate,
}) => {
  return (
    <main className="w-full text-left">
      {/* Banner Principal de Taller */}
      <section className="relative w-full bg-[#151613] text-white py-16 sm:py-24 border-b border-[#2d2e2b]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ffd400]/10 border border-[#ffd400]/40 text-[#ffd400] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
              <Icon name="wrench" size={14} /> Centro Técnico Oficial Shimano & SRAM
            </div>

            <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-5xl sm:text-7xl tracking-tight leading-[0.9] text-white mb-6">
              TALLER MECÁNICO <br />
              <span className="text-[#ffd400]">DE ALTO RENDIMIENTO</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-2xl">
              Cuidamos cada componente de tu bicicleta con herramientas especializadas Park Tool, desengrasantes ecológicos biodegradables y torquímetros digitales de precisión milimétrica.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenScheduleModal()}
                icon={<Icon name="calendar" size={18} />}
                iconPosition="left"
              >
                Agendar Mi Cita en Taller
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenTrackingModal}
                icon={<Icon name="clock" size={18} />}
                iconPosition="left"
              >
                Consultar Estado de Reparación
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Servicios y Tarifas */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#dedfd9] mb-10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Tarifas Transparentes 2026
            </span>
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-[#11120f] mt-1">
              Planes de Mantenimiento Preventivo y Correctivo
            </h2>
            <p className="text-xs sm:text-sm text-[#6d6f69] mt-1">
              Selecciona el paquete que mejor se adapte a tus kilómetros de rodada.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#167648] flex items-center gap-1.5 justify-end">
              <Icon name="check" size={16} /> Garantía de 30 días en todos los ajustes
            </span>
          </div>
        </div>

        {/* Tarjetas de Servicios con Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <MaintenanceCard
              key={service.id}
              service={service}
              onBook={(s: MaintenanceService) => onOpenScheduleModal(s)}
            />
          ))}
        </div>
      </section>

      {/* Por qué elegir nuestro Taller */}
      <section className="bg-[#f8f8f5] py-16 border-y border-[#dedfd9]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Estándar Profesional
            </span>
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl uppercase tracking-tight text-[#11120f] mt-1">
              ¿Por qué confiar tu bicicleta en BikeStore?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 border border-[#dedfd9] rounded-sm text-left shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-bold mb-4">
                <Icon name="wrench" size={22} />
              </div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] mb-2">
                Herramientas Certificadas
              </h3>
              <p className="text-xs text-[#6d6f69] leading-relaxed">
                Utilizamos torquímetros digitales para no dañar las fibras de carbono de tu cuadro o manillar, y bancos de centrado micrométrico Park Tool TS-2.3.
              </p>
            </div>

            <div className="bg-white p-7 border border-[#dedfd9] rounded-sm text-left shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#11120f] text-[#ffd400] flex items-center justify-center font-bold mb-4">
                <Icon name="shield" size={22} />
              </div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] mb-2">
                Repuestos 100% Originales
              </h3>
              <p className="text-xs text-[#6d6f69] leading-relaxed">
                Únicamente instalamos pastillas de freno, cadenas, líquido sellomático y rodamientos sellados de fabricantes originales Shimano, SRAM, Finish Line y Muc-Off.
              </p>
            </div>

            <div className="bg-white p-7 border border-[#dedfd9] rounded-sm text-left shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#dff4e9] text-[#167648] flex items-center justify-center font-bold mb-4">
                <Icon name="clock" size={22} />
              </div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] mb-2">
                Seguimiento en Tiempo Real
              </h3>
              <p className="text-xs text-[#6d6f69] leading-relaxed">
                Recibe notificaciones del estado de tu bicicleta mediante nuestro portal y consulta el avance exacto en banco de trabajo con tu número de radicado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Llamado a la acción final */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16 text-center">
        <div className="bg-[#11120f] text-white p-10 sm:p-14 rounded-sm border border-[#2d2e2b] flex flex-col items-center">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffd400] mb-2">
            Sede Principal Palmira
          </span>
          <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl uppercase tracking-tight mb-4">
            ¿Listo para llevar tu máquina al siguiente nivel?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mb-8 leading-relaxed">
            Acércate a nuestro taller o agenda tu espacio en línea para garantizar el menor tiempo de entrega posible.
          </p>
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenScheduleModal()}
              icon={<Icon name="calendar" size={17} />}
            >
              Agendar Mantenimiento Ahora
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate("home")}
            >
              Ver Catálogo de Bicicletas
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MaintenancePage;
