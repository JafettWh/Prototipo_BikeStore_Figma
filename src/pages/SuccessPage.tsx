import React from "react";
import { Order, Page } from "../types";
import { formatCOP } from "../utils/formatters";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";
import InvoiceDownload from "../components/molecules/InvoiceDownload";

interface SuccessPageProps {
  order: Order | null;
  onNavigate: (page: Page) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ order, onNavigate }) => {
  const orderId = order ? order.id : "BS-20261009-842";
  const email = order ? order.email : "ciclista.premium@gmail.com";
  const total = order ? order.total : 4599000;

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Icono de Check */}
      <div className="w-20 h-20 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center mx-auto mb-6 shadow-lg animate-scale-in">
        <Icon name="check" size={38} />
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-[#167648] bg-[#dff4e9] px-4 py-1.5 rounded-sm border border-[#b2e2cb]">
        Pedido Confirmado #{orderId}
      </span>

      <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-5xl sm:text-6xl text-[#11120f] tracking-tight mt-4 mb-2">
        ¡Gracias por tu Compra!
      </h1>

      <p className="text-xs sm:text-sm text-[#6d6f69] max-w-lg mx-auto leading-relaxed mb-8">
        Tu pedido ha sido registrado para <strong className="text-[#11120f]">{email}</strong>. Descarga tu comprobante con los datos de entrega y el detalle de productos. Este prototipo no procesa pagos reales ni envía facturas por correo.
      </p>

      {/* Stepper de Despacho de la Orden */}
      <div className="w-full max-w-2xl bg-[#f8f8f6] p-6 sm:p-8 border border-[#dedfd9] rounded-sm mb-8 text-left">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#dedfd9]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#11120f]">
            Estado Logístico de tu Encomienda
          </span>
          <span className="text-xs font-bold text-[#11120f]">
            Total Pagado: {formatCOP(total)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 relative">
          <div className="flex flex-col items-center text-center">
            <span className="w-10 h-10 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-bold text-xs mb-2 shadow-sm">
              <Icon name="check" size={16} />
            </span>
            <b className="text-xs uppercase text-[#11120f]">Empaquetado</b>
            <span className="text-[10px] text-[#6d6f69]">En bodega Palmira</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-70">
            <span className="w-10 h-10 rounded-full bg-white border-2 border-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-xs mb-2">
              2
            </span>
            <b className="text-xs uppercase text-[#11120f]">En Camino</b>
            <span className="text-[10px] text-[#6d6f69]">Guía Envía / Servientrega</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-70">
            <span className="w-10 h-10 rounded-full bg-white border-2 border-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-xs mb-2">
              3
            </span>
            <b className="text-xs uppercase text-[#11120f]">Entregado</b>
            <span className="text-[10px] text-[#6d6f69]">En tu dirección</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {order && <InvoiceDownload record={order} />}
        <Button
          variant="primary"
          size="lg"
          onClick={() => onNavigate("home")}
          icon={<Icon name="arrow" size={16} />}
        >
          Volver a la Tienda
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("maintenance")}
          icon={<Icon name="wrench" size={16} />}
          iconPosition="left"
        >
          Conocer Taller de Mantenimiento
        </Button>
      </div>
    </main>
  );
};

export default SuccessPage;
