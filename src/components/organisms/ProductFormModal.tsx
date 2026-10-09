import React, { useState, useEffect } from "react";
import { Product } from "../../types";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Partial<Product>) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Montaña");
  const [section, setSection] = useState<Product["section"]>("Bicicletas");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("/assets/products/img-005.jpg");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setSection(productToEdit.section);
      setPrice(String(productToEdit.price));
      setStock(String(productToEdit.stock));
      setImage(productToEdit.image);
      setBadge(productToEdit.badge || "");
      setDescription(productToEdit.description || "");
    } else {
      setName("");
      setCategory("Montaña");
      setSection("Bicicletas");
      setPrice("");
      setStock("10");
      setImage("/assets/products/img-005.jpg");
      setBadge("Nuevo");
      setDescription("");
    }
    setError("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    const numStock = Number(stock);

    // Validaciones de CU-09 y CU-11
    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("El precio debe ser un número mayor a 0 (CU-11 paso 4).");
      return;
    }
    if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
      setError("Las existencias deben ser un número entero mayor o igual a 0.");
      return;
    }

    onSave({
      id: productToEdit ? productToEdit.id : Date.now(),
      name,
      category,
      section,
      price: numPrice,
      stock: numStock,
      image,
      badge: badge || undefined,
      description: description || "Producto de alto rendimiento BikeStore.",
      status: "Activo",
      specs: productToEdit?.specs || {
        material: "Aluminio / Carbono",
        garantia: "Garantía oficial BikeStore 2 años",
      },
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-300 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#11120f] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase tracking-tight">
            {productToEdit ? "Actualizar Producto (CU-11)" : "Registrar Nuevo Producto (CU-09)"}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white bg-transparent border-0 cursor-pointer p-1"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {error}
            </div>
          )}

          <Input
            label="Nombre del Producto"
            required
            placeholder="Ej. Trek Domane SL 6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                Sección Principal *
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as Product["section"])}
                className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
              >
                <option value="Bicicletas">Bicicletas</option>
                <option value="Componentes">Componentes</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <Input
              label="Categoría Específica"
              required
              placeholder="Ej. Montaña, Carretera, Transmisión..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Precio en COP ($)"
              type="number"
              required
              min="1"
              placeholder="Ej. 3500000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Existencias (Stock)"
              type="number"
              required
              min="0"
              placeholder="Ej. 10"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <Input
              label="Badge / Etiqueta"
              placeholder="Ej. Nuevo, Oferta..."
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
              Imagen de Muestra
            </label>
            <select
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
            >
              <option value="/assets/products/img-005.jpg">img-005 (Specialized Stumpjumper)</option>
              <option value="/assets/products/img-006.jpg">img-006 (Trek Émonda)</option>
              <option value="/assets/products/img-007.jpg">img-007 (Canyon Grizl)</option>
              <option value="/assets/products/img-008.jpg">img-008 (Cannondale Habit)</option>
              <option value="/assets/products/img-011.jpg">img-011 (Pedales Shimano XT)</option>
              <option value="/assets/products/img-018.jpg">img-018 (Casco Prevail)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
              Descripción Comercial
            </label>
            <textarea
              rows={3}
              placeholder="Descripción de materiales, tecnología y rendimiento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white border border-[#dedfd9] text-xs focus:outline-none focus:border-[#ffd400] resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#dedfd9] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {productToEdit ? "Guardar Cambios" : "Publicar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
