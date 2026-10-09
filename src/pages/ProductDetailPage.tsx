import React, { useState } from "react";
import { Product, Page } from "../types";
import { formatCOP } from "../utils/formatters";
import Breadcrumb from "../components/molecules/Breadcrumb";
import Badge from "../components/atoms/Badge";
import Button from "../components/atoms/Button";
import Icon from "../components/atoms/Icon";

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, qty: number, selectedSize?: string) => void;
  onNavigate: (page: Page) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onNavigate,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(
    product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;
  const photos = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize);
    onNavigate("checkout");
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8 text-left">
      {/* Migas de Pan */}
      <Breadcrumb
        items={[
          { label: "Inicio", onClick: () => onNavigate("home") },
          { label: product.section, onClick: () => onNavigate("home") },
          { label: product.category, onClick: () => onNavigate("home") },
          { label: product.name, active: true },
        ]}
      />

      {/* Grid Principal: Galería a la izquierda, Información a la derecha */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-4">
        {/* Columna Izquierda: Galería */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full h-[420px] sm:h-[540px] bg-[#fbfbf9] overflow-hidden rounded-sm border border-[#dedfd9] flex items-center justify-center p-4 sm:p-8">
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant={isOutOfStock ? "red" : "yellow"}>
                  {isOutOfStock ? "Sin Stock" : product.badge}
                </Badge>
              </div>
            )}
            <img
              src={selectedPhoto}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Miniaturas */}
          {photos.length > 1 && (
            <div className="flex gap-3">
              {photos.map((photo: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className={`w-24 h-20 bg-[#fbfbf9] border p-1 rounded-sm overflow-hidden cursor-pointer transition-all flex items-center justify-center ${
                    selectedPhoto === photo
                      ? "border-[#ffd400] ring-2 ring-[#ffd400]"
                      : "border-[#dedfd9] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Detalles Comerciales */}
        <div className="lg:col-span-5 flex flex-col text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71]">
              {product.section} · {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#e2b900] font-bold">
              <span>★★★★★</span>
              <span className="text-[#6d6f69] font-normal">(4.9 · 24 reseñas)</span>
            </div>
          </div>

          <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight mt-2 mb-3 leading-none">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 my-2">
            <span className="font-['Barlow_Condensed'] font-bold text-3xl sm:text-4xl text-[#11120f]">
              {formatCOP(product.price)}
            </span>
            <span className="text-xs text-[#167648] font-semibold bg-[#dff4e9] px-2 py-0.5 rounded-sm">
              IVA del 19% Incluido
            </span>
          </div>

          {/* Estado de Existencias (CU-02 paso 4 y alterno 4.1) */}
          <div className="my-3 py-2 border-y border-[#dedfd9] flex items-center justify-between text-xs">
            <span className="text-[#6d6f69]">Disponibilidad en almacén:</span>
            {isOutOfStock ? (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <Icon name="close" size={14} /> Producto sin existencias disponibles
              </span>
            ) : (
              <span className="text-[#167648] font-bold flex items-center gap-1">
                <Icon name="check" size={14} /> {product.stock} unidades listas para despacho
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#6d6f69] leading-relaxed my-3">
            {product.description}
          </p>

          {/* Selector de Tallas si aplica */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="my-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[#11120f]">
                  Selecciona tu talla:
                </span>
                <span className="text-[#777] underline cursor-pointer text-[11px]">
                  Guía de medidas anatómicas
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 border text-xs font-bold uppercase transition-all cursor-pointer rounded-sm ${
                      selectedSize === s
                        ? "border-[#11120f] bg-[#11120f] text-white shadow"
                        : "border-[#dedfd9] bg-white text-[#11120f] hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 my-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#11120f]">
                Cantidad:
              </span>
              <div className="flex items-center border border-[#dedfd9] rounded-sm bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-neutral-100"
                >
                  <Icon name="minus" size={14} />
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-neutral-100"
                >
                  <Icon name="plus" size={14} />
                </button>
              </div>
              <span className="text-[11px] text-[#6d6f69]">
                (Máx. {product.stock})
              </span>
            </div>
          )}

          {/* Botones de Compra / Carrito (Inhabilitados si sin stock, CU-02 alterno 4.1) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              icon={<Icon name="cart" size={18} />}
            >
              {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
            </Button>

            {!isOutOfStock && (
              <Button
                variant="dark"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                icon={<Icon name="arrow" size={18} />}
              >
                Comprar Ahora
              </Button>
            )}
          </div>

          {/* Garantía y soporte */}
          <div className="mt-6 p-4 bg-[#f8f8f6] border border-[#dedfd9] rounded-sm flex items-center gap-3">
            <span className="text-[#b59700]">
              <Icon name="shield" size={24} />
            </span>
            <div className="text-xs">
              <b className="text-[#11120f] block">Despacho Asegurado con Envía & Servientrega</b>
              <span className="text-[#6d6f69]">
                Entrega estimada de 3 a 5 días hábiles a nivel nacional.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ficha de Especificaciones Técnicas (CU-02 paso 5) */}
      <section className="mt-16 pt-10 border-t border-[#dedfd9] bg-[#fbfbf9] p-8 sm:p-12 rounded-sm border">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
            Ficha Técnica Oficial
          </span>
          <h2 className="font-['Barlow_Condensed'] font-extrabold text-3xl uppercase tracking-tight text-[#11120f] mt-1 mb-6">
            Especificaciones Mecánicas y Materiales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div
                key={key}
                className="flex justify-between items-center py-3 border-b border-[#dedfd9] text-xs"
              >
                <span className="font-bold uppercase tracking-wider text-[#11120f] capitalize">
                  {key}:
                </span>
                <span className="text-[#555] text-right font-medium">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
