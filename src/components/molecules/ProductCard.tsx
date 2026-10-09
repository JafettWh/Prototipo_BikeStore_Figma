import React from "react";
import { Product } from "../../types";
import { formatCOP } from "../../utils/formatters";
import Icon from "../atoms/Icon";
import Badge from "../atoms/Badge";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetail,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex flex-col bg-white border border-[#dedfd9] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-neutral-400">
      {/* Contenedor de Imagen */}
      <button
        type="button"
        onClick={() => onViewDetail(product)}
        aria-label={`Ver detalles de ${product.name}`}
        className="relative w-full h-[270px] bg-[#e9e9e5] overflow-hidden text-left cursor-pointer border-0 p-0 block"
      >
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge
              variant={
                isOutOfStock ? "red" : product.badge === "Oferta" ? "yellow" : "dark"
              }
            >
              {isOutOfStock ? "Sin Stock" : product.badge}
            </Badge>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay hover sutil con icono de lupa/detalle */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-[#11120f]/90 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 flex items-center gap-1.5 rounded-sm shadow">
            <Icon name="eye" size={14} /> Ver Ficha Técnica
          </span>
        </div>
      </button>

      {/* Información del Producto */}
      <div className="flex flex-col flex-1 p-5 text-left">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#777a71]">
          {product.category}
        </span>

        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="my-2 p-0 text-left bg-transparent border-0 font-['Barlow_Condensed'] font-semibold text-xl tracking-tight uppercase text-[#11120f] hover:text-[#ffd400] transition-colors line-clamp-2 cursor-pointer"
        >
          {product.name}
        </button>

        <div className="mt-auto pt-3 border-t border-[#dedfd9] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#11120f] block">
              {formatCOP(product.price)}
            </span>
            <span className="text-[10px] text-[#6d6f69]">
              {isOutOfStock
                ? "No disponible en bodega"
                : `${product.stock} unidades en stock`}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            aria-label={
              isOutOfStock
                ? `${product.name} agotado`
                : `Agregar ${product.name} al carrito`
            }
            className={`
              w-9 h-9 flex items-center justify-center border-0 transition-all duration-200 cursor-pointer
              ${
                isOutOfStock
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#ffd400] text-[#11120f] hover:bg-[#ffe048] hover:scale-105 active:scale-95 shadow-sm"
              }
            `}
          >
            <Icon name="plus" size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
