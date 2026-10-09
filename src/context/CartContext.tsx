import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number, selectedSize?: string) => { success: boolean; message: string };
  updateQty: (id: number, delta: number) => { success: boolean; message?: string };
  removeItem: (id: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("bikestore_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bikestore_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, qty = 1, selectedSize = "M") => {
    if (product.stock <= 0) {
      return { success: false, message: `El producto ${product.name} se encuentra agotado.` };
    }

    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      const desired = existing.qty + qty;
      if (desired > product.stock) {
        setItems((prev) =>
          prev.map((i) => (i.id === product.id ? { ...i, qty: product.stock } : i))
        );
        return {
          success: true,
          message: `Has alcanzado el límite de existencias (${product.stock} unidades disponibles).`,
        };
      }
      setItems((prev) =>
        prev.map((i) => (i.id === product.id ? { ...i, qty: desired } : i))
      );
      return { success: true, message: `Cantidad actualizada en el carrito (${desired}).` };
    }

    const actualQty = Math.min(qty, product.stock);
    setItems((prev) => [
      ...prev,
      {
        ...product,
        qty: actualQty,
        selectedSize: product.sizes ? selectedSize : undefined,
      },
    ]);
    return { success: true, message: `${product.name} agregado al carrito.` };
  };

  const updateQty = (id: number, delta: number) => {
    const target = items.find((i) => i.id === id);
    if (!target) return { success: false };

    const newQty = target.qty + delta;
    if (newQty <= 0) {
      removeItem(id);
      return { success: true, message: "Producto removido del carrito." };
    }

    if (newQty > target.stock) {
      return {
        success: false,
        message: `Máximo disponible en bodega: ${target.stock} unidades.`,
      };
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    );
    return { success: true };
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Regla comercial: Envío gratis a partir de $300.000 COP
  const shipping = subtotal > 0 && subtotal < 300000 ? 15000 : 0;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + shipping;
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
};
