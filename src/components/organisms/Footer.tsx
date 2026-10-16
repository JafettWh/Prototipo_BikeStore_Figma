import React from "react";
import { Page } from "../../types";
import Logo from "../atoms/Logo";
import Icon from "../atoms/Icon";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#141512] text-[#a2a39e] pt-16 pb-10 border-t border-[#252622]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-left">
          {/* Columna 1: Marca y descripción */}
          <div className="flex flex-col gap-4">
            <Logo onClick={() => onNavigate("home")} size="lg" variant="dark" />
            <p className="text-xs text-[#8a8c84] leading-relaxed mt-2 max-w-sm">
              La plataforma definitiva para apasionados del ciclismo de ruta, montaña y aventura.
              Distribuidor de bicicletas premium y componentes de competición en Palmira y Valle del Cauca.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#ffd400] font-bold uppercase tracking-wider mt-2">
              <Icon name="shield" size={14} /> Productos originales con respaldo oficial
            </div>
          </div>

          {/* Columna 2: Catálogo */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffd400] mb-5">
              Explorar Catálogo
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("home")}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Bicicletas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("home");
                    setTimeout(() => document.getElementById("componentes")?.scrollIntoView({ behavior: "smooth" }), 100);
                  }}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Componentes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("home");
                    setTimeout(() => document.getElementById("accesorios")?.scrollIntoView({ behavior: "smooth" }), 100);
                  }}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Accesorios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("cart")}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Carrito de compras
                </button>
              </li>
              <li>
                <span className="text-[#6d6f69]">Garantías de productos originales</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información y Soporte */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffd400] mb-5">
              Atención al Ciclista
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("home")}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo Oficial 2026
                </button>
              </li>
              <li>
                <a
                  href="#politicas"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Envíos gratis a nivel nacional por compras superiores a $300.000 COP.");
                  }}
                  className="text-[#a2a39e] hover:text-white transition-colors"
                >
                  Políticas de Envío Express
                </a>
              </li>
              <li>
                <a
                  href="#garantias"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Garantía de por vida en cuadros de carbono seleccionados Specialized y Trek.");
                  }}
                  className="text-[#a2a39e] hover:text-white transition-colors"
                >
                  Cobertura de Garantías
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="bg-transparent border-0 p-0 text-[#a2a39e] hover:text-white transition-colors cursor-pointer"
                >
                  Portal de Clientes
                </button>
              </li>
              <li>
                <span className="text-[#6d6f69]">Sede: Palmira, Valle del Cauca</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Boletín y Proyecto SENA */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffd400] mb-5">
              Comunidad BikeStore
            </h4>
            <p className="text-xs text-[#8a8c84] mb-4 leading-relaxed">
              Suscríbete para recibir invitaciones a rodadas de fin de semana, lanzamientos y descuentos exclusivos.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias por unirte al pelotón BikeStore!");
              }}
              className="flex items-stretch"
            >
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                className="bg-[#22241f] border border-[#373832] text-white text-xs px-3.5 py-3 w-full focus:outline-none focus:border-[#ffd400]"
              />
              <button
                type="submit"
                aria-label="Suscribirse"
                className="bg-[#ffd400] text-[#11120f] px-4 font-bold hover:bg-[#ffe048] transition-colors cursor-pointer border-0 flex items-center justify-center shrink-0"
              >
                <Icon name="arrow" size={16} />
              </button>
            </form>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#6d6f69]">
              BikeStore Colombia · Pasión y rendimiento en cada kilómetro rodado.
            </div>
          </div>
        </div>

        {/* Barra Inferior de Copyright */}
        <div className="mt-14 pt-8 border-t border-[#252622] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6d6f69]">
          <p>© 2026 BikeStore Colombia. Desarrollado con arquitectura limpia en React.</p>
          <div className="flex items-center gap-6">
            <span>Términos y Condiciones</span>
            <span>Tratamiento de Datos Personales</span>
            <span>Ayuda al Cliente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
