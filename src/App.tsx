import { useEffect, useMemo, useState } from "react";

type Page = "home" | "product" | "cart" | "checkout" | "success" | "login" | "register" | "recovery" | "admin";
type Product = { id: number; name: string; category: string; price: number; image: string; badge?: string };

const bikes: Product[] = [
  { id: 1, name: "Specialized Stumpjumper Pro", category: "Montaña", price: 4599000, image: "/assets/products/img-005.jpg", badge: "Nuevo" },
  { id: 2, name: "Trek Emonda SLR 7", category: "Carretera / Ruta", price: 5200000, image: "/assets/products/img-006.jpg" },
  { id: 3, name: "Canyon Grizl CF SL", category: "Gravel", price: 2899000, image: "/assets/products/img-007.jpg" },
  { id: 4, name: "Cannondale Habit Carbon", category: "Montaña", price: 3450000, image: "/assets/products/img-008.jpg" },
  { id: 5, name: "Giant Defy Advanced", category: "Carretera / Endurance", price: 2999000, image: "/assets/products/img-009.jpg" },
  { id: 6, name: "Specialized Turbo Vado", category: "E-Bike", price: 3800000, image: "/assets/products/img-010.jpg" },
];

const gear: Product[] = [
  { id: 11, name: "Shimano XT M8120 SPD", category: "Transmisión", price: 420000, image: "/assets/products/img-011.jpg" },
  { id: 12, name: "SRAM Rival AXS 48/35", category: "Bielas", price: 890000, image: "/assets/products/img-012.jpg" },
  { id: 13, name: "Zipp 303 Firecrest", category: "Ruedas", price: 2450000, image: "/assets/products/img-013.jpg" },
  { id: 14, name: "Specialized Romin Evo Pro", category: "Asiento", price: 340000, image: "/assets/products/img-014.jpg" },
  { id: 15, name: "Zipp Service Course SL-70", category: "Manubrio", price: 280000, image: "/assets/products/img-015.jpg" },
  { id: 16, name: "Shimano XTR CS-M9100", category: "Cassette", price: 310000, image: "/assets/products/img-016.jpg" },
];

const accessories: Product[] = [
  { id: 21, name: "Luz Bontrager Ion Pro", category: "Iluminación", price: 180000, image: "/assets/products/img-017.jpg" },
  { id: 22, name: "Casco Specialized Prevail", category: "Protección", price: 620000, image: "/assets/products/img-018.jpg" },
  { id: 23, name: "Caramañola Podium Chill", category: "Hidratación", price: 85000, image: "/assets/products/img-019.jpg" },
  { id: 24, name: "Computador Garmin Edge", category: "Tecnología", price: 1450000, image: "/assets/products/img-020.jpg" },
  { id: 25, name: "Kit multiherramienta Pro", category: "Herramientas", price: 160000, image: "/assets/products/img-021.jpg" },
  { id: 26, name: "Sensor Cadencia Wahoo", category: "Sensores", price: 230000, image: "/assets/products/img-022.jpg" },
];

const money = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    cart: <><path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6M14 11v6" /></>,
    minus: <path d="M5 12h14" />, plus: <path d="M12 5v14M5 12h14" />,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="BikeStore inicio"><img src="/assets/ciclista.png" alt="" /><span><b>BIKE</b>STORE</span></button>;
}

function Header({ page, cartCount, go, onSearch }: { page: Page; cartCount: number; go: (p: Page) => void; onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const link = (label: string, target: Page = "home") => <button onClick={() => { go(target); setOpen(false); }}>{label}</button>;
  return <header>
    <div className="topbar"><span>Envío gratis desde $300.000</span><span>Soporte experto para ciclistas</span></div>
    <div className="nav-wrap">
      <Logo onClick={() => go("home")} />
      <nav className={open ? "open" : ""}>
        {link("Bicicletas")}{link("Mantenimiento")}{link("Accesorios")}{link("Componentes")}
      </nav>
      <div className="nav-actions">
        <button aria-label="Buscar" onClick={onSearch}><Icon name="search" /></button>
        <button aria-label="Mi cuenta" onClick={() => go("login")} className={page === "login" ? "active" : ""}><Icon name="user" /><span className="action-label">Cuenta</span></button>
        <button aria-label="Carrito" onClick={() => go("cart")} className="cart-button"><Icon name="cart" /><span className="action-label">Carrito</span>{cartCount > 0 && <i>{cartCount}</i>}</button>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menú"><Icon name={open ? "close" : "menu"} /></button>
      </div>
    </div>
  </header>;
}

function Footer({ go }: { go: (p: Page) => void }) {
  return <footer>
    <div className="footer-grid">
      <div><Logo onClick={() => go("home")} /><p>La tienda definitiva para apasionados del ciclismo. Bicicletas premium, equipamiento y servicio de alto rendimiento.</p></div>
      <div><h4>Soporte</h4><a>Atención al cliente</a><a>Garantías</a><a>Envíos y retornos</a><a>Ubicación de tiendas</a></div>
      <div><h4>Comunidad</h4><a>Club ciclista</a><a>Eventos</a><a>Blog</a><a>Embajadores</a></div>
      <div><h4>Recibe novedades</h4><p>Nuevas rutas, productos y beneficios, directo a tu correo.</p><div className="subscribe"><input aria-label="Correo para novedades" placeholder="tu@correo.com" /><button aria-label="Suscribirse"><Icon name="arrow" /></button></div></div>
    </div>
    <div className="copyright"><span>© 2025 BikeStore. Diseñado para llegar más lejos.</span><span>Términos y condiciones · Privacidad</span></div>
  </footer>;
}

function ProductCard({ product, add, go }: { product: Product; add: (p: Product) => void; go: (p: Page) => void }) {
  return <article className="product-card">
    <button className="product-image" onClick={() => go("product")}>{product.badge && <span className="badge">{product.badge}</span>}<img src={product.image} alt={product.name} /></button>
    <div className="product-info"><span className="eyebrow">{product.category}</span><button className="product-name" onClick={() => go("product")}>{product.name}</button><div className="price-row"><strong>{money(product.price)}</strong><button onClick={() => add(product)} aria-label={`Agregar ${product.name}`}><Icon name="plus" /></button></div></div>
  </article>;
}

function ProductSection({ title, subtitle, products, add, go }: { title: string; subtitle: string; products: Product[]; add: (p: Product) => void; go: (p: Page) => void }) {
  return <section className="catalog-section" id={title.toLowerCase()}><div className="section-head"><div><span className="eyebrow">Selección BikeStore</span><h2>{title}</h2><p>{subtitle}</p></div><button className="text-link">Ver todo <Icon name="arrow" size={17} /></button></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} add={add} go={go} />)}</div></section>;
}

function Home({ add, go }: { add: (p: Product) => void; go: (p: Page) => void }) {
  return <main>
    <section className="hero">
      <img src="/assets/products/img-004.jpg" alt="Ciclista de montaña recorriendo un sendero" />
      <div className="hero-shade" />
      <div className="hero-copy"><span className="kicker">Temporada 2025</span><h1>Domina cualquier<br />terreno.</h1><p>Ingeniería de montaña, velocidad de ruta y tecnología eléctrica para quienes no dejan de avanzar.</p><div className="hero-actions"><button className="primary" onClick={() => document.getElementById("bicicletas")?.scrollIntoView({ behavior: "smooth" })}>Ver catálogo <Icon name="arrow" /></button><button className="secondary" onClick={() => go("product")}>Conoce la Stumpjumper</button></div></div>
      <div className="hero-stats"><div><b>18</b><span>Bicicletas premium</span></div><div><b>3–5 días</b><span>Entrega nacional</span></div><div><b>2 años</b><span>Garantía extendida</span></div></div>
    </section>
    <div className="benefits"><div><Icon name="shield" /><span><b>Compra protegida</b>Pago seguro y garantía</span></div><div><Icon name="cart" /><span><b>Envío sin costo</b>Desde $300.000</span></div><div><Icon name="user" /><span><b>Asesoría experta</b>Pedalea con confianza</span></div></div>
    <ProductSection title="Bicicletas" subtitle="Máquinas elegidas para cada forma de vivir el camino." products={bikes} add={add} go={go} />
    <section className="feature-banner"><img src="/assets/products/img-023.jpg" alt="Técnico realizando mantenimiento de bicicleta" /><div><span className="eyebrow light">Taller certificado</span><h2>Tu bicicleta, siempre lista para la próxima ruta.</h2><p>Mantenimiento preventivo y reparación especializada por técnicos certificados.</p><button className="primary" onClick={() => alert("Tu solicitud de servicio fue recibida.")}>Agendar mantenimiento <Icon name="arrow" /></button></div></section>
    <ProductSection title="Componentes" subtitle="Precisión, ligereza y control para elevar tu rendimiento." products={gear} add={add} go={go} />
    <ProductSection title="Accesorios" subtitle="Todo lo que necesitas antes, durante y después de rodar." products={accessories} add={add} go={go} />
    <div className="pagination"><button aria-label="Página anterior">‹</button><button className="selected">1</button><button>2</button><button>3</button><button aria-label="Página siguiente">›</button></div>
  </main>;
}

function ProductDetail({ add, go }: { add: (p: Product) => void; go: (p: Page) => void }) {
  const [size, setSize] = useState("M");
  const product = bikes[0];
  return <main className="page-shell">
    <div className="breadcrumbs"><button onClick={() => go("home")}>Inicio</button><span>/</span><button onClick={() => go("home")}>Bicicletas</button><span>/</span><b>Stumpjumper Pro</b></div>
    <section className="detail-grid">
      <div className="detail-gallery"><div className="main-photo"><span className="badge">Nuevo</span><img src="/assets/products/img-028.jpg" alt={product.name} /></div><div className="thumbs">{["028","005","008"].map((n, i) => <button className={i === 0 ? "chosen" : ""} key={n}><img src={`/assets/products/img-${n}.jpg`} alt="" /></button>)}</div></div>
      <div className="detail-copy"><span className="eyebrow">Specialized · Trail</span><h1>Stumpjumper Pro<br />Carbon Trail</h1><div className="rating"><span>★★★★★</span> 4.9 · 18 calificaciones</div><div className="detail-price">{money(product.price)}</div><p>Control total, respuesta precisa y una geometría creada para convertir cada descenso en tu nueva línea favorita.</p><div className="choice"><b>Selecciona talla</b><span>Guía de tallas</span></div><div className="sizes">{["S","M","L","XL"].map(s => <button className={size === s ? "selected" : ""} onClick={() => setSize(s)} key={s}>{s}</button>)}</div><button className="primary wide" onClick={() => { add(product); go("cart"); }}><Icon name="cart" /> Agregar al carrito</button><div className="shipping-note"><Icon name="shield" /><span><b>Envío express gratuito</b>Entrega estimada en 3–5 días hábiles.</span></div></div>
    </section>
    <section className="specs"><div><span className="eyebrow">Diseñada sin compromisos</span><h2>Más control. Más velocidad.<br />Más montaña.</h2></div><div><p>La Specialized Stumpjumper Pro redefine la experiencia trail con su chasis de fibra de carbono, rigidez precisa y suspensión de 130 mm. Una bicicleta ágil en ascenso y absolutamente estable cuando el terreno apunta hacia abajo.</p><dl><div><dt>Cuadro</dt><dd>Carbon FACT 11m, Trail Geometry</dd></div><div><dt>Horquilla</dt><dd>FOX FLOAT 34, 140 mm</dd></div><div><dt>Transmisión</dt><dd>SRAM GX Eagle, 12 velocidades</dd></div><div><dt>Peso</dt><dd>13.8 kg (Talla M)</dd></div></dl></div></section>
  </main>;
}

type CartItem = Product & { qty: number };
function Cart({ items, setItems, go }: { items: CartItem[]; setItems: React.Dispatch<React.SetStateAction<CartItem[]>>; go: (p: Page) => void }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const qty = (id: number, delta: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  return <main className="page-shell cart-page"><div className="page-title"><span className="eyebrow">Tu selección</span><h1>Carrito de compra</h1><p>{items.length} productos listos para salir a rodar.</p></div>
    {items.length === 0 ? <div className="empty"><Icon name="cart" size={40} /><h2>Tu carrito está esperando una aventura</h2><p>Explora nuestro catálogo y encuentra tu próxima bicicleta.</p><button className="primary" onClick={() => go("home")}>Ir al catálogo</button></div> :
    <div className="cart-layout"><div className="cart-list">{items.map(item => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-copy"><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><span>Talla M · En stock</span></div><div className="quantity"><button onClick={() => qty(item.id, -1)}><Icon name="minus" size={16} /></button><b>{item.qty}</b><button onClick={() => qty(item.id, 1)}><Icon name="plus" size={16} /></button></div><strong>{money(item.price * item.qty)}</strong><button className="delete" onClick={() => setItems(p => p.filter(i => i.id !== item.id))} aria-label="Eliminar"><Icon name="trash" /></button></article>)}</div>
    <aside className="summary"><h3>Resumen de orden</h3><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Envío express</span><b className="success-text">Gratis</b></div><div><span>Impuestos incluidos</span><b>{money(subtotal * .19)}</b></div><hr /><div className="total"><span>Total</span><b>{money(subtotal)}</b></div><button className="primary wide" onClick={() => go("checkout")}>Continuar al pago <Icon name="arrow" /></button><small><Icon name="shield" size={16} /> Compra 100% segura y protegida</small></aside></div>}
  </main>;
}

function Checkout({ total, go }: { total: number; go: (p: Page) => void }) {
  const [method, setMethod] = useState("card");
  return <main className="page-shell checkout"><div className="page-title"><span className="eyebrow">Último paso</span><h1>Finaliza tu compra</h1><p>Entrega segura y pago protegido de principio a fin.</p></div><div className="checkout-grid"><form onSubmit={e => { e.preventDefault(); go("success"); }}>
    <section className="form-section"><span className="step">01</span><h2>Datos de entrega</h2><div className="fields"><label>Nombre completo<input required defaultValue="Ciclista Premium" /></label><label>Correo electrónico<input type="email" required defaultValue="ciclista.premium@gmail.com" /></label><label>Dirección<input required placeholder="Calle, número, apartamento" /></label><label>Ciudad<select defaultValue="Bogotá"><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></label></div></section>
    <section className="form-section"><span className="step">02</span><h2>Método de pago</h2><div className="payment-tabs"><button type="button" className={method === "card" ? "selected" : ""} onClick={() => setMethod("card")}>Tarjeta</button><button type="button" className={method === "pse" ? "selected" : ""} onClick={() => setMethod("pse")}>PSE</button></div>{method === "card" && <div className="fields"><label className="full">Número de tarjeta<input required placeholder="0000 0000 0000 0000" /></label><label>Vencimiento<input required placeholder="MM / AA" /></label><label>CVV<input required placeholder="•••" /></label></div>}<button className="primary wide" type="submit">Pagar {money(total || 4599000)} <Icon name="arrow" /></button></section>
  </form><aside className="summary order-preview"><h3>Tu pedido</h3><img src={bikes[0].image} alt="" /><div><span>Specialized Stumpjumper Pro</span><b>{money(total || bikes[0].price)}</b></div><hr /><div className="total"><span>Total a pagar</span><b>{money(total || bikes[0].price)}</b></div><small><Icon name="shield" size={16} /> Transacción cifrada y protegida</small></aside></div></main>;
}

function Success({ go }: { go: (p: Page) => void }) {
  return <main className="success-page"><div className="success-icon"><Icon name="check" size={38} /></div><span className="eyebrow">Pedido #BS-20250918</span><h1>¡Gracias por tu compra!</h1><p>Tu pedido fue procesado correctamente. Enviaremos las novedades a <b>ciclista.premium@gmail.com</b>.</p><div className="tracker">{["Empaquetando","En camino","Entregado"].map((x,i) => <div className={i === 0 ? "current" : ""} key={x}><i>{i === 0 ? <Icon name="check" size={16} /> : i + 1}</i><b>{x}</b><span>{i === 0 ? "Listo para despacho" : i === 1 ? "Tránsito nacional" : "Destino final"}</span></div>)}</div><button className="primary" onClick={() => go("home")}>Seguir explorando <Icon name="arrow" /></button></main>;
}

function Auth({ mode, go }: { mode: "login" | "register" | "recovery"; go: (p: Page) => void }) {
  if (mode === "recovery") return <main className="auth-page recovery"><div className="auth-heading"><span className="eyebrow">Seguridad de cuenta</span><h1>Recuperación de contraseña</h1><p>Sigue los pasos para restablecer tu acceso de forma segura.</p></div><div className="recovery-grid">{[["01","Solicitar código","Ingresa tu correo para recibir una clave de un solo uso."],["02","Confirmar código","Escribe el código de 8 dígitos recibido en tu bandeja."],["03","Nueva contraseña","Define una contraseña segura para tu cuenta."]].map((s,i) => <section key={s[0]}><span className="step">{s[0]}</span><h2>{s[1]}</h2><p>{s[2]}</p><label>{i === 0 ? "Correo electrónico" : i === 1 ? "Código de seguridad" : "Contraseña nueva"}<input defaultValue={i === 0 ? "ciclista.premium@gmail.com" : i === 1 ? "8473 - 9204" : ""} type={i === 2 ? "password" : "text"} placeholder={i === 2 ? "••••••••" : ""} /></label><button className={i === 0 ? "primary wide" : "dark wide"}>{i === 0 ? "Enviar código" : i === 1 ? "Verificar clave" : "Restablecer"}</button></section>)}</div><button className="back-link" onClick={() => go("login")}>Volver a iniciar sesión</button></main>;
  const register = mode === "register";
  return <main className="auth-page"><div className="auth-card"><span className="eyebrow">{register ? "Únete a la comunidad" : "Bienvenido de vuelta"}</span><h1>{register ? "Crea tu cuenta" : "Iniciar sesión"}</h1><p>{register ? "Guarda favoritos, gestiona pedidos y accede a beneficios." : "Ingresa tus credenciales para administrar tus pedidos."}</p><form onSubmit={e => { e.preventDefault(); go(register ? "home" : "admin"); }}>{register && <label>Nombre completo<input required placeholder="Tu nombre" /></label>}<label>Correo electrónico<input type="email" required defaultValue="ciclista.premium@gmail.com" /></label><label>Contraseña<input type="password" required defaultValue="12345678" /></label>{!register && <button type="button" className="forgot" onClick={() => go("recovery")}>¿Olvidaste tu contraseña?</button>}<button className="primary wide" type="submit">{register ? "Crear mi cuenta" : "Ingresar"} <Icon name="arrow" /></button></form><div className="auth-switch">{register ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"} <button onClick={() => go(register ? "login" : "register")}>{register ? "Inicia sesión" : "Regístrate aquí"}</button></div></div></main>;
}

function Admin({ go }: { go: (p: Page) => void }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [["dashboard","Resumen"],["products","Productos"],["users","Usuarios y seguridad"]];
  return <main className="admin"><aside><Logo onClick={() => go("home")} /><span>Panel de control</span>{tabs.map(t => <button className={tab === t[0] ? "selected" : ""} onClick={() => setTab(t[0])} key={t[0]}>{t[1]}</button>)}<button className="logout" onClick={() => go("home")}>Salir</button></aside><div className="admin-content"><div className="admin-head"><div><span className="eyebrow">BikeStore Admin</span><h1>{tabs.find(t => t[0] === tab)?.[1]}</h1></div><div className="admin-user"><span>AS</span><b>Admin Demo</b></div></div>{tab === "dashboard" && <><div className="metric-grid"><div><span>Ventas este mes</span><b>$124.500.000</b><small>+18.2% frente al mes anterior</small></div><div><span>Pedidos</span><b>420</b><small>38 pendientes de despacho</small></div><div><span>Ticket promedio</span><b>$296.400</b><small>+4.1% este mes</small></div></div><div className="chart-card"><h3>Ventas semanales</h3><div className="bars">{[45,68,52,84,62,95,73,105,88,120,76,110].map((h,i) => <i key={i} style={{height:h}} />)}</div></div></>}{tab !== "dashboard" && <AdminTable users={tab === "users"} />}</div></main>;
}

function AdminTable({ users }: { users: boolean }) {
  const rows = users ? [["Alejandro Silva","a.silva@bikestore.com","Administrador","Activo"],["Beatriz Mendoza","beatriz.m@gmail.com","Cliente","Activo"],["Carlos Vargas","vargas.carlos@bikestore.com","Cliente","Activo"],["Daniela Castro","daniela.castro@outlook.com","Cliente","Inactivo"]] : bikes.slice(0,5).map(x => [x.name,x.category,money(x.price),"Activo"]);
  return <section className="table-card"><div className="table-tools"><input placeholder="Buscar..." /><button className="primary">+ Crear {users ? "usuario" : "producto"}</button></div><div className="table-scroll"><table><thead><tr><th>{users ? "Nombre" : "Producto"}</th><th>{users ? "Correo" : "Categoría"}</th><th>{users ? "Rol" : "Precio"}</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((c,j) => <td key={j}>{j === 3 ? <span className={c === "Activo" ? "status" : "status off"}>{c}</span> : c}</td>)}<td><button>Editar</button> · <button>Eliminar</button></td></tr>)}</tbody></table></div></section>;
}

function SearchModal({ close, go }: { close: () => void; go: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const results = [...bikes, ...gear].filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0,4);
  return <div className="modal-backdrop" onMouseDown={close}><div className="search-modal" onMouseDown={e => e.stopPropagation()}><div className="search-input"><Icon name="search" /><input autoFocus placeholder="Busca bicicletas, componentes, accesorios..." value={query} onChange={e => setQuery(e.target.value)} /><button onClick={close}><Icon name="close" /></button></div>{query && <div className="search-results">{results.length ? results.map(p => <button key={p.id} onClick={() => { close(); go("product"); }}><img src={p.image} alt="" /><span><b>{p.name}</b><small>{p.category}</small></span><strong>{money(p.price)}</strong></button>) : <p>No encontramos resultados para “{query}”.</p>}</div>}<div className="quick-search"><span>Búsquedas populares</span><button onClick={() => setQuery("Shimano")}>Shimano</button><button onClick={() => setQuery("Specialized")}>Specialized</button><button onClick={() => setQuery("Trek")}>Ruta</button></div></div></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [items, setItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState(false);
  const [toast, setToast] = useState("");
  const cartCount = items.reduce((sum, x) => sum + x.qty, 0);
  const total = useMemo(() => items.reduce((sum, x) => sum + x.price * x.qty, 0), [items]);
  const go = (next: Page) => { setPage(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const add = (product: Product) => { setItems(prev => prev.some(i => i.id === product.id) ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }]); setToast(`${product.name} fue agregado al carrito`); };
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 2800); return () => clearTimeout(timer); }, [toast]);
  const authPage = page === "login" || page === "register" || page === "recovery";
  return <div className="app">
    {page !== "admin" && <Header page={page} cartCount={cartCount} go={go} onSearch={() => setSearch(true)} />}
    {page === "home" && <Home add={add} go={go} />}
    {page === "product" && <ProductDetail add={add} go={go} />}
    {page === "cart" && <Cart items={items} setItems={setItems} go={go} />}
    {page === "checkout" && <Checkout total={total} go={go} />}
    {page === "success" && <Success go={go} />}
    {authPage && <Auth mode={page} go={go} />}
    {page === "admin" && <Admin go={go} />}
    {page !== "admin" && page !== "success" && <Footer go={go} />}
    {search && <SearchModal close={() => setSearch(false)} go={go} />}
    {toast && <div className="toast"><span><Icon name="check" /></span>{toast}<button onClick={() => go("cart")}>Ver carrito</button></div>}
  </div>;
}
