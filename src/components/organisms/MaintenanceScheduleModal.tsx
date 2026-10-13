import React, { useState } from "react";
import { MaintenanceService, MaintenanceBooking } from "../../types";
import { formatCOP, generateBookingId } from "../../utils/formatters";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import InvoiceDownload from "../molecules/InvoiceDownload";

interface MaintenanceScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: MaintenanceService | null;
  services: MaintenanceService[];
  onBookingSuccess: (booking: MaintenanceBooking) => void;
}

export const MaintenanceScheduleModal: React.FC<MaintenanceScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  services,
  onBookingSuccess,
}) => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeType, setBikeType] = useState<MaintenanceBooking["bikeType"]>("Montaña (MTB)");
  const [serviceId, setServiceId] = useState(selectedService?.id || services[0]?.id || "");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 11:00 AM");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<MaintenanceBooking | null>(null);

  if (!isOpen) return null;

  const currentServiceObj = services.find((s) => s.id === serviceId) || selectedService || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: MaintenanceBooking = {
      id: generateBookingId(),
      clientName: clientName || "Ciclista BikeStore",
      email: email || "ciclista@bikestore.com",
      phone: phone || "300 123 4567",
      bikeBrand: bikeBrand || "Bicicleta Personal",
      bikeType,
      serviceId,
      serviceName: currentServiceObj?.name || "Servicio Técnico BikeStore",
      date,
      timeSlot,
      notes,
      status: "Recibida",
      technician: "Carlos Ramírez (Técnico Master Shimano)",
      costEstimate: currentServiceObj?.price || 180000,
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-300 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-[#11120f] text-white px-6 py-5 flex items-center justify-between border-b border-[#2d2e2b]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-bold">
              <Icon name="wrench" size={18} />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#ffd400] tracking-widest block">
                Taller Oficial BikeStore
              </span>
              <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase tracking-tight">
                {confirmedBooking ? "¡Cita de Taller Confirmada!" : "Agendar Mantenimiento Especializado"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="text-neutral-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {confirmedBooking ? (
          /* Pantalla de Confirmación de Cita con Radicado */
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#dff4e9] text-[#167648] flex items-center justify-center mx-auto mb-4">
              <Icon name="check" size={32} />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#167648] bg-[#dff4e9] px-3 py-1 rounded-sm">
              Radicado #{confirmedBooking.id}
            </span>

            <h3 className="font-['Barlow_Condensed'] font-extrabold text-3xl uppercase text-[#11120f] mt-4 mb-2">
              ¡Tu cita quedó agendada con éxito!
            </h3>

            <p className="text-xs text-[#6d6f69] max-w-md mx-auto leading-relaxed mb-6">
              Te esperamos el <strong className="text-[#11120f]">{confirmedBooking.date}</strong> en la franja <strong className="text-[#11120f]">{confirmedBooking.timeSlot}</strong> en nuestro taller de Palmira. Guarda tu número de radicado para consultar el estado del mantenimiento en tiempo real.
            </p>

            <div className="bg-[#f4f4f0] p-5 rounded-sm max-w-md mx-auto text-left text-xs space-y-2 mb-6 border border-[#dedfd9]">
              <div className="flex justify-between">
                <span className="text-[#6d6f69]">Servicio:</span>
                <span className="font-bold text-[#11120f]">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d6f69]">Bicicleta:</span>
                <span className="font-bold text-[#11120f]">{confirmedBooking.bikeBrand} ({confirmedBooking.bikeType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d6f69]">Técnico Asignado:</span>
                <span className="font-bold text-[#11120f]">{confirmedBooking.technician}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#dedfd9]">
                <span className="text-[#6d6f69]">Valor Estimado:</span>
                <span className="font-bold text-base text-[#11120f]">{formatCOP(confirmedBooking.costEstimate)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <InvoiceDownload record={confirmedBooking} />
              <Button variant="primary" onClick={handleClose}>
                Entendido, Cerrar
              </Button>
            </div>
          </div>
        ) : (
          /* Formulario de Agendamiento */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Selección del Servicio y Resumen de Valor */}
            <div className="bg-[#fcfcf9] p-4 border border-[#ffd400] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f] block mb-1">
                  Selecciona el paquete de taller:
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full h-11 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {formatCOP(s.price)} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              {currentServiceObj && (
                <div className="text-right sm:border-l sm:border-[#dedfd9] sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-[#6d6f69] block">
                    Costo estimado
                  </span>
                  <span className="font-['Barlow_Condensed'] font-bold text-2xl text-[#11120f]">
                    {formatCOP(currentServiceObj.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Datos del Ciclista */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Nombre del Propietario"
                required
                placeholder="Ej. Jafet Hernández"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Input
                label="Correo Electrónico"
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Teléfono Móvil / WhatsApp"
                required
                placeholder="315 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Datos de la Bicicleta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marca y Modelo de la Bicicleta"
                required
                placeholder="Ej. Specialized Stumpjumper / Trek Marlin"
                value={bikeBrand}
                onChange={(e) => setBikeBrand(e.target.value)}
              />
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Modalidad / Tipo de Bici *
                </label>
                <select
                  value={bikeType}
                  onChange={(e) => setBikeType(e.target.value as MaintenanceBooking["bikeType"])}
                  className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                >
                  <option value="Montaña (MTB)">Montaña (MTB)</option>
                  <option value="Ruta / Carretera">Ruta / Carretera</option>
                  <option value="Gravel">Gravel</option>
                  <option value="E-Bike">Bicicleta Eléctrica (E-Bike)</option>
                  <option value="Urbana">Urbana / Fixie</option>
                </select>
              </div>
            </div>

            {/* Fecha y Franja Horaria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha de Recepción en Taller"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Franja Horaria Preferida *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                >
                  <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Mañana)</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Mediodía)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Tarde)</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Cierre)</option>
                </select>
              </div>
            </div>

            {/* Notas técnicas */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                Observaciones o fallas a revisar (Opcional):
              </label>
              <textarea
                rows={2}
                placeholder="Describe ruidos, holgura en pedales, estado de pastillas de freno, purga, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-white border border-[#dedfd9] text-xs focus:outline-none focus:border-[#ffd400] resize-none"
              />
            </div>

            {/* Botones de Acción */}
            <div className="pt-4 border-t border-[#dedfd9] flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Icon name="arrow" size={16} />}
              >
                Confirmar y Reservar Cita
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MaintenanceScheduleModal;
