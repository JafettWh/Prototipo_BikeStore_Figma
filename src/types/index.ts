export type Page =
  | "home"
  | "product"
  | "cart"
  | "checkout"
  | "success"
  | "login"
  | "register"
  | "recovery"
  | "admin";

export type ProductCategory =
  | "Bicicletas"
  | "Montaña"
  | "Carretera / Ruta"
  | "Gravel"
  | "E-Bike"
  | "Componentes"
  | "Transmisión"
  | "Bielas"
  | "Ruedas"
  | "Asiento"
  | "Manubrio"
  | "Cassette"
  | "Accesorios"
  | "Iluminación"
  | "Protección"
  | "Hidratación"
  | "Tecnología"
  | "Herramientas"
  | "Sensores";

export interface ProductSpecs {
  cuadro?: string;
  horquilla?: string;
  transmision?: string;
  frenos?: string;
  peso?: string;
  material?: string;
  garantia?: string;
  bateria?: string;
  autonomia?: string;
  certificacion?: string;
  capacidad?: string;
  pantalla?: string;
  conectividad?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: number;
  name: string;
  category: ProductCategory | string;
  section: "Bicicletas" | "Componentes" | "Accesorios";
  price: number;
  stock: number;
  image: string;
  gallery?: string[];
  badge?: "Nuevo" | "Más Vendido" | "Oferta" | "Pro" | string;
  description: string;
  specs: ProductSpecs;
  sizes?: string[];
  status: "Activo" | "Inactivo";
  inactivationReason?: string;
}

export interface CartItem extends Product {
  qty: number;
  selectedSize?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "cliente";
  status: "Activo" | "Inactivo";
  createdAt: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  selectedSize?: string;
}

export interface Order {
  id: string; // ej. BS-202610-4821
  customerName: string;
  email: string;
  address: string;
  phone?: string;
  shipping?: number;
  createdAt?: string;
  city: string;
  paymentMethod: "card" | "pse" | "bancolombia";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Pagado" | "En preparación" | "En camino" | "Entregado";
  date: string;
}
