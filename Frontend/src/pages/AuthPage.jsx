import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Icon from "../components/Icon";
import Button from "../components/Button";
import Input from "../components/Input";
import "../assets/styles.css";
export const AuthPage = ({ mode, onNavigate, returnAfterAuth }) => {
    const { login, register } = useAuth();
    // Estados de login y registro
    const [email, setEmail] = useState(returnAfterAuth === "checkout" ? "beatriz.m@gmail.com" : "a.silva@bikestore.com");
    const [password, setPassword] = useState("12345678");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    // Estados para Recuperación
    const [recoveryStep, setRecoveryStep] = useState(1);
    const [recoveryCode, setRecoveryCode] = useState("8473-9204");
    const [newPassword, setNewPassword] = useState("");
    const handleLogin = (e) => {
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
        }
        else {
            setSuccessMsg(res.message);
            setTimeout(() => {
                // Un acceso solicitado desde la compra vuelve al checkout; los demás respetan el rol.
                if (returnAfterAuth) {
                    onNavigate(returnAfterAuth);
                }
                else if (res.user?.role === "admin") {
                    onNavigate("admin");
                }
                else {
                    onNavigate("home");
                }
            }, 700);
        }
    };
    const handleRegister = (e) => {
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
        }
        else {
            setSuccessMsg("¡Registro exitoso! Iniciando sesión en la tienda...");
            setTimeout(() => {
                onNavigate(returnAfterAuth || "home");
            }, 900);
        }
    };
    // VISTA DE RECUPERACIÓN DE CONTRASEÑA
    if (mode === "recovery") {
        return (<main className="auth-main-1">
        <div className="auth-div-1">
          <div className="auth-div-2">
            <span className="auth-span-1">
              Seguridad de Cuenta
            </span>
            <h1 className="auth-h1-1">
              Recuperación de Contraseña
            </h1>
            <p className="auth-p-1">
              Sigue el protocolo de 3 pasos para restablecer tu acceso con código de seguridad temporal.
            </p>
          </div>

          <div className="auth-div-3" aria-label={`Paso ${recoveryStep} de 3`}>
            <div className="auth-div-4">
              <span className="auth-span-2">
                Paso {recoveryStep} de 3
              </span>
              <span className="auth-span-3">
                {recoveryStep === 1 && "Solicitar código"}
                {recoveryStep === 2 && "Confirmar código"}
                {recoveryStep === 3 && "Nueva contraseña"}
              </span>
            </div>
            <div className="auth-div-5" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={recoveryStep}>
              {[1, 2, 3].map((step) => (<span key={step} className={`auth-span-4 ${step <= recoveryStep ? "auth-span-5" : "auth-span-6"}`}/>))}
            </div>
          </div>

          <div className="auth-div-6">
            {recoveryStep === 1 && (<div className="auth-div-7">
                <div className="auth-div-8">
                  <span className="auth-span-7">
                    01
                  </span>
                  <h2 className="auth-h2-1">
                    Solicitar Código
                  </h2>
                  <p className="auth-p-1">
                    Ingresa tu correo para recibir una clave temporal de un solo uso.
                  </p>
                </div>
                <Input label="Correo Registrado" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Button type="button" variant="primary" size="md" fullWidth onClick={() => setRecoveryStep(2)}>
                  Enviar Código
                </Button>
              </div>)}

            {recoveryStep === 2 && (<div className="auth-div-7">
                <div className="auth-div-8">
                  <span className="auth-span-7">
                    02
                  </span>
                  <h2 className="auth-h2-1">
                    Confirmar Código
                  </h2>
                  <p className="auth-p-1">
                    Escribe el código temporal de seguridad recibido en tu bandeja de entrada.
                  </p>
                </div>
                <Input label="Código de Seguridad" required value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)}/>
                <div className="auth-div-3">
                  <Button type="button" variant="primary" size="md" fullWidth onClick={() => setRecoveryStep(3)}>
                    Verificar Código
                  </Button>
                  <Button type="button" variant="outline" size="md" fullWidth className="auth-button-1" onClick={() => setRecoveryCode("8473-9204")}>
                    Reenviar código
                  </Button>
                </div>
              </div>)}

            {recoveryStep === 3 && (<div className="auth-div-7">
                <div className="auth-div-8">
                  <span className="auth-span-7">
                    03
                  </span>
                  <h2 className="auth-h2-1">
                    Nueva Contraseña
                  </h2>
                  <p className="auth-p-1">
                    Define una contraseña de mínimo 8 caracteres cifrada con algoritmo de seguridad.
                  </p>
                </div>
                <Input label="Nueva Contraseña" type="password" required placeholder="Mínimo 8 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <Button type="button" variant="primary" size="md" fullWidth onClick={() => {
                    if (newPassword.length < 8) {
                        alert("La nueva contraseña debe tener mínimo 8 caracteres.");
                        return;
                    }
                    alert("¡Contraseña actualizada exitosamente! Redirigiendo a inicio de sesión...");
                    onNavigate("login");
                }}>
                  Restablecer Acceso
                </Button>
              </div>)}
          </div>
        </div>
      </main>);
    }
    // VISTAS DE LOGIN Y REGISTRO
    const isRegister = mode === "register";
    return (<main className="auth-main-2">
      <div className="auth-div-9">
        <span className="auth-span-8">
          {isRegister ? "Comunidad Ciclista" : "Acceso Seguro"}
        </span>

        <h1 className="auth-h1-2">
          {isRegister ? "Crear Nueva Cuenta" : "Iniciar Sesión"}
        </h1>

        <p className="auth-p-2">
          {isRegister
            ? "Accede al catálogo, guarda favoritos y gestiona el historial de tus pedidos."
            : "Ingresa tu correo y contraseña. El sistema identificará tus permisos automáticamente."}
        </p>

        {error && (<div className="auth-div-10">
            {error}
          </div>)}

        {successMsg && (<div className="auth-div-11">
            {successMsg}
          </div>)}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form-1">
          {isRegister && (<Input label="Nombre Completo" required placeholder="Tu nombre completo" value={name} onChange={(e) => setName(e.target.value)}/>)}

          <Input label="Correo Electrónico" type="email" required placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)}/>

          <Input label="Contraseña" type="password" required placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)}/>

          {!isRegister && (<div className="auth-div-12">
              <button type="button" onClick={() => onNavigate("recovery")} className="auth-button-2">
                ¿Olvidaste tu contraseña?
              </button>
            </div>)}

          <Button type="submit" variant="primary" size="md" fullWidth className="auth-button-3" icon={<Icon name="arrow" size={16}/>}>
            {isRegister ? "Registrar Mi Cuenta" : "Ingresar a la Plataforma"}
          </Button>
        </form>

        {/* Indicador discreto de cuentas registradas de ejemplo */}
        {!isRegister && (<div className="auth-div-13">
            <b className="auth-b-1">Cuentas registradas para prueba:</b>
            <div className="auth-div-14">
              <div>Administrador: <span className="auth-span-9">a.silva@bikestore.com</span></div>
              <div>Cliente: <span className="auth-span-9">beatriz.m@gmail.com</span></div>
              <div className="auth-div-15">Clave genérica: <span className="auth-span-10">12345678</span></div>
            </div>
          </div>)}

        <div className="auth-div-16">
          {isRegister ? (<>
              ¿Ya tienes una cuenta registrada?{" "}
              <button type="button" onClick={() => onNavigate("login")} className="auth-button-4">
                Inicia sesión aquí
              </button>
            </>) : (<>
              ¿Aún no eres miembro de BikeStore?{" "}
              <button type="button" onClick={() => onNavigate("register")} className="auth-button-4">
                Regístrate ahora
              </button>
            </>)}
        </div>
      </div>
    </main>);
};
export default AuthPage;
