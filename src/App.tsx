import React, { useState, useEffect } from "react";
import { Page, Product, Order, MaintenanceBooking, MaintenanceService } from "./types";
import { initialProducts } from "./data/products";
import { maintenanceServices, sampleBookings } from "./data/maintenance";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

// Componentes Templates y Organismos
import MainLayout from "./components/templates/MainLayout";
import SearchModal from "./components/organisms/SearchModal";
import MaintenanceScheduleModal from "./components/organisms/MaintenanceScheduleModal";
import MaintenanceTrackingModal from "./components/organisms/MaintenanceTrackingModal";
import Toast from "./components/molecules/Toast";

// Páginas Atómicas
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MaintenancePage from "./pages/MaintenancePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [products, setProducts] = useState<Product[]>(() => {
    const catalogVersion = localStorage.getItem("bikestore_catalog_version");
    const saved = localStorage.getItem("bikestore_catalog_products");
    return saved && catalogVersion === "2" ? JSON.parse(saved) : initialProducts;
  });
  const [checkoutAfterAuth, setCheckoutAfterAuth] = useState(false);

  const [bookings, setBookings] = useState<MaintenanceBooking[]>(() => {
    const saved = localStorage.getItem("bikestore_maintenance_bookings");
    return saved ? JSON.parse(saved) : sampleBookings;
  });

  // Producto seleccionado para el detalle dinámico (CU-02)
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  // Último pedido completado para la pantalla de éxito (CU-08, RF-10)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("bikestore_orders");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("bikestore_orders", JSON.stringify(orders));
  }, [orders]);

  // Modales interactivos
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [serviceToBook, setServiceToBook] = useState<MaintenanceService | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Toast reactivo
  const [toastMessage, setToastMessage] = useState("");
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  const { addItem } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    localStorage.setItem("bikestore_catalog_products", JSON.stringify(products));
    localStorage.setItem("bikestore_catalog_version", "2");
  }, [products]);

  useEffect(() => {
    localStorage.setItem("bikestore_maintenance_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(message);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage("");
      setToastAction(null);
    }, 4000);
  };

  const handleNavigate = (page: Page) => {
    if (page === "checkout" && !currentUser) {
      setCheckoutAfterAuth(true);
      setCurrentPage("login");
      showToast("Para confirmar tu compra debes iniciar sesión. Te llevamos al acceso seguro.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (page !== "login" && page !== "register" && page !== "recovery") {
      setCheckoutAfterAuth(false);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate("product");
  };

  const handleAddToCart = (product: Product, qty = 1, selectedSize?: string) => {
    const result = addItem(product, qty, selectedSize);
    if (result.success) {
      showToast(result.message, {
        label: "Ver Carrito",
        onClick: () => handleNavigate("cart"),
      });
    } else {
      showToast(result.message);
    }
  };

  // Guardar o actualizar producto desde el Admin (CU-09, CU-11)
  const handleSaveProduct = (productData: Partial<Product>) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === productData.id);
      if (exists) {
        return prev.map((p) => (p.id === productData.id ? ({ ...p, ...productData } as Product) : p));
      }
      return [productData as Product, ...prev];
    });
  };

  // Inactivar producto con justificación obligatoria (CU-12)
  const handleDeactivateProduct = (productId: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: "Inactivo", inactivationReason: reason } : p
      )
    );
  };

  // Registrar nueva reserva de mantenimiento
  const handleBookingCreated = (newBooking: MaintenanceBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`¡Cita agendada! Tu radicado es #${newBooking.id}`, {
      label: "Consultar Avance",
      onClick: () => setIsTrackingModalOpen(true),
    });
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
    >
      {/* Vistas según la página activa */}
      {currentPage === "home" && (
        <HomePage
          products={products}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onSelectProduct={handleSelectProduct}
          onNavigate={handleNavigate}
          onOpenMaintenanceModal={() => {
            setServiceToBook(null);
            setIsScheduleModalOpen(true);
          }}
        />
      )}

      {currentPage === "product" && (
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "maintenance" && (
        <MaintenancePage
          services={maintenanceServices}
          onOpenScheduleModal={(service) => {
            setServiceToBook(service || null);
            setIsScheduleModalOpen(true);
          }}
          onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "cart" && <CartPage onNavigate={handleNavigate} />}

      {currentPage === "checkout" && (
        <CheckoutPage
          onNavigate={handleNavigate}
          onOrderCompleted={(order) => {
            setCompletedOrder(order);
            setOrders((prev) => [order, ...prev]);
          }}
        />
      )}

      {currentPage === "success" && (
        <SuccessPage order={completedOrder} onNavigate={handleNavigate} />
      )}

      {(currentPage === "login" || currentPage === "register" || currentPage === "recovery") && (
        <AuthPage
          mode={currentPage}
          onNavigate={handleNavigate}
          returnAfterAuth={checkoutAfterAuth ? "checkout" : undefined}
        />
      )}

      {currentPage === "admin" && (
        <AdminDashboardPage
          orders={orders}
          bookings={bookings}
          products={products}
          onNavigate={handleNavigate}
          onSaveProduct={handleSaveProduct}
          onDeactivateProduct={handleDeactivateProduct}
        />
      )}

      {/* Modales Globales */}
      <SearchModal
        products={products.filter((p) => p.status === "Activo")}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <MaintenanceScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        selectedService={serviceToBook}
        services={maintenanceServices}
        onBookingSuccess={handleBookingCreated}
      />

      <MaintenanceTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        bookings={bookings}
      />

      {/* Alerta Toast Flotante */}
      <Toast
        message={toastMessage}
        actionLabel={toastAction?.label}
        onAction={toastAction?.onClick}
        onClose={() => setToastMessage("")}
      />
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
