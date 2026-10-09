import React, { useState } from "react";
import { Product } from "../../types";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";

interface ProductDeactivateModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: number, reason: string) => void;
}

export const ProductDeactivateModal: React.FC<ProductDeactivateModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("El motivo de inactivación es obligatorio (Regla de negocio CU-12).");
      return;
    }
    onConfirm(product.id, reason);
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#11120f] text-white px-6 py-4 flex items-center justify-between border-b border-red-500/40">
          <div className="flex items-center gap-2 text-red-400">
            <Icon name="alert-triangle" size={18} />
            <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase tracking-tight text-white">
              Inactivar Producto (CU-12)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white bg-transparent border-0 cursor-pointer p-1"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          <p className="text-xs text-[#333] leading-relaxed">
            ¿Estás seguro de inactivar <strong className="text-[#11120f]">{product.name}</strong>?
            El producto dejará de ser visible en el catálogo público para visitantes y clientes.
          </p>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-sm text-[11px] text-amber-800">
            <strong>Nota del SENA:</strong> Inactivar un producto no es igual a "Sin stock". Requiere dejar asentada la justificación administrativa.
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
              Motivo obligatorio de inactivación *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ej. Descontinuado por el fabricante Specialized, daño estructural en lote, fin de temporada..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              className="w-full p-3 bg-white border border-[#dedfd9] text-xs focus:outline-none focus:border-[#ffd400] resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          )}

          <div className="pt-3 border-t border-[#dedfd9] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirmar Inactivación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDeactivateModal;
