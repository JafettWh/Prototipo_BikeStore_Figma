import React, { useState, useMemo } from "react"
import { Product, Page, User, Order } from "../types"
import { exportReport, salesSummary } from "../utils/documents"
import { useAuth } from "../context/AuthContext"
import { formatCOP } from "../utils/formatters"
import Logo from "../components/atoms/Logo"
import Icon from "../components/atoms/Icon"
import Badge from "../components/atoms/Badge"
import Button from "../components/atoms/Button"
import MetricCard from "../components/molecules/MetricCard"
import ProductFormModal from "../components/organisms/ProductFormModal"
import ProductDeactivateModal from "../components/organisms/ProductDeactivateModal"
import UserFormModal from "../components/organisms/UserFormModal"

interface AdminDashboardPageProps {
  orders: Order[]
  products: Product[]
  onNavigate: (page: Page) => void
  onSaveProduct: (product: Partial<Product>) => void
  onDeactivateProduct: (productId: number, reason: string) => void
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  products = [],
  orders = [],
  onNavigate,
  onSaveProduct,
  onDeactivateProduct,
}) => {
  const {
    users = [],
    currentUser,
    logout,
    addUser,
    updateUser,
    deactivateUser,
  } = useAuth()

  const [activeTab, setActiveTab] =
    useState<"dashboard" | "products" | "users">("dashboard")
  const [productSearch, setProductSearch] = useState("")
  const [productCategoryFilter, setProductCategoryFilter] = useState("Todas")
  const [userSearch, setUserSearch] = useState("")
  const [salesChartView, setSalesChartView] =
    useState<"days" | "months">("days")
  const [salesChartYear, setSalesChartYear] = useState(
    new Date().getFullYear(),
  )
  const [salesChartMonth, setSalesChartMonth] = useState(new Date().getMonth())
  const [salesCategory, setSalesCategory] = useState("Todas")

  // Modales de productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDeactivate, setProductToDeactivate] =
    useState<Product | null>(null)

  // Modales de usuarios
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  // Alerta temporal
  const [adminNotice, setAdminNotice] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const summary = useMemo(() => salesSummary(orders), [orders])
  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) => ({
        value: month,
        label: new Intl.DateTimeFormat("es-CO", { month: "long" }).format(
          new Date(2024, month, 1),
        ),
        shortLabel: new Intl.DateTimeFormat("es-CO", {
          month: "short",
        })
          .format(new Date(2024, month, 1))
          .replace(".", ""),
      })),
    [],
  )
  const salesYears = useMemo(
    () =>
      Array.from(
        new Set([
          new Date().getFullYear(),
          ...orders
            .map((order) => new Date(order.createdAt || "").getFullYear())
            .filter((year) => !Number.isNaN(year)),
        ]),
      ).sort((a, b) => b - a),
    [orders],
  )
  const productSectionById = useMemo(
    () => new Map(products.map((product) => [product.id, product.section])),
    [products],
  )
  const salesChartData = useMemo(() => {
    const pointCount =
      salesChartView === "days"
        ? new Date(salesChartYear, salesChartMonth + 1, 0).getDate()
        : 12

    return Array.from({ length: pointCount }, (_, index) => {
      const total = orders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt || "")
        const matchesPeriod =
          orderDate.getFullYear() === salesChartYear &&
          (salesChartView === "months" ||
            orderDate.getMonth() === salesChartMonth) &&
          (salesChartView === "days"
            ? orderDate.getDate() === index + 1
            : orderDate.getMonth() === index)

        if (!matchesPeriod) return sum

        return (
          sum +
          order.items.reduce((itemSum, item) => {
            const matchesCategory =
              salesCategory === "Todas" ||
              productSectionById.get(item.id) === salesCategory
            return matchesCategory ? itemSum + item.price * item.qty : itemSum
          }, 0)
        )
      }, 0)

      return {
        label:
          salesChartView === "days"
            ? String(index + 1)
            : monthOptions[index].shortLabel,
        total,
      }
    })
  }, [
    monthOptions,
    orders,
    productSectionById,
    salesCategory,
    salesChartMonth,
    salesChartView,
    salesChartYear,
  ])
  const maxChartSales = Math.max(
    1,
    ...salesChartData.map((point) => point.total),
  )

  const showNotice = (msg: string) => {
    setAdminNotice(msg)
    setTimeout(() => setAdminNotice(""), 3500)
  }

  const handleLogout = () => {
    logout()
    onNavigate("home")
  }

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    const list = products || []
    return list.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase())
      const matchesCategory =
        productCategoryFilter === "Todas" || p.section === productCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, productSearch, productCategoryFilter])

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    const list = users || []
    return list.filter(
      (u: User) =>
        (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.role && u.role.toLowerCase().includes(userSearch.toLowerCase())),
    )
  }, [users, userSearch])

  const handleExportReport = async (format: "Excel" | "PDF") => {
    setIsExporting(true)
    try {
      await exportReport(format, orders, products, users)
      showNotice(`Informe ${format} generado. Descarga iniciada.`)
    } catch {
      showNotice("No se pudo generar el informe. Intenta nuevamente.")
    } finally {
      setIsExporting(false)
    }
  }

  const safeUsers = users || []

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f3f0] text-left w-full">
      {/* SIDEBAR ADMINISTRATIVO CORREGIDO */}
      <aside className="w-full md:w-64 bg-[#11120f] text-white p-6 flex flex-col justify-between shrink-0 border-r border-[#2d2e2b] min-h-screen">
        <div className="flex flex-col gap-6">
          {/* Cabecera con Logo */}
          <div className="pb-6 border-b border-[#2d2e2b]">
            <Logo onClick={() => onNavigate("home")} size="md" />
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#ffd400] block mt-2">
              Panel de Administración
            </span>
          </div>

          {/* Menú de Navegación Vertical */}
          <nav className="flex flex-col gap-2">
            <button
              type="button"
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
              type="button"
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
              type="button"
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

        {/* Sección de Usuario y Sesión */}
        <div className="pt-6 border-t border-[#2d2e2b] mt-8 space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-9 h-9 rounded-full bg-[#ffd400] text-[#11120f] flex items-center justify-center font-extrabold text-sm shadow">
              {currentUser?.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "A"}
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
              type="button"
              onClick={() => onNavigate("home")}
              className="w-full py-2.5 px-3 text-[10px] font-bold uppercase border border-[#444] text-neutral-300 hover:text-white hover:border-white rounded-sm transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="arrow-left" size={13} /> Volver a la Tienda
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-3 text-[10px] font-bold uppercase bg-red-950/40 border border-red-700/60 text-red-300 hover:bg-red-900/60 hover:text-white rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="logout" size={13} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 sm:p-10 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#dedfd9]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Módulo de Control · BikeStore Colombia
            </span>
            <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight">
              {activeTab === "dashboard" &&
                "Dashboard de Métricas & Rendimiento"}
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
                disabled={isExporting}
                icon={<Icon name="download" size={14} />}
                iconPosition="left"
              >
                Exportar Excel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => handleExportReport("PDF")}
                disabled={isExporting}
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
                setProductToEdit(null)
                setIsProductModalOpen(true)
              }}
              icon={<Icon name="plus" size={16} />}
              iconPosition="left"
            >
              Registrar Producto
            </Button>
          )}

          {activeTab === "users" && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setUserToEdit(null)
                setIsUserModalOpen(true)
              }}
              icon={<Icon name="plus" size={16} />}
              iconPosition="left"
            >
              Crear Nuevo Usuario
            </Button>
          )}
        </div>

        {/* Notificación Temporal */}
        {adminNotice && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-sm flex items-center gap-2 animate-fade-in shadow-sm">
            <Icon name="check" size={16} />
            <span>{adminNotice}</span>
          </div>
        )}

        {/* PESTAÑA 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <MetricCard
                title="Ventas Totales del Mes"
                value={formatCOP(summary.total)}
                subtext={`Pedidos locales · ${summary.period}`}
                iconName="sparkles"
              />
              <MetricCard
                title="Cantidad de Pedidos"
                value={String(summary.monthly.length)}
                subtext="Pedidos registrados este mes en este navegador"
                iconName="cart"
              />
              <MetricCard
                title="Ticket Promedio por Cliente"
                value={formatCOP(summary.average)}
                subtext="Promedio por pedido del mes"
                iconName="shield"
              />
            </div>

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
                    <strong>Inventario:</strong> {products.filter((p) => p.stock === 0).length} productos sin existencias.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#dedfd9] rounded-sm shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
                <div>
                  <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
                    {salesChartView === "days"
                      ? "Ventas diarias del mes"
                      : "Ventas mensuales del año"}{" "}
                    (COP)
                  </h3>
                  <p className="text-xs text-[#6d6f69]">
                    Valor de los productos vendidos, sin incluir envío. Datos
                    registrados en este navegador.
                  </p>
                </div>
                <Badge variant="yellow">Datos locales</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-4 bg-[#f4f4f0] border border-[#dedfd9] mb-5">
                <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Vista temporal
                  <select
                    value={salesChartView}
                    onChange={(event) =>
                      setSalesChartView(
                        event.target.value as "days" | "months",
                      )
                    }
                    className="h-10 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                  >
                    <option value="days">Todos los días del mes</option>
                    <option value="months">Todos los meses del año</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Año
                  <select
                    value={salesChartYear}
                    onChange={(event) =>
                      setSalesChartYear(Number(event.target.value))
                    }
                    className="h-10 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                  >
                    {salesYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Mes
                  <select
                    value={salesChartMonth}
                    onChange={(event) =>
                      setSalesChartMonth(Number(event.target.value))
                    }
                    disabled={salesChartView === "months"}
                    className="h-10 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400] disabled:bg-[#e7e7e2] disabled:text-[#8b8d86]"
                  >
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                  Categoría de producto
                  <select
                    value={salesCategory}
                    onChange={(event) => setSalesCategory(event.target.value)}
                    className="h-10 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
                  >
                    <option value="Todas">Todas las categorías</option>
                    <option value="Bicicletas">Bicicletas</option>
                    <option value="Componentes">Componentes</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-[11px]">
                <div className="bg-[#f4f4f0] border-l-4 border-[#ffd400] px-3 py-2 text-[#555750]">
                  <strong className="text-[#11120f]">
                    Eje X · {salesChartView === "days" ? "Día" : "Mes"}:
                  </strong>{" "}
                  {salesChartView === "days"
                    ? `todos los días de ${monthOptions[salesChartMonth].label} de ${salesChartYear}.`
                    : `todos los meses del año ${salesChartYear}.`}
                </div>
                <div className="bg-[#f4f4f0] border-l-4 border-[#11120f] px-3 py-2 text-[#555750]">
                  <strong className="text-[#11120f]">Eje Y · Ventas:</strong>{" "}
                  total vendido en pesos colombianos para{" "}
                  {salesCategory === "Todas"
                    ? "todas las categorías"
                    : salesCategory.toLowerCase()}
                  .
                </div>
              </div>

              <div className="max-w-full overflow-x-auto overscroll-x-contain pb-3">
                <div
                  className={`flex ${
                    salesChartView === "days"
                      ? "min-w-[960px]"
                      : "min-w-[680px]"
                  }`}
                >
                  <div className="w-24 shrink-0 flex">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6d6f69] [writing-mode:vertical-rl] rotate-180 text-center py-5">
                      Eje Y · Ventas (COP)
                    </span>
                    <div className="h-56 flex-1 flex flex-col justify-between items-end pr-2 pb-7 pt-2 text-[9px] font-bold text-[#6d6f69]">
                      <span>
                        {formatCOP(maxChartSales === 1 ? 0 : maxChartSales)}
                      </span>
                      <span>
                        {formatCOP(
                          maxChartSales === 1 ? 0 : maxChartSales / 2,
                        )}
                      </span>
                      <span>{formatCOP(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-56 flex items-end gap-2 border-b border-l border-[#dedfd9] px-2 pb-2 pt-6">
                      {salesChartData.map((bar, index) => (
                        <div
                          key={`${bar.label}-${index}`}
                          className="min-w-5 flex-1 flex flex-col items-center gap-2 group"
                          title={`${salesChartView === "days" ? "Día" : "Mes"} ${bar.label}: ${formatCOP(bar.total)}`}
                        >
                          <span className="text-[9px] font-bold text-[#11120f] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatCOP(bar.total)}
                          </span>
                          <div
                            style={{
                              height: `${(bar.total / maxChartSales) * 156}px`,
                            }}
                            className="w-full min-h-1 bg-[#11120f] group-hover:bg-[#ffd400] transition-all rounded-t-sm border-t-4 border-[#ffd400]"
                          />
                          <span className="text-[10px] font-bold text-[#6d6f69] uppercase">
                            {bar.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-[9px] font-extrabold uppercase tracking-wider text-[#6d6f69] mt-2 mb-0">
                      Eje X ·{" "}
                      {salesChartView === "days"
                        ? "Día del mes"
                        : "Mes del año"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#6d6f69] text-center mb-0">
                Usa la barra horizontal inferior para recorrer todos los{" "}
                {salesChartView === "days" ? "días" : "meses"} sin salir del
                contenedor.
              </p>
            </div>

          </div>
        )}

        {/* PESTAÑA 2: PRODUCTOS */}
        {activeTab === "products" && (
          <div className="bg-white border border-[#dedfd9] rounded-sm overflow-hidden shadow-sm">
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
                Mostrando <strong>{filteredProducts.length}</strong> de{" "}
                {products.length} productos
              </span>
            </div>

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
                    <tr
                      key={p.id}
                      className="hover:bg-[#fbfbf9] transition-colors"
                    >
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
                          <span className="text-red-600 font-bold">
                            Agotado (0)
                          </span>
                        ) : (
                          <span>{p.stock} unid.</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <Badge
                          variant={p.status === "Activo" ? "green" : "red"}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProductToEdit(p)
                            setIsProductModalOpen(true)
                          }}
                          className="text-[#11120f] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          Editar
                        </button>
                        <span>·</span>
                        {p.status === "Activo" ? (
                          <button
                            type="button"
                            onClick={() => setProductToDeactivate(p)}
                            className="text-red-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Inactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onSaveProduct({ ...p, status: "Activo" })
                              showNotice(
                                `Producto ${p.name} reactivado en catálogo.`,
                              )
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

        {/* PESTAÑA 3: USUARIOS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Total Usuarios Registrados
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#11120f] block mt-1">
                  {safeUsers.length}
                </span>
              </div>
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Cuentas con Rol Administrador
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#b59700] block mt-1">
                  {
                    safeUsers.filter(
                      (u: User) => u.role === "admin" && u.status === "Activo",
                    ).length
                  }
                </span>
              </div>
              <div className="bg-white p-5 border border-[#dedfd9] rounded-sm">
                <span className="text-[10px] font-bold uppercase text-[#777a71] block">
                  Clientes Activos
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#167648] block mt-1">
                  {
                    safeUsers.filter(
                      (u: User) =>
                        u.role === "cliente" && u.status === "Activo",
                    ).length
                  }
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#dedfd9] rounded-sm overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#dedfd9] bg-[#fcfcfb] flex flex-col sm:flex-row justify-between gap-4">
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre, correo o rol..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-11 bg-white border border-[#dedfd9] text-xs px-3.5 w-full sm:max-w-md focus:outline-none focus:border-[#ffd400]"
                />

                <span className="text-xs text-[#6d6f69] self-center">
                  Total usuarios filtrados:{" "}
                  <strong>{filteredUsers.length}</strong>
                </span>
              </div>

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
                      <tr
                        key={u.id}
                        className="hover:bg-[#fbfbf9] transition-colors"
                      >
                        <td className="p-3.5 font-bold text-[#11120f]">
                          {u.name}
                        </td>
                        <td className="p-3.5 text-[#6d6f69]">{u.email}</td>
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
                          <Badge
                            variant={u.status === "Activo" ? "green" : "red"}
                          >
                            {u.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setUserToEdit(u)
                              setIsUserModalOpen(true)
                            }}
                            className="text-[#11120f] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Editar Usuario
                          </button>
                          <span>·</span>
                          {u.status === "Activo" ? (
                            <button
                              type="button"
                              onClick={() => {
                                const res = deactivateUser(u.id)
                                if (res && res.success) {
                                  showNotice(res.message)
                                } else if (res) {
                                  alert(res.message)
                                }
                              }}
                              className="text-red-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                            >
                              Inactivar Cuenta
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateUser(u.id, { status: "Activo" })
                                showNotice(`Cuenta de ${u.name} activada.`)
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

      {/* MODALES */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(data: Partial<Product>) => {
          onSaveProduct(data)
          showNotice(
            productToEdit
              ? `Producto ${data.name} actualizado exitosamente.`
              : `Producto ${data.name} registrado en catálogo.`,
          )
        }}
      />

      <ProductDeactivateModal
        isOpen={!!productToDeactivate}
        product={productToDeactivate}
        onClose={() => setProductToDeactivate(null)}
        onConfirm={(id: number, reason: string) => {
          onDeactivateProduct(id, reason)
          showNotice(
            "Producto retirado del catálogo público con justificación registrada.",
          )
        }}
      />

      <UserFormModal
        isOpen={isUserModalOpen}
        userToEdit={userToEdit}
        onClose={() => setIsUserModalOpen(false)}
        onSave={(data: {
          name: string
          email: string
          role: "admin" | "cliente"
          status: "Activo" | "Inactivo"
        }) => {
          if (userToEdit) {
            const res = updateUser(userToEdit.id, data)
            if (res && res.success) {
              showNotice(res.message)
            } else if (res) {
              alert(res.message)
            }
          } else {
            const res = addUser(data)
            if (res && res.success) {
              showNotice(res.message)
            } else if (res) {
              alert(res.message)
            }
          }
        }}
      />
    </div>
  )
}

export default AdminDashboardPage
