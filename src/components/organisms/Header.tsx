import React, { useState } from "react";
import { Page } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Logo from "../atoms/Logo";
import Icon from "../atoms/Icon";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSearch: () => void;
  onOpenTrackingModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenTrackingModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Barra Superior de Anuncios */}
      <div className="bg-[#ffd400] text-[#11120f] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Icon name="shield" size={13} /> Envío gratis a toda Colombia desde $300.000
        </span>
        <div className="flex items-center gap-4">
          {onOpenTrackingModal && (
            <button
              onClick={onOpenTrackingModal}
              className="hidden md:flex items-center gap-1 text-[#11120f] hover:underline font-bold bg-transparent border-0 cursor-pointer"
            >
              <Icon name="wrench" size={13} /> Consultar Estado de Taller
            </button>
          )}
          <span className="hidden sm:inline font-bold">
            Taller Certificado Shimano & SRAM · Palmira / Cali
          </span>
        </div>
      </div>

      {/* Barra de Navegación Principal */}
      <div className="bg-[#11120f] text-white border-b border-[#2d2e2b] px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo con imagen transparente */}
        <div className="flex items-center gap-4">
          <Logo
            onClick={() => handleNav("home")}
            size="md"
            variant="dark"
          />
        </div>

        {/* Links de Navegación Escritorio */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            type="button"
            onClick={() => handleNav("home")}
            className={`text-xs font-bold uppercase tracking-widest py-2 transition-colors cursor-pointer bg-transparent border-0 ${
              currentPage === "home"
                ? "text-[#ffd400] border-b-2 border-[#ffd400]"
                : "text-neutral-300 hover:text-[#ffd400]"
            }`}
          >
            Bicicletas
          </button>

          <button
            type="button"
            onClick={() => handleNav("maintenance")}
            className={`relative text-xs font-bold uppercase tracking-widest py-2 flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 ${
              currentPage === "maintenance"
                ? "text-[#ffd400] border-b-2 border-[#ffd400]"
                : "text-neutral-300 hover:text-[#ffd400]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd400]"></span>
            </span>
            Mantenimiento & Taller
          </button>

          <button
            type="button"
            onClick={() => {
              handleNav("home");
              setTimeout(() => {
                const el = document.getElementById("componentes");
                el?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-xs font-bold uppercase tracking-widest py-2 text-neutral-300 hover:text-[#ffd400] transition-colors cursor-pointer bg-transparent border-0"
          >
            Componentes
          </button>

          <button
            type="button"
            onClick={() => {
              handleNav("home");
              setTimeout(() => {
                const el = document.getElementById("accesorios");
                el?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-xs font-bold uppercase tracking-widest py-2 text-neutral-300 hover:text-[#ffd400] transition-colors cursor-pointer bg-transparent border-0"
          >
            Accesorios
          </button>

          {currentUser?.role === "admin" && (
            <button
              type="button"
              onClick={() => handleNav("admin")}
              className={`text-xs font-bold uppercase tracking-widest py-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/40 text-[#ffd400] hover:bg-amber-500/20 transition-colors cursor-pointer ${
                currentPage === "admin" ? "ring-2 ring-[#ffd400]" : ""
              }`}
            >
              Panel Admin
            </button>
          )}
        </nav>

        {/* Acciones de la Derecha */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Buscar */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Abrir buscador"
            className="p-2.5 text-neutral-300 hover:text-[#ffd400] transition-colors rounded-full hover:bg-white/5 cursor-pointer bg-transparent border-0"
          >
            <Icon name="search" size={20} />
          </button>

          {/* Cuenta */}
          <button
            type="button"
            onClick={() => handleNav(currentUser ? (currentUser.role === "admin" ? "admin" : "home") : "login")}
            aria-label="Mi Cuenta"
            className={`flex items-center gap-2 py-2 px-3 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 ${
              currentPage === "login" || currentPage === "admin"
                ? "text-[#ffd400]"
                : "text-neutral-300 hover:text-[#ffd400]"
            }`}
          >
            <Icon name="user" size={20} />
            <span className="hidden sm:inline">
              {currentUser ? currentUser.name.split(" ")[0] : "Cuenta"}
            </span>
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar Sesión"
              className="flex items-center gap-2 py-2 px-3 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 text-red-300 hover:text-red-100"
            >
              <Icon name="logout" size={20} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}

          {/* Carrito */}
          <button
            type="button"
            onClick={() => handleNav("cart")}
            aria-label={`Carrito con ${cartCount} productos`}
            className={`relative flex items-center gap-2 py-2 px-3 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 ${
              currentPage === "cart"
                ? "text-[#ffd400]"
                : "text-neutral-300 hover:text-[#ffd400]"
            }`}
          >
            <div className="relative">
              <Icon name="cart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#ffd400] text-[#11120f] font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Carrito</span>
          </button>

          {/* Botón Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menú móvil"
            className="lg:hidden p-2 text-white hover:text-[#ffd400] transition-colors cursor-pointer bg-transparent border-0"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161713] border-b border-[#2d2e2b] px-6 py-5 flex flex-col gap-3 text-left animate-slide-down">
          <button
            onClick={() => handleNav("home")}
            className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-neutral-200 hover:text-[#ffd400] border-b border-white/5 bg-transparent"
          >
            Bicicletas de Montaña, Ruta & Gravel
          </button>
          <button
            onClick={() => handleNav("maintenance")}
            className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-[#ffd400] flex items-center justify-between border-b border-white/5 bg-transparent"
          >
            <span>Taller & Mantenimiento Especializado</span>
            <span className="text-[10px] bg-[#ffd400] text-black px-2 py-0.5 font-extrabold rounded-sm">
              Nuevo
            </span>
          </button>
          <button
            onClick={() => {
              handleNav("home");
              setTimeout(() => {
                document.getElementById("componentes")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-neutral-200 hover:text-[#ffd400] border-b border-white/5 bg-transparent"
          >
            Componentes de Alto Rendimiento
          </button>
          <button
            onClick={() => {
              handleNav("home");
              setTimeout(() => {
                document.getElementById("accesorios")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-neutral-200 hover:text-[#ffd400] border-b border-white/5 bg-transparent"
          >
            Accesorios & Protección
          </button>
          {onOpenTrackingModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackingModal();
              }}
              className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-neutral-300 hover:text-white flex items-center gap-2 bg-transparent"
            >
              <Icon name="wrench" size={14} /> Consultar Estado de Reparación
            </button>
          )}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => handleNav("admin")}
              className="py-2.5 text-xs font-bold uppercase tracking-wider text-left text-[#ffd400] bg-transparent"
            >
              Panel de Administración
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
