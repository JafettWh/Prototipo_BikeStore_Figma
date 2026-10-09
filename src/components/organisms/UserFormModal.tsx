import React, { useState, useEffect } from "react";
import { User } from "../../types";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSave: (data: { name: string; email: string; role: "admin" | "cliente"; status: "Activo" | "Inactivo" }) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "cliente">("cliente");
  const [status, setStatus] = useState<"Activo" | "Inactivo">("Activo");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setStatus(userToEdit.status);
    } else {
      setName("");
      setEmail("");
      setRole("cliente");
      setStatus("Activo");
    }
    setError("");
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Todos los campos obligatorios deben ser diligenciados.");
      return;
    }
    onSave({ name, email, role, status });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden text-left border border-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#11120f] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase tracking-tight">
            {userToEdit ? "Editar Usuario (CU-16)" : "Crear Nuevo Usuario (CU-15)"}
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
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          )}

          <Input
            label="Nombre Completo"
            required
            placeholder="Ej. Andrés Moncada"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            required
            placeholder="andres@bikestore.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                Rol del Sistema *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "cliente")}
                className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#11120f]">
                Estado de la Cuenta *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Activo" | "Inactivo")}
                className="w-full h-12 bg-white border border-[#dedfd9] text-xs px-3 focus:outline-none focus:border-[#ffd400]"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#dedfd9] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
