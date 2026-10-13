import React from "react";
import { Page } from "../../types";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";

interface HeroBannerProps {
  onNavigate: (page: Page) => void;
  onExploreCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  onExploreCatalog,
}) => {
  return (
    <section className="relative w-full h-[640px] sm:h-[700px] bg-[#181915] text-white overflow-hidden flex items-center">
      {/* Imagen de fondo con gradientes deportivos */}
      <img
        src="/assets/products/img-029.jpg"
        alt="Ciclista de montaña en sendero"
        className="absolute inset-0 w-full h-full object-cover object-center scale-100 animate-fade-in"
      />

      {/* Gradientes de sombra para contraste perfecto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080907]/95 via-[#080907]/75 to-transparent sm:w-3/4" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080907] via-transparent to-black/30" />

      {/* Contenido Hero */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 w-full text-left py-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#ffd400] text-xs font-extrabold uppercase tracking-widest mb-4">
            <span className="w-6 h-0.5 bg-[#ffd400]" />
            Temporada Oficial 2026 · BikeStore Colombia
          </div>

          <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] mb-6">
            DOMINA <br />
            <span className="text-white">CUALQUIER</span> <br />
            <span className="text-[#ffd400]">TERRENO.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-xl">
            Ingeniería de montaña de fibra de carbono, aerodinámica pura de carretera y tecnología eléctrica para ciclistas que nunca se detienen. Respaldado por mecánicos certificados.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreCatalog}
              icon={<Icon name="arrow" size={17} />}
            >
              Explorar Catálogo
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate("maintenance")}
              icon={<Icon name="wrench" size={17} />}
              iconPosition="left"
            >
              Agendar Taller Pro
            </Button>
          </div>
        </div>
      </div>

      {/* Tarjeta de Estadísticas / Garantías en la esquina inferior derecha */}
      <div className="hidden xl:flex absolute bottom-10 right-10 z-10 gap-1 text-left">
        <div className="bg-[#0f100d]/90 backdrop-blur-md border-t-2 border-[#ffd400] px-6 py-4">
          <span className="font-['Barlow_Condensed'] text-2xl font-bold text-white block">
            100%
          </span>
          <span className="text-[10px] uppercase text-[#a2a39e] tracking-wider">
            Original Garantizado
          </span>
        </div>
        <div className="bg-[#0f100d]/90 backdrop-blur-md border-t-2 border-[#ffd400] px-6 py-4">
          <span className="font-['Barlow_Condensed'] text-2xl font-bold text-white block">
            3-5 Días
          </span>
          <span className="text-[10px] uppercase text-[#a2a39e] tracking-wider">
            Envío Nacional
          </span>
        </div>
        <div className="bg-[#0f100d]/90 backdrop-blur-md border-t-2 border-[#ffd400] px-6 py-4">
          <span className="font-['Barlow_Condensed'] text-2xl font-bold text-white block">
            Taller Oficial
          </span>
          <span className="text-[10px] uppercase text-[#a2a39e] tracking-wider">
            Palmira & Cali
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
