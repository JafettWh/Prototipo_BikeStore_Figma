import React, { useState } from "react";
import { Page } from "../types";
import { useCart } from "../context/CartContext";
import { formatCOP } from "../utils/formatters";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";

interface CartPageProps {
  onNavigate: (page: Page) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQty, removeItem, subtotal, tax, shipping, total } = useCart();
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleDecrease = (id: number, currentQty: number, name: string) => {
    if (currentQty <= 1) {
      setItemToDelete({ id, name });
    } else {
      updateQty(id, -1);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 sm:px-10 py-10 text-left">
      <div className="mb-8">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
          Tu Selección
        </span>
        <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight mt-1">
          Carrito de Compras
        </h1>
        <p className="text-xs text-[#6d6f69]">
          {items.length === 0
            ? "No tienes productos en el carrito."
            : `${items.length} productos listos para rodar.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-[#f8f8f5] border border-dashed border-[#dedfd9] rounded-sm">
          <div className="w-16 h-16 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mx-auto mb-4">
            <Icon name="cart" size={32} />
          </div>
          <h2 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-[#11120f] mb-2">
            Tu carrito está esperando una aventura
          </h2>
          <p className="text-xs text-[#6d6f69] max-w-sm mx-auto mb-6">
            Explora nuestro catálogo oficial y encuentra la bicicleta o repuesto ideal para tu próxima rodada.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate("home")}>
            Explorar Catálogo de Productos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Lista de Productos del Carrito */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border-t border-[#11120f] divide-y divide-[#dedfd9]">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Foto y descripción */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-20 sm:w-28 sm:h-24 object-cover bg-neutral-100 rounded-sm shrink-0"
                    />
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-[#777a71]">
                        {item.category}
                      </span>
                      <h3 className="font-['Barlow_Condensed'] font-bold text-lg sm:text-xl uppercase text-[#11120f] line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="text-[11px] text-[#6d6f69] space-x-2 mt-0.5">
                        {item.selectedSize && <span>Talla: <strong>{item.selectedSize}</strong></span>}
                        <span>· Stock disponible: <strong>{item.stock}</strong></span>
                      </div>
                      <span className="text-xs font-bold text-[#11120f] block mt-1">
                        {formatCOP(item.price)} c/u
                      </span>
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#dedfd9] rounded-sm bg-white">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item.id, item.qty, item.name)}
                        className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-neutral-100"
                        aria-label="Disminuir cantidad"
                      >
                        <Icon name="minus" size={13} />
                      </button>
                      <span className="w-9 text-center text-xs font-bold">{item.qty}</span>
                      <button
                        type="button"
                        disabled={item.qty >= item.stock}
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-neutral-100 disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        <Icon name="plus" size={13} />
                      </button>
                    </div>

                    {/* Subtotal del item */}
                    <div className="text-right min-w-[100px]">
                      <span className="font-['Barlow_Condensed'] font-bold text-lg text-[#11120f] block">
                        {formatCOP(item.price * item.qty)}
                      </span>
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => setItemToDelete({ id: item.id, name: item.name })}
                      className="text-neutral-400 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer p-1"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("home")}
                icon={<Icon name="arrow-left" size={14} />}
                iconPosition="left"
              >
                Continuar Comprando
              </Button>
            </div>
          </div>

          {/* Resumen de la Orden */}
          <aside className="lg:col-span-4 bg-[#f8f8f5] p-6 sm:p-7 border border-[#dedfd9] rounded-sm self-start">
            <h3 className="font-['Barlow_Condensed'] font-extrabold text-2xl uppercase tracking-tight text-[#11120f] mb-4 pb-2 border-b border-[#dedfd9]">
              Resumen del Pedido
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6d6f69]">Subtotal productos:</span>
                <span className="font-bold text-[#11120f]">{formatCOP(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#6d6f69]">Envío a domicilio:</span>
                <span className={`font-bold ${shipping === 0 ? "text-[#167648]" : "text-[#11120f]"}`}>
                  {shipping === 0 ? "Gratis (Aplica beneficio)" : formatCOP(shipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#6d6f69]">IVA (19% incluido):</span>
                <span className="text-[#6d6f69]">{formatCOP(tax)}</span>
              </div>

              <div className="pt-4 border-t border-[#dedfd9] flex justify-between items-baseline">
                <span className="font-bold text-sm uppercase text-[#11120f]">Total a Pagar:</span>
                <span className="font-['Barlow_Condensed'] font-extrabold text-3xl text-[#11120f]">
                  {formatCOP(total)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-6"
              onClick={() => onNavigate("checkout")}
              icon={<Icon name="arrow" size={16} />}
            >
              Continuar al Pago
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#6d6f69]">
              <Icon name="shield" size={14} />
              <span>Transacción cifrada y protegida por pasarela segura</span>
            </div>
          </aside>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación (CU-07 alternos 3.1 y 5.1) */}
      {itemToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white max-w-sm w-full p-6 rounded-sm shadow-2xl border border-neutral-300 text-left">
            <div className="flex items-center gap-2 text-red-600 mb-2 font-bold text-sm">
              <Icon name="alert-triangle" size={18} />
              <span>Confirmar Eliminación</span>
            </div>
            <p className="text-xs text-[#555] leading-relaxed mb-6">
              ¿Deseas remover <strong className="text-[#11120f]">{itemToDelete.name}</strong> de tu carrito de compras?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="w-[120px]"
                onClick={() => setItemToDelete(null)}
              >
                Conservar
              </Button>
              <Button
                variant="danger"
                size="sm"
                style={{ fontSize: "14px" }}
                onClick={confirmDelete}
              >
                Eliminar Producto
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
