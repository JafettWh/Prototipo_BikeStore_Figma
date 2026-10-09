import React, { useState } from "react";
import { MaintenanceBooking } from "../../types";
import { formatCOP } from "../../utils/formatters";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

interface MaintenanceTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: MaintenanceBooking[];
}

export const MaintenanceTrackingModal: React.FC<MaintenanceTrackingModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  const [searchCode, setSearchCode] = useState("BK-7842");
  const [searchedBooking, setSearchedBooking] = useState<MaintenanceBooking | null>(() => {
    return bookings.find((b) => b.id === "BK-7842") || bookings[0] || null;
  });
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const found = bookings.find(
      (b) => b.id.toUpperCase() === searchCode.trim().toUpperCase()
    );
    if (found) {
      setSearchedBooking(found);
    } else {
      setErrorMsg(`No encontramos ninguna orden de taller registrada con el radicado "${searchCode}".`);
    }
  };

  const steps = [
    { key: "Recibida", label: "01. Recepción en Taller", desc: "Inventario físico y lavado primario" },
    { key: "En diagnóstico", label: "02. Diagnóstico Técnico", desc: "Test de holguras y desgaste" },
    { key: "En reparación", label: "03. En Servicio & Desarme", desc: "Engrase, centrado y purga" },
    { key: "Lista para entrega", label: "04. Lista para Entrega", desc: "Control de calidad y torque" },
  ];

  const getStepIndex = (status: string) => {
    if (status === "Recibida") return 0;
    if (status === "En diagnóstico") return 1;
    if (status === "En reparación") return 2;
    if (status === "Lista para entrega") return 3;
    return 0;
  };

  const currentIdx = searchedBooking ? getStepIndex(searchedBooking.status) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-300 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-[#11120f] text-white px-6 py-5 flex items-center justify-between border-b border-[#2d2e2b]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-bold">
              <Icon name="clock" size={18} />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#ffd400] tracking-widest block">
                Seguimiento en Vivo
              </span>
              <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase tracking-tight">
                Estado de tu Bicicleta en Taller
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-neutral-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Buscador de radicado */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ingresa tu radicado (ej: BK-7842 o BK-6510)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="flex-1 h-12 bg-white border border-[#dedfd9] text-xs px-3.5 uppercase font-bold tracking-wider focus:outline-none focus:border-[#ffd400]"
            />
            <Button type="submit" variant="primary" size="md">
              Consultar
            </Button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {errorMsg}
            </div>
          )}

          {searchedBooking && (
            <div className="space-y-6">
              {/* Resumen de la Orden */}
              <div className="bg-[#f8f8f6] p-5 border border-[#dedfd9] rounded-sm flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-['Barlow_Condensed'] font-bold text-2xl text-[#11120f]">
                      Orden #{searchedBooking.id}
                    </span>
                    <Badge variant={searchedBooking.status === "Lista para entrega" ? "green" : "yellow"}>
                      {searchedBooking.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6d6f69]">
                    Propietario: <strong className="text-[#11120f]">{searchedBooking.clientName}</strong> · Bicicleta: <strong className="text-[#11120f]">{searchedBooking.bikeBrand}</strong>
                  </p>
                  <p className="text-xs text-[#6d6f69] mt-0.5">
                    Servicio: <strong className="text-[#11120f]">{searchedBooking.serviceName}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#6d6f69] block">
                    Total a Cancelar en Taller
                  </span>
                  <span className="font-['Barlow_Condensed'] font-bold text-2xl text-[#11120f]">
                    {formatCOP(searchedBooking.costEstimate)}
                  </span>
                </div>
              </div>

              {/* Stepper de Progreso */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#11120f] block mb-4">
                  Etapa de Servicio en Banco de Trabajo:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {steps.map((step, idx) => {
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={step.key}
                        className={`p-3 border rounded-sm transition-all ${
                          isCurrent
                            ? "bg-[#11120f] text-white border-[#11120f] shadow-md ring-2 ring-[#ffd400]"
                            : isDone
                            ? "bg-[#dff4e9]/40 border-[#b2e2cb] text-[#167648]"
                            : "bg-[#fcfcfb] border-[#dedfd9] text-[#888]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                              isCurrent
                                ? "bg-[#ffd400] text-[#11120f]"
                                : isDone
                                ? "bg-[#167648] text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            {isDone ? <Icon name="check" size={11} /> : idx + 1}
                          </span>
                          <span className="text-[11px] font-bold uppercase leading-tight line-clamp-1">
                            {step.key}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-tight ${isCurrent ? "text-neutral-300" : "opacity-80"}`}>
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ficha del Técnico Responsable */}
              <div className="bg-[#fcfcf9] p-4 border border-[#ffd400]/60 rounded-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#11120f] text-[#ffd400] flex items-center justify-center font-bold text-sm shrink-0">
                  <Icon name="wrench" size={20} />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#777a71] block">
                    Mecánico Líder Certificado
                  </span>
                  <p className="font-bold text-[#11120f] text-sm">
                    {searchedBooking.technician}
                  </p>
                  <p className="text-[#6d6f69] text-[11px] mt-0.5">
                    {searchedBooking.notes
                      ? `Observación de ingreso: "${searchedBooking.notes}"`
                      : "Sin observaciones adicionales al ingreso."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button variant="dark" size="sm" onClick={onClose}>
              Cerrar Consulta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTrackingModal;
