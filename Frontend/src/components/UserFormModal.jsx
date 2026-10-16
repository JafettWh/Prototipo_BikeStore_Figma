import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Button from "./Button";
import Input from "./Input";
import "../assets/styles.css";
export const UserFormModal = ({ isOpen, onClose, userToEdit, onSave, }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("cliente");
    const [status, setStatus] = useState("Activo");
    const [error, setError] = useState("");
    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
            setStatus(userToEdit.status);
        }
        else {
            setName("");
            setEmail("");
            setRole("cliente");
            setStatus("Activo");
        }
        setError("");
    }, [userToEdit, isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            setError("Todos los campos obligatorios deben ser diligenciados.");
            return;
        }
        onSave({ name, email, role, status });
        onClose();
    };
    return (<div role="dialog" aria-modal="true" className="user-form-modal-div-1" onClick={onClose}>
      <div className="user-form-modal-div-2" onClick={(e) => e.stopPropagation()}>
        <div className="user-form-modal-div-3">
          <h3 className="user-form-modal-h3-1">
            {userToEdit ? "Editar Usuario (CU-16)" : "Crear Nuevo Usuario (CU-15)"}
          </h3>
          <button onClick={onClose} className="user-form-modal-button-1">
            <Icon name="close" size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form-modal-form-1">
          {error && (<p className="user-form-modal-p-1">{error}</p>)}

          <Input label="Nombre Completo" required placeholder="Ej. Andrés Moncada" value={name} onChange={(e) => setName(e.target.value)}/>

          <Input label="Correo Electrónico" type="email" required placeholder="andres@bikestore.com" value={email} onChange={(e) => setEmail(e.target.value)}/>

          <div className="user-form-modal-div-4">
            <div className="user-form-modal-div-5">
              <label className="user-form-modal-label-1">
                Rol del Sistema *
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="user-form-modal-select-1">
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="user-form-modal-div-5">
              <label className="user-form-modal-label-1">
                Estado de la Cuenta *
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="user-form-modal-select-1">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="user-form-modal-div-6">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>);
};
export default UserFormModal;
