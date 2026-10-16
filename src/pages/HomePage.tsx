import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { formatCOP } from "../utils/formatters";
import HeroBanner from "../components/organisms/HeroBanner";
import ProductCard from "../components/molecules/ProductCard";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";

interface HomePageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  // Estados para filtros de CU-01
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");

  // Filtramos solo productos activos para el público (CU-01 alterno 2.2)
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status === "Activo");
  }, [products]);

  // División por secciones
  const bikeProducts = useMemo(() => {
    let list = activeProducts.filter((p) => p.section === "Bicicletas");
    if (selectedCategory !== "Todas") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (sortOrder === "asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activeProducts, selectedCategory, sortOrder]);

  const gearProducts = useMemo(
    () => activeProducts.filter((p) => p.section === "Componentes"),
    [activeProducts]
  );

  const accessoryProducts = useMemo(
    () => activeProducts.filter((p) => p.section === "Accesorios"),
    [activeProducts]
  );

  const bikeCategories = ["Todas", "Montaña", "Carretera / Ruta", "Gravel", "E-Bike"];

  return (
    <main className="w-full">
      {/* Hero Principal */}
      <HeroBanner
        onExploreCatalog={() => {
          document.getElementById("bicicletas")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Franja de Beneficios y Garantías */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-b border-[#dedfd9] bg-white">
        <div className="flex items-center justify-center gap-4 p-6 sm:p-7 border-b md:border-b-0 md:border-r border-[#dedfd9]">
          <span className="text-[#b59700]">
            <Icon name="shield" size={26} />
          </span>
          <div className="text-left">
            <b className="text-xs font-bold text-[#11120f] block uppercase tracking-wide">
              Compra 100% Protegida
            </b>
            <span className="text-[11px] text-[#6d6f69]">
              Garantía oficial directa y factura legal Dian
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-6 sm:p-7 border-b md:border-b-0 md:border-r border-[#dedfd9]">
          <span className="text-[#b59700]">
            <Icon name="cart" size={26} />
          </span>
          <div className="text-left">
            <b className="text-xs font-bold text-[#11120f] block uppercase tracking-wide">
              Envío Nacional Sin Costo
            </b>
            <span className="text-[11px] text-[#6d6f69]">
              Gratis en órdenes mayores a $300.000 COP
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-6 sm:p-7">
          <span className="text-[#b59700]">
            <Icon name="sparkles" size={26} />
          </span>
          <div className="text-left">
            <b className="text-xs font-bold text-[#11120f] block uppercase tracking-wide">
              Productos 100% Originales
            </b>
            <span className="text-[11px] text-[#6d6f69]">
              Marcas premium con respaldo oficial
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: BICICLETAS (Con Filtro por Categoría y Orden por Precio CU-01) */}
      <section id="bicicletas" className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-20 pb-8 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#dedfd9]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Catálogo Oficial 2026
            </span>
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-[#11120f] mt-1">
              Bicicletas de Alto Rendimiento
            </h2>
            <p className="text-xs sm:text-sm text-[#6d6f69] mt-1">
              Máquinas diseñadas para competición, entrenamiento de fondo y aventuras gravel.
            </p>
          </div>

          {/* Controles de Filtro y Ordenamiento */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#f4f4f0] p-1 rounded-sm">
              {bikeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer border-0 ${
                    selectedCategory === cat
                      ? "bg-[#11120f] text-[#ffd400] shadow-sm"
                      : "bg-transparent text-[#6d6f69] hover:text-[#11120f]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="h-9 bg-white border border-[#dedfd9] text-[11px] font-bold uppercase tracking-wider px-3 focus:outline-none focus:border-[#ffd400] cursor-pointer"
            >
              <option value="default">Ordenar por: Relevancia</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Grilla de Bicicletas */}
        {bikeProducts.length === 0 ? (
          <div className="py-16 text-center text-[#6d6f69] bg-[#fcfcfb] border border-dashed border-[#dedfd9] rounded-sm my-6">
            <Icon name="bike" size={40} className="mx-auto mb-2 opacity-50" />
            <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
              No hay bicicletas disponibles en esta categoría
            </h3>
            <p className="text-xs mt-1">
              Prueba cambiando los filtros seleccionados o consulta nuestro catálogo completo.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("Todas");
                setSortOrder("default");
              }}
            >
              Restablecer Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {bikeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetail={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: COMPONENTES */}
      <section id="componentes" className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 text-left">
        <div className="flex items-end justify-between pb-6 border-b border-[#dedfd9]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Precisión Mecánica
            </span>
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-[#11120f] mt-1">
              Componentes & Transmisión
            </h2>
            <p className="text-xs sm:text-sm text-[#6d6f69] mt-1">
              Ruedas de carbono, bielas con potenciómetro y grupos electrónicos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {gearProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: ACCESORIOS */}
      <section id="accesorios" className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 pb-20 text-left">
        <div className="flex items-end justify-between pb-6 border-b border-[#dedfd9]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Equipamiento & Seguridad
            </span>
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-[#11120f] mt-1">
              Accesorios & Tecnología
            </h2>
            <p className="text-xs sm:text-sm text-[#6d6f69] mt-1">
              Cascos MIPS, ciclocomputadores GPS con carga solar y luces inteligentes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {accessoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
