import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { initialUsers } from "../data/mockDb";

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  register: (name: string, email: string) => { success: boolean; message: string };
  addUser: (user: Omit<User, "id" | "createdAt">) => { success: boolean; message: string };
  updateUser: (id: number, data: Partial<User>) => { success: boolean; message: string };
  deactivateUser: (id: number) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("bikestore_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("bikestore_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("bikestore_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("bikestore_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("bikestore_auth_user");
    }
  }, [currentUser]);

  const login = (email: string, _password?: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.status === "Inactivo") {
        return { success: false, message: "Tu cuenta ha sido inactivada. Contacta al administrador." };
      }
      setCurrentUser(found);
      return { success: true, message: `Bienvenido de nuevo, ${found.name}`, user: found };
    }

    // Si el usuario no estaba en la lista, detectamos automáticamente su rol
    const isAutoAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("a.silva") || email.toLowerCase().includes("jafet");
    const defaultRole = isAutoAdmin ? "admin" : "cliente";
    const newUser: User = {
      id: Date.now(),
      name: email.split("@")[0].toUpperCase(),
      email,
      role: defaultRole,
      status: "Activo",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: `Sesión iniciada con éxito (${defaultRole === "admin" ? "Administrador" : "Cliente"})`, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: "Este correo ya se encuentra registrado." };
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role: "cliente",
      status: "Activo",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: "Cuenta creada exitosamente." };
  };

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: "Ya existe un usuario con este correo electrónico." };
    }
    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    return { success: true, message: "Usuario creado exitosamente." };
  };

  const updateUser = (id: number, data: Partial<User>) => {
    // Regla de negocio CU-16: Debe existir al menos un Administrador activo
    if (data.role === "cliente" || data.status === "Inactivo") {
      const target = users.find((u) => u.id === id);
      if (target && target.role === "admin" && target.status === "Activo") {
        const activeAdmins = users.filter((u) => u.role === "admin" && u.status === "Activo");
        if (activeAdmins.length <= 1) {
          return {
            success: false,
            message: "Regla de seguridad: Debe existir siempre al menos un Administrador activo en el sistema.",
          };
        }
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    return { success: true, message: "Usuario actualizado exitosamente." };
  };

  const deactivateUser = (id: number) => {
    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, message: "Usuario no encontrado." };

    if (target.role === "admin" && target.status === "Activo") {
      const activeAdmins = users.filter((u) => u.role === "admin" && u.status === "Activo");
      if (activeAdmins.length <= 1) {
        return {
          success: false,
          message: "No se puede inactivar: El sistema debe mantener al menos un administrador activo.",
        };
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Inactivo" } : u))
    );
    return { success: true, message: `Usuario ${target.name} inactivado con éxito.` };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        register,
        addUser,
        updateUser,
        deactivateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
