import React, { useState } from "react";
import { Product } from "../../types";
import { formatCOP } from "../../utils/formatters";
import Icon from "../atoms/Icon";

interface SearchModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  products,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input de Búsqueda */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#dedfd9]">
          <span className="text-[#6d6f69]">
            <Icon name="search" size={22} />
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Busca bicicletas, transmisiones, cascos, pedales..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg bg-transparent border-0 focus:outline-none text-[#11120f] placeholder:text-[#999]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-bold uppercase text-neutral-400 hover:text-black bg-transparent border-0 cursor-pointer"
            >
              Borrar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar búsqueda"
            className="p-1 text-neutral-400 hover:text-black transition-colors bg-transparent border-0 cursor-pointer"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        {/* Términos rápidos */}
        <div className="bg-[#f8f8f6] px-6 py-3 flex items-center gap-2 flex-wrap text-xs border-b border-[#dedfd9]">
          <span className="text-[10px] uppercase font-bold text-[#777a71]">
            Populares:
          </span>
          {["Specialized", "Shimano", "Trek", "Carbono", "Casco", "Gravel"].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="bg-white border border-[#dedfd9] hover:border-black px-2.5 py-1 text-[11px] font-medium text-[#333] transition-colors rounded-sm cursor-pointer"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Resultados */}
        <div className="max-h-[380px] overflow-y-auto p-4 divide-y divide-[#eee]">
          {query.trim() === "" ? (
            <div className="py-12 text-center text-[#777a71]">
              <Icon name="bike" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">Escribe el nombre de un modelo, marca o accesorio para consultar disponibilidad.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-[#777a71]">
              <p className="text-sm font-semibold text-[#11120f] mb-1">
                No encontramos coincidencias para "{query}"
              </p>
              <p className="text-xs">
                Intenta con términos más generales como "Ruta", "Frenos" o "MTB".
              </p>
            </div>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#f4f4f0] transition-colors rounded-sm text-left group bg-transparent border-0 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-12 object-cover bg-neutral-100 rounded-sm"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#777a71]">
                      {product.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#11120f] group-hover:text-[#ffd400] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#11120f] block">
                    {formatCOP(product.price)}
                  </span>
                  <span className="text-[10px] text-[#167648] font-semibold">
                    {product.stock > 0 ? "Disponible" : "Sin stock"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
