import React, { useState } from "react";
import { Page, Order } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatCOP, generateOrderId } from "../utils/formatters";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
  onOrderCompleted: (order: Order) => void;
}

// Departamentos de Colombia con ciudades y municipios principales
const departamentosColombia: Record<string, string[]> = {
  "Valle del Cauca": ["Palmira", "Cali", "Buga", "Tuluá", "Yumbo", "Jamundí", "Cartago", "Buenaventura", "Candelaria", "Pradera"],
  "Antioquia": ["Medellín", "Envigado", "Rionegro", "Itagüí", "Bello", "Sabaneta", "La Ceja", "Apartadó"],
  "Bogotá D.C.": ["Bogotá D.C. (Usaquén)", "Bogotá D.C. (Chapinero)", "Bogotá D.C. (Suba)", "Bogotá D.C. (Teusaquillo)", "Bogotá D.C. (Fontibón)"],
  "Cundinamarca": ["Chía", "Cota", "Soacha", "Facatativá", "Zipaquirá", "Fusagasugá", "Mosquera", "Madrid", "Funza"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "Caldas": ["Manizales", "Villamaría", "Chinchiná"],
  "Quindío": ["Armenia", "Calarcá", "Circasia", "Montenegro"],
  "Tolima": ["Ibagué", "Espinal", "Melgar"],
  "Huila": ["Neiva", "Pitalito", "Garzón"],
  "Bolívar": ["Cartagena", "Turbaco", "Magangué"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Villa de Leyva"],
  "Cauca": ["Popayán", "Santander de Quilichao"],
  "Nariño": ["Pasto", "Ipiales", "Tumaco"],
  "Meta": ["Villavicencio", "Acacías", "Granada"],
  "Norte de Santander": ["Cúcuta", "Los Patios", "Villa del Rosario", "Ocaña"],
  "Magdalena": ["Santa Marta", "Ciénaga"],
  "Córdoba": ["Montería", "Cereté", "Lorica"],
  "Cesar": ["Valledupar", "Aguachica"],
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  onOrderCompleted,
}) => {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || "Beatriz Mendoza");
  const [email, setEmail] = useState(currentUser?.email || "beatriz.m@gmail.com");
  const [address, setAddress] = useState("Calle 15 #28-40, Barrio San Pedro");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Valle del Cauca");
  const [city, setCity] = useState("Palmira");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pse">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos simulados de tarjeta
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8912");
  const [expiry, setExpiry] = useState("12 / 28");
  const [cvv, setCvv] = useState("892");

  // Lista de ciudades dinámicas según departamento
  const availableCities = departamentosColombia[department] || ["Ciudad Principal"];

  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    const cities = departamentosColombia[newDept] || [];
    if (cities.length > 0) {
      setCity(cities[0]);
    }
  };

  // Si no hay productos en el carrito
  if (items.length === 0) {
    return (
      <main className="max-w-[800px] mx-auto px-6 py-20 text-center">
        <Icon name="cart" size={40} className="mx-auto mb-3 opacity-40" />
        <h2 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-[#11120f] mb-2">
          No tienes productos para finalizar compra
        </h2>
        <p className="text-xs text-[#6d6f69] mb-6">
          Tu carrito está vacío. Agrega tus bicicletas o componentes favoritos antes de continuar.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate("home")}>
          Ir al Catálogo
        </Button>
      </main>
    );
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: generateOrderId(),
        customerName: name,
        email,
        address,
        phone,
        shipping,
        createdAt: new Date().toISOString(),
        city: `${city}, ${department}`,
        paymentMethod,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
          selectedSize: i.selectedSize,
        })),
        subtotal,
        tax,
        total,
        status: "Pagado",
        date: new Date().toLocaleString("es-CO"),
      };

      clearCart();
      setIsProcessing(false);
      onOrderCompleted(newOrder);
      onNavigate("success");
    }, 1200);
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 text-left">
      <div className="mb-8">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
          Paso Final · Despacho Seguro
        </span>
        <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight mt-1">
          Finaliza tu Compra
        </h1>
        <p className="text-xs text-[#6d6f69]">
          Entrega rápida a domicilio a nivel nacional y pago protegido con cifrado bancario.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulario de Checkout */}
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
          {/* SECCIÓN 1: DATOS DE ENTREGA */}
          <section className="bg-white p-6 sm:p-7 border border-[#dedfd9] rounded-sm relative shadow-sm">
            <span className="absolute top-6 right-6 font-['Barlow_Condensed'] font-bold text-2xl text-[#ffd400]">
              01
            </span>
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] mb-4">
              Dirección de Despacho
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Correo Electrónico"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Selector de Departamento */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Departamento *
                </label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                >
                  {Object.keys(departamentosColombia).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector / Input de Ciudad con sugerencias */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Ciudad o Municipio *
                </label>
                <input
                  type="text"
                  required
                  list="ciudades-list"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Escribe o selecciona tu ciudad"
                  className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3.5 focus:outline-none focus:border-[#ffd400]"
                />
                <datalist id="ciudades-list">
                  {availableCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <span className="text-[9px] text-[#888]">
                  Sugerencias para {department}: {availableCities.slice(0, 4).join(", ")}...
                </span>
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Dirección de Entrega Detallada"
                  required
                  placeholder="Calle, Carrera, Número, Conjunto o Apartamento"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Teléfono Móvil de Contacto"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="300 000 0000"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: MÉTODO DE PAGO */}
          <section className="bg-white p-6 sm:p-7 border border-[#dedfd9] rounded-sm relative shadow-sm">
            <span className="absolute top-6 right-6 font-['Barlow_Condensed'] font-bold text-2xl text-[#ffd400]">
              02
            </span>
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f] mb-4">
              Método de Pago
            </h2>

            {/* Pestañas de método */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`h-12 text-xs font-bold uppercase tracking-wider border rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  paymentMethod === "card"
                    ? "border-[#11120f] bg-[#11120f] text-white shadow-sm"
                    : "border-[#dedfd9] bg-white text-[#11120f] hover:border-black"
                }`}
              >
                <Icon name="shield" size={15} /> Tarjeta Débito / Crédito
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("pse")}
                className={`h-12 text-xs font-bold uppercase tracking-wider border rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  paymentMethod === "pse"
                    ? "border-[#11120f] bg-[#11120f] text-white shadow-sm"
                    : "border-[#dedfd9] bg-white text-[#11120f] hover:border-black"
                }`}
              >
                <Icon name="check" size={15} /> Transferencia PSE
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <Input
                    label="Número de Tarjeta"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <Input
                  label="Vencimiento"
                  required
                  placeholder="MM / AA"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
                <Input
                  label="CVV / CVC"
                  required
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
                <div className="flex flex-col justify-end text-[11px] text-[#6d6f69] pb-2">
                  <span className="flex items-center gap-1 font-semibold text-[#167648]">
                    <Icon name="check" size={13} /> Pasarela Aprobada
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#f8f8f6] border border-[#dedfd9] rounded-sm text-xs space-y-3">
                <p className="text-[#6d6f69]">
                  Serás redirigido a la pasarela segura de tu entidad bancaria (Bancolombia, Davivienda, Nequi, etc.) al confirmar el pago.
                </p>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f] block mb-1">
                    Selecciona tu Banco:
                  </label>
                  <select className="w-full h-11 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none">
                    <option>Bancolombia</option>
                    <option>Davivienda</option>
                    <option>Nequi / Daviplata</option>
                    <option>Banco de Bogotá</option>
                  </select>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-6"
              disabled={isProcessing}
              icon={<Icon name="arrow" size={17} />}
            >
              {isProcessing
                ? "Procesando Pago Seguro..."
                : `Confirmar y Pagar ${formatCOP(total)}`}
            </Button>
          </section>
        </form>

        {/* Resumen Lateral de los Productos Reales del Carrito */}
        <aside className="lg:col-span-5 bg-[#f8f8f5] p-6 sm:p-7 border border-[#dedfd9] rounded-sm self-start shadow-sm">
          <h3 className="font-['Barlow_Condensed'] font-extrabold text-2xl uppercase tracking-tight text-[#11120f] mb-4 pb-2 border-b border-[#dedfd9]">
            Tu Pedido ({items.length} {items.length === 1 ? "ítem" : "ítems"})
          </h3>

          <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-[#dedfd9] pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-14 object-cover bg-neutral-200 rounded-sm shrink-0"
                />
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold text-[#11120f] line-clamp-1 uppercase">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-[#6d6f69]">
                    <span>Cant: {item.qty}</span>
                    {item.selectedSize && <span> · Talla: {item.selectedSize}</span>}
                  </div>
                  <span className="text-xs font-bold text-[#11120f]">
                    {formatCOP(item.price * item.qty)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#dedfd9] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6d6f69]">Subtotal:</span>
              <span className="font-bold text-[#11120f]">{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6d6f69]">Envío a domicilio:</span>
              <span className={`font-bold ${shipping === 0 ? "text-[#167648]" : "text-[#11120f]"}`}>
                {shipping === 0 ? "Gratis" : formatCOP(shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6d6f69]">Impuestos (19% IVA):</span>
              <span className="text-[#6d6f69]">{formatCOP(tax)}</span>
            </div>
            <div className="pt-3 border-t border-[#dedfd9] flex justify-between items-baseline">
              <span className="font-bold text-sm uppercase text-[#11120f]">Total a Pagar:</span>
              <span className="font-['Barlow_Condensed'] font-extrabold text-3xl text-[#11120f]">
                {formatCOP(total)}
              </span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-white border border-[#dedfd9] rounded-sm text-[11px] text-[#6d6f69] flex items-center gap-2">
            <Icon name="shield" size={16} className="text-[#b59700] shrink-0" />
            <span>Compra protegida y transacción respaldada con garantía oficial BikeStore.</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
