import React, { useState } from "react";
import { Page } from "../types";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/atoms/Icon";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

interface AuthPageProps {
  mode: "login" | "register" | "recovery";
  onNavigate: (page: Page) => void;
  returnAfterAuth?: Page;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onNavigate, returnAfterAuth }) => {
  const { login, register } = useAuth();

  // Estados de login y registro
  const [email, setEmail] = useState(
    returnAfterAuth === "checkout" ? "beatriz.m@gmail.com" : "a.silva@bikestore.com"
  );
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para Recuperación
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [recoveryCode, setRecoveryCode] = useState("8473-9204");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Por favor completa tu correo y contraseña.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        // Un acceso solicitado desde la compra vuelve al checkout; los demás respetan el rol.
        if (returnAfterAuth) {
          onNavigate(returnAfterAuth);
        } else if (res.user?.role === "admin") {
          onNavigate("admin");
        } else {
          onNavigate("home");
        }
      }, 700);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Todos los campos son obligatorios para crear tu cuenta.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres de seguridad.");
      return;
    }

    const res = register(name, email);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccessMsg("¡Registro exitoso! Iniciando sesión en la tienda...");
      setTimeout(() => {
        onNavigate(returnAfterAuth || "home");
      }, 900);
    }
  };

  // VISTA DE RECUPERACIÓN DE CONTRASEÑA
  if (mode === "recovery") {
    return (
      <main className="min-h-[80vh] bg-[#f8f8f5] px-6 py-12 sm:py-16 text-left">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777a71] block">
              Seguridad de Cuenta
            </span>
            <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl sm:text-5xl text-[#11120f] tracking-tight">
              Recuperación de Contraseña
            </h1>
            <p className="text-xs text-[#6d6f69]">
              Sigue el protocolo de 3 pasos para restablecer tu acceso con código de seguridad temporal.
            </p>
          </div>

          <div className="flex flex-col gap-3" aria-label={`Paso ${recoveryStep} de 3`}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#11120f]">
                Paso {recoveryStep} de 3
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777a71]">
                {recoveryStep === 1 && "Solicitar código"}
                {recoveryStep === 2 && "Confirmar código"}
                {recoveryStep === 3 && "Nueva contraseña"}
              </span>
            </div>
            <div
              className="grid grid-cols-3 gap-2"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={recoveryStep}
            >
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-1.5 rounded-sm transition-colors ${
                    step <= recoveryStep ? "bg-[#ffd400]" : "bg-[#dedfd9]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#ffd400] ring-2 ring-[#ffd400]/40 shadow-lg rounded-sm p-6 sm:p-8">
            {recoveryStep === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#b59700] block">
                    01
                  </span>
                  <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
                    Solicitar Código
                  </h2>
                  <p className="text-xs text-[#6d6f69]">
                    Ingresa tu correo para recibir una clave temporal de un solo uso.
                  </p>
                </div>
                <Input
                  label="Correo Registrado"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setRecoveryStep(2)}
                >
                  Enviar Código
                </Button>
              </div>
            )}

            {recoveryStep === 2 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#b59700] block">
                    02
                  </span>
                  <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
                    Confirmar Código
                  </h2>
                  <p className="text-xs text-[#6d6f69]">
                    Escribe el código temporal de seguridad recibido en tu bandeja de entrada.
                  </p>
                </div>
                <Input
                  label="Código de Seguridad"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                />
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => setRecoveryStep(3)}
                  >
                    Verificar Código
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    className="justify-start"
                    onClick={() => setRecoveryCode("8473-9204")}
                  >
                    Reenviar código
                  </Button>
                </div>
              </div>
            )}

            {recoveryStep === 3 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="font-['Barlow_Condensed'] font-bold text-3xl text-[#b59700] block">
                    03
                  </span>
                  <h2 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-[#11120f]">
                    Nueva Contraseña
                  </h2>
                  <p className="text-xs text-[#6d6f69]">
                    Define una contraseña de mínimo 8 caracteres cifrada con algoritmo de seguridad.
                  </p>
                </div>
                <Input
                  label="Nueva Contraseña"
                  type="password"
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    if (newPassword.length < 8) {
                      alert("La nueva contraseña debe tener mínimo 8 caracteres.");
                      return;
                    }
                    alert("¡Contraseña actualizada exitosamente! Redirigiendo a inicio de sesión...");
                    onNavigate("login");
                  }}
                >
                  Restablecer Acceso
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // VISTAS DE LOGIN Y REGISTRO
  const isRegister = mode === "register";

  return (
    <main className="min-h-[80vh] bg-[#f8f8f5] py-16 px-6 flex items-center justify-center text-left">
      <div className="w-full max-w-md bg-white border border-[#dedfd9] p-8 sm:p-10 shadow-lg rounded-sm">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#777a71] block">
          {isRegister ? "Comunidad Ciclista" : "Acceso Seguro"}
        </span>

        <h1 className="font-['Barlow_Condensed'] font-extrabold uppercase text-4xl text-[#11120f] tracking-tight mt-1 mb-2">
          {isRegister ? "Crear Nueva Cuenta" : "Iniciar Sesión"}
        </h1>

        <p className="text-xs text-[#6d6f69] mb-6">
          {isRegister
            ? "Accede al catálogo, guarda favoritos y gestiona el historial de tus pedidos."
            : "Ingresa tu correo y contraseña. El sistema identificará tus permisos automáticamente."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <Input
              label="Nombre Completo"
              required
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contraseña"
            type="password"
            required
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isRegister && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => onNavigate("recovery")}
                className="text-[11px] text-[#777] underline hover:text-[#11120f] bg-transparent border-0 cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className="mt-6"
            icon={<Icon name="arrow" size={16} />}
          >
            {isRegister ? "Registrar Mi Cuenta" : "Ingresar a la Plataforma"}
          </Button>
        </form>

        {/* Indicador discreto de cuentas registradas de ejemplo */}
        {!isRegister && (
          <div className="mt-6 p-3 bg-[#fcfcf9] border border-[#dedfd9] rounded-sm text-[11px] text-[#6d6f69]">
            <b className="text-[#11120f] block mb-1">Cuentas registradas para prueba:</b>
            <div className="space-y-0.5">
              <div>Administrador: <span className="font-mono text-[#11120f] font-semibold">a.silva@bikestore.com</span></div>
              <div>Cliente: <span className="font-mono text-[#11120f] font-semibold">beatriz.m@gmail.com</span></div>
              <div className="text-[10px] text-[#999] mt-1">Clave genérica: <span className="font-mono font-bold">12345678</span></div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#dedfd9] text-center text-xs text-[#6d6f69]">
          {isRegister ? (
            <>
              ¿Ya tienes una cuenta registrada?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-bold underline text-[#11120f] hover:text-[#b59700] bg-transparent border-0 cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </>
          ) : (
            <>
              ¿Aún no eres miembro de BikeStore?{" "}
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="font-bold underline text-[#11120f] hover:text-[#b59700] bg-transparent border-0 cursor-pointer"
              >
                Regístrate ahora
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
