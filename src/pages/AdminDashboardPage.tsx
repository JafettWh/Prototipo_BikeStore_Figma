import React, { useState, useMemo } from "react";
import { Product, Page, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { formatCOP } from "../utils/formatters";
import Logo from "../components/atoms/Logo";
import Icon from "../components/atoms/Icon";
import Badge from "../components/atoms/Badge";
import Button from "../components/atoms/Button";
import MetricCard from "../components/molecules/MetricCard";
import ProductFormModal from "../components/organisms/ProductFormModal";
import ProductDeactivateModal from "../components/organisms/ProductDeactivateModal";
import UserFormModal from "../components/organisms/UserFormModal";

interface AdminDashboardPageProps {
  products: Product[];
  onNavigate: (page: Page) => void;
  onSaveProduct: (product: Partial<Product>) => void;
  onDeactivateProduct: (productId: number, reason: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  products,
  onNavigate,
  onSaveProduct,
  onDeactivateProduct,
}) => {
  const { users, currentUser, logout, addUser, updateUser, deactivateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "users">("dashboard");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("Todas");
  const [userSearch, setUserSearch] = useState("");

  // Modales de productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDeactivate, setProductToDeactivate] = useState<Product | null>(null);

  // Modales de usuarios
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Alerta temporal de notificación
  const [adminNotice, setAdminNotice] = useState("");

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(""), 3500);
  };

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory =
        productCategoryFilter === "Todas" || p.section === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u: User) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const handleExportReport = (format: "Excel" | "PDF") => {
    showNotice(`Informe financiero mensual generado y descargado en formato ${format}.`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f3f0] text-left">
      {/* SIDEBAR ADMINISTRATIVO */}
      <aside className="w-full md:w-64 bg-[#11120f] text-white p-6 flex flex-col justify-between shrink-0 border-r border-[#2d2e2b]">
        <div>
          {/* Cabecera con Logo oficial sin textos duplicados */}
          <div className="pb-6 border-b border-[#2d2e2b] mb-6 flex items-center justify-between">
            <div>
              <Logo onClick={() => onNavigate("home")} size="md" />
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#ffd400] block mt-2">
                Panel de Administración
              </span>
            </div>
          </div>

          {/* Menú de Navegación del Panel */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 text-left ${
                activeTab === "dashboard"
                  ? "bg-[#ffd400] text-[#11120f] shadow-md font-extrabold ring-1 ring-[#ffd400]"
                  : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name="sparkles" size={17} /> Resumen & Métricas
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 text-left ${
                activeTab === "products"
                  ? "bg-[#ffd400] text-[#11120f] shadow-md font-extrabold ring-1 ring-[#ffd400]"
                  : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name="bike" size={17} /> Gestión de Productos
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 text-left ${
                activeTab === "users"
                  ? "bg-[#ffd400] text-[#11120f] shadow-md font-extrabold ring-1 ring-[#ffd400]"
                  : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name="user" size={17} /> Administrar Usuarios
            </button>
          </nav>
        </div>

        {/* Sección de Usuario y Logout */}
        <div className="pt-6 border-t border-[#2d2e2b] mt-8 space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-9 h-9 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-extrabold text-sm shadow">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </span>
            <div className="overflow-hidden flex-1">
              <span className="font-bold block truncate text-white">
                {currentUser?.name || "Administrador BikeStore"}
              </span>
              <span className="text-[10px] text-[#ffd400] font-semibold uppercase tracking-wider block">
                {currentUser?.role || "Administrador"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onNavigate("home")}
              className="w-full py-2.5 px-3 text-[10px] font-bold uppercase border border-[#444] text-neutral-300 hover:text-white hover:border-white rounded-sm transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="arrow-left" size={13} /> Volver a la Tienda
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 text-[10px] font-bold uppercase bg-red-950/40 border border-red-700/60 text-red-300 hover:bg-red-900/60 hover:text-white rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="logout" size={13} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DEL DASHBOARD */}
      <main className="flex-1 p-6 sm:p-10 overflow-x-hidden">
        {/* Cabecera del Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#dedfd9]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Módulo de Control · BikeStore Colombia
            </span>
            <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight">
              {activeTab === "dashboard" && "Dashboard de Métricas & Rendimiento"}
              {activeTab === "products" && "Administración de Catálogo"}
              {activeTab === "users" && "Gestión de Usuarios & Seguridad"}
            </h1>
          </div>

          {activeTab === "dashboard" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("Excel")}
                icon={<Icon name="download" size={14} />}
                iconPosition="left"
              >
                Exportar Excel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => handleExportReport("PDF")}
                icon={<Icon name="download" size={14} />}
                iconPosition="left"
              >
                Exportar PDF
              </Button>
            </div>
          )}

          {activeTab === "products" && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              icon={<Icon name="plus" size={16} />}
              iconPosition="left"
            >
              Registrar Producto
            </Button>
          )}

          {activeTab === "users" && (
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                icon={<Icon name="plus" size={16} />}
                iconPosition="left"
              >
                Crear Nuevo Usuario
              </Button>
            </div>
          )}
        </div>

        {/* Notificación Temporal */}
        {adminNotice && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-sm flex items-center gap-2 animate-fade-in shadow-sm">
            <Icon name="check" size={16} />
            <span>{adminNotice}</span>
          </div>
        )}

        {/* PESTAÑA 1: RESUMEN & MÉTRICAS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Tarjetas de Métricas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <MetricCard
                title="Ventas Totales del Mes"
                value="$124.500.000"
                subtext="+18.2% frente al mes anterior"
                trend="+18.2%"
                iconName="sparkles"
              />
              <MetricCard
                title="Cantidad de Pedidos"
                value="420"
                subtext="38 pedidos listos para despacho"
                trend="+8.5%"
                iconName="cart"
              />
              <MetricCard
                title="Ticket Promedio por Cliente"
                value="$296.400"
                subtext="Promedio por orden completada"
                trend="+4.1%"
                iconName="shield"
              />
            </div>

            {/* Alertas Operacionales */}
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm flex items-start gap-3 shadow-sm">
              <span className="text-amber-700 mt-0.5 shrink-0">
                <Icon name="alert-triangle" size={20} />
              </span>
              <div className="text-xs">
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
                  Alertas Operacionales en Tiempo Real:
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-amber-800">
                  <li>
                    <strong>Inventario:</strong> Specialized Turbo Vado tiene 0 unidades en almacén.
                  </li>
                  <li>
                    <strong>Taller Técnico:</strong> 2 bicicletas en banco de trabajo esperan entrega programada hoy.
                  </li>
                </ul>
              </div>
            </div>

            {/* Gráfico Semanal */}
            <div className="bg-white p-6 border border-[#dedfd9] rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
                    Comportamiento de Ventas Semanales (COP)
                  </h3>
                  <p className="text-xs text-[#6d6f69]">
                    Monitoreo diario de pedidos aprobados por pasarela de pago.
                  </p>
                </div>
                <Badge variant="green">Operación Óptima</Badge>
              </div>

              <div className="h-48 flex items-end gap-3 sm:gap-6 border-b border-[#dedfd9] pb-2 pt-6">
                {[
                  { day: "Lun", val: 45, monto: "$14.2M" },
                  { day: "Mar", val: 68, monto: "$21.5M" },
                  { day: "Mié", val: 52, monto: "$16.8M" },
                  { day: "Jue", val: 84, monto: "$28.4M" },
                  { day: "Vie", val: 95, monto: "$32.1M" },
                  { day: "Sáb", val: 120, monto: "$41.0M" },
                  { day: "Dom", val: 76, monto: "$24.5M" },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-[#11120f] opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.monto}
                    </span>
                    <div
                      style={{ height: `${bar.val * 1.3}px` }}
                      className="w-full bg-[#11120f] group-hover:bg-[#ffd400] transition-all rounded-t-sm border-t-4 border-[#ffd400]"
                    />
                    <span className="text-[11px] font-bold text-[#6d6f69] uppercase">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: GESTIÓN DE PRODUCTOS */}
        {activeTab === "products" && (
          <div className="bg-white border border-[#dedfd9] rounded-sm overflow-hidden shadow-sm">
            {/* Herramientas de Búsqueda y Filtro */}
            <div className="p-5 border-b border-[#dedfd9] bg-[#fcfcfb] flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o categoría..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="h-11 bg-white border border-[#dedfd9] text-xs px-3.5 w-full sm:max-w-md focus:outline-none focus:border-[#ffd400]"
                />
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="h-11 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none"
                >
                  <option value="Todas">Todas las Secciones</option>
                  <option value="Bicicletas">Bicicletas</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <span className="text-xs text-[#6d6f69] self-center">
                Mostrando <strong>{filteredProducts.length}</strong> de {products.length} productos
              </span>
            </div>

            {/* Tabla de Productos */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#11120f] text-white uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Producto</th>
                    <th className="p-3.5">Sección / Categoría</th>
                    <th className="p-3.5">Precio Unitario</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dedfd9]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#fbfbf9] transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-12 h-10 object-contain rounded-sm bg-[#f8f8f5] p-1 border border-[#eee] shrink-0"
                        />
                        <div>
                          <b className="font-bold text-[#11120f] block line-clamp-1">
                            {p.name}
                          </b>
                          {p.badge && (
                            <span className="text-[10px] text-[#b59700] font-bold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-[#555]">
                        {p.section} · {p.category}
                      </td>
                      <td className="p-3.5 font-bold text-[#11120f]">
                        {formatCOP(p.price)}
                      </td>
                      <td className="p-3.5">
                        {p.stock === 0 ? (
                          <span className="text-red-600 font-bold">Agotado (0)</span>
                        ) : (
                          <span>{p.stock} unid.</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <Badge variant={p.status === "Activo" ? "green" : "red"}>
                          {p.status}
                        </Badge>
                        {p.status === "Inactivo" && p.inactivationReason && (
                          <span className="block text-[10px] text-[#777] italic mt-0.5 line-clamp-1">
                            Motivo: {p.inactivationReason}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setProductToEdit(p);
                            setIsProductModalOpen(true);
                          }}
                          className="text-[#11120f] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          Editar
                        </button>
                        <span>·</span>
                        {p.status === "Activo" ? (
                          <button
                            onClick={() => setProductToDeactivate(p)}
                            className="text-red-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Inactivar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSaveProduct({ ...p, status: "Activo" });
                              showNotice(`Producto ${p.name} reactivado en catálogo.`);
                            }}
                            className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Reactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: ADMINISTRAR USUARIOS & SEGURIDAD */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Tarjetas resumen de cuentas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Total Usuarios Registrados
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#11120f] block mt-1">
                  {users.length}
                </span>
              </div>
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Cuentas con Rol Administrador
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#b59700] block mt-1">
                  {users.filter((u: User) => u.role === "admin" && u.status === "Activo").length}
                </span>
              </div>
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Clientes Activos
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#167648] block mt-1">
                  {users.filter((u: User) => u.role === "cliente" && u.status === "Activo").length}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#dedfd9] rounded-sm overflow-hidden shadow-sm">
              {/* Buscador de Usuarios */}
              <div className="p-5 border-b border-[#dedfd9] bg-[#fcfcfb] flex flex-col sm:flex-row justify-between gap-4">
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre, correo o rol..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-11 bg-white border border-[#dedfd9] text-xs px-3.5 w-full sm:max-w-md focus:outline-none focus:border-[#ffd400]"
                />

                <span className="text-xs text-[#6d6f69] self-center">
                  Total usuarios filtrados: <strong>{filteredUsers.length}</strong>
                </span>
              </div>

              {/* Tabla de Usuarios */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#11120f] text-white uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Nombre Completo</th>
                      <th className="p-3.5">Correo Electrónico</th>
                      <th className="p-3.5">Rol en el Sistema</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dedfd9]">
                    {filteredUsers.map((u: User) => (
                      <tr key={u.id} className="hover:bg-[#fbfbf9] transition-colors">
                        <td className="p-3.5 font-bold text-[#11120f]">
                          {u.name}
                        </td>
                        <td className="p-3.5 text-[#6d6f69]">
                          {u.email}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-sm text-[10px] uppercase ${
                              u.role === "admin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                                : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {u.role === "admin" ? "Administrador" : "Cliente"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <Badge variant={u.status === "Activo" ? "green" : "red"}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setUserToEdit(u);
                              setIsUserModalOpen(true);
                            }}
                            className="text-[#11120f] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Editar Rol
                          </button>
                          <span>·</span>
                          {u.status === "Activo" ? (
                            <button
                              onClick={() => {
                                const res = deactivateUser(u.id);
                                if (res.success) {
                                  showNotice(res.message);
                                } else {
                                  alert(res.message);
                                }
                              }}
                              className="text-red-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                            >
                              Inactivar Cuenta
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                updateUser(u.id, { status: "Activo" });
                                showNotice(`Cuenta de ${u.name} activada.`);
                              }}
                              className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                            >
                              Reactivar Cuenta
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALES DEL PANEL */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(data: Partial<Product>) => {
          onSaveProduct(data);
          showNotice(
            productToEdit
              ? `Producto ${data.name} actualizado exitosamente.`
              : `Producto ${data.name} registrado en catálogo.`
          );
        }}
      />

      <ProductDeactivateModal
        isOpen={!!productToDeactivate}
        product={productToDeactivate}
        onClose={() => setProductToDeactivate(null)}
        onConfirm={(id: number, reason: string) => {
          onDeactivateProduct(id, reason);
          showNotice("Producto retirado del catálogo público con justificación registrada.");
        }}
      />

      <UserFormModal
        isOpen={isUserModalOpen}
        userToEdit={userToEdit}
        onClose={() => setIsUserModalOpen(false)}
        onSave={(data: { name: string; email: string; role: "admin" | "cliente"; status: "Activo" | "Inactivo" }) => {
          if (userToEdit) {
            const res = updateUser(userToEdit.id, data);
            if (res.success) {
              showNotice(res.message);
            } else {
              alert(res.message);
            }
          } else {
            const res = addUser(data);
            if (res.success) {
              showNotice(res.message);
            } else {
              alert(res.message);
            }
          }
        }}
      />
    </div>
  );
};

export default AdminDashboardPage;
