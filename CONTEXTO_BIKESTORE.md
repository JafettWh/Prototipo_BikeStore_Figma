# CONTEXTO DEL PROYECTO BIKESTORE

> Archivo de contexto para el agente de IA (Antigravity). Resume todo lo documentado y decidido hasta el 09/10/2026.
> Léelo completo antes de generar código o documentación. Si algo no está aquí, **no lo inventes**: indícalo, propón alternativas con ventajas y desventajas, y espera una decisión.

---

## 1. Reglas de trabajo para el agente

1. Prioridad: (1) documentos oficiales del SENA, (2) coherencia del proyecto completo, (3) buenas prácticas, (4) código mantenible.
2. **Nunca inventes requisitos.** Si los documentos no especifican algo, dilo, propón opciones y espera decisión antes de asumir cambios importantes.
3. Antes de responder, verifica que no contradigas: RF, RNF, historias de usuario, casos de uso, base de datos, arquitectura y entregables anteriores.
4. Usa nombres consistentes para tablas, clases, endpoints, variables y entidades (en español, como en los documentos).
5. Explica las decisiones técnicas y por qué se toman: el aprendiz debe poder **defenderlas ante los instructores**.
6. Desarrollo **incremental y explicado**, no grandes volcados de código. Entrega solo la pieza pedida, no regeneres documentos completos.
7. Código: arquitectura limpia, SOLID cuando aplique, sin duplicación, comentarios solo donde sean necesarios.
8. Documentación: lenguaje técnico y formal, sin texto innecesario. Español natural, no excesivamente técnico; voz académica en primera persona cuando sea un entregable del aprendiz.
9. Calidad antes que velocidad.

---

## 2. Contexto institucional

- **Programa:** Tecnólogo en Análisis y Desarrollo de Software (ADSO), SENA, Centro de Biotecnología Industrial (CBI), Palmira. Ficha 3409924.
- **Proyecto:** BikeStore, tienda virtual para venta de bicicletas deportivas y accesorios. Proyecto didáctico formativo.
- **Metodología:** SCRUM, gestionado en Taiga.io (https://tree.taiga.io/project/jafettwh-bikestore/backlog).
- **Product Owner / cliente:** equipo de instructores. Instructor que valida las HU: Freddy Sierra.
- **Equipo:** Jafet Hernández (desarrolla prácticamente solo) y David Arce (asignado, sin participación activa; riesgo documentado en el Acta).
- **Repositorio:** https://github.com/JafettWh/bikestore_proyecto_base.git. Ramas: `main`, `Jafet` (rama de trabajo), `Arce`.
- **Fases (Taiga):** Sprint 0 planeación/arquitectura/diseño; 1 catálogo; 2 usuarios; 3 compras; 4 administración; 5 dashboard e informes; 6 pruebas y despliegue. Total 15 semanas. **Los Sprints aún se están definiendo: no asignar Sprints a las HU por ahora.**

---

## 3. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Base de datos | **MySQL** (confirmada; ya no se maneja PostgreSQL) |
| Autenticación | JWT + bcrypt |
| Control de versiones | Git, GitHub |
| Pruebas | Funcionales y E2E |
| Despliegue | Servidor local (RNF-12) |

### Código base reutilizado (de un proyecto previo "laboratorio CRUD")

- Backend: Express 5, `mysql2/promise` con pool (SQL parametrizado, **sin ORM**), `bcrypt`, `jsonwebtoken`, `multer`, `cors`, `dotenv`.
- Ya implementado: registro/login, hash bcrypt, emisión de JWT, middlewares `authenticate` y `authorize(...roles)`.
- Frontend: React 19, Vite, react-router-dom 7, Context API (`AuthContext`), hook `useAuth`, `ProtectedRoute`, carpeta `services/` (`api.js`, `auth.service.js`, ...).
- BD heredada (`sql/lab_crud.sql`): `usuarios` (id_usuario, nombre, email, password, rol ENUM admin/cliente) y `equipos` (placeholder que se reemplaza por entidades de BikeStore).

---

## 4. Arquitectura (validada por el instructor)

- **Estilo:** arquitectura en capas (Presentación, Negocio, Acceso a Datos) + Base de Datos.
- **Patrón backend:** `routes/ → controllers/ → services/ → repositories/`
  - Routes: endpoints y middlewares.
  - Controllers: reciben la petición HTTP y delegan.
  - Services: reglas de negocio (validaciones, 404, lógica).
  - Repositories: **único lugar donde se ejecuta SQL** (`pool.execute`, parametrizado, sin ORM).
- Decisión de Jafet: la capa Repository se aplica **en todo el proyecto**. `auth` y `equipos` ya fueron refactorizados; los módulos nuevos (Producto, Carrito, Pedido/Pago, Dashboard) deben seguir este patrón desde el inicio.
- Carpetas adicionales: `middlewares/` (auth, error, upload), `config/` (db, env), `utils/` (AppError, jwt).
- Diagrama v1.1 con tabla `bicicletas` agregada en la BD. Documentos generados: `Anexo_Arquitectura_BikeStore.docx`, `Arquitectura_BikeStore_IEEE.docx`, vista modular por capas (diagrama principal de sustentación), diagrama de clases UML de CU-08/Pedido.

---

## 5. Requerimientos funcionales (oficiales)

**Catálogo**
- RF-01 Consultar catálogo sin estar logueado.
- RF-02 Mostrar imagen, nombre, precio y disponibilidad por producto.
- RF-03 Filtrar por categoría.
- RF-04 Ordenar por precio ascendente/descendente.

**Carrito**
- RF-05 Agregar productos al carrito desde catálogo o detalle.
- RF-06 Mostrar productos, cantidades, valores parciales y total.
- RF-07 Modificar cantidad.
- RF-08 Conservar el carrito asociado al cliente para recuperarlo.

**Compras y pagos**
- RF-09 Resumen del pedido antes de pagar.
- RF-10 Número único por pedido.
- RF-11 Pago simulado con datos de cuenta y dirección de envío, con aviso de pago exitoso.
- RF-12 Confirmación cuando el pago se procesa.

**Usuarios**
- RF-13 Registro con nombre, correo y contraseña.
- RF-14 Validar el correo en el registro.
- RF-15 Inicio de sesión con correo y contraseña.
- RF-16 Recuperar contraseña.

**Administración de productos**
- RF-17 Registrar productos.
- RF-18 Actualizar precios, existencias, etc.
- RF-19 Inactivar productos.
- RF-20 Consultar, buscar y filtrar productos.

**Dashboard e informes**
- RF-21 Dashboard con métricas y alertas de la operación comercial.
- RF-22 Ventas totales.
- RF-23 Productos más vendidos.
- RF-24 Cantidad de pedidos.
- RF-25 Filtrar por fechas y categorías.
- RF-26 Exportar informes a Excel o PDF.

**Administración y seguridad**
- RF-27 Listado de usuarios.
- RF-28 Asignar roles.
- RF-29 Activar/desactivar cuentas (**omitido de las HU por sugerencia del instructor**: solo se inactiva, no se reactiva).
- RF-30 Control de acceso por rol (restricción transversal, no es CU).
- RF-31 Buscar usuarios desde el panel administrativo.

## 6. Requerimientos no funcionales (oficiales)

| ID | Categoría | Requisito |
|---|---|---|
| RNF-01 | Usabilidad | Interfaz clara, consistente, operaciones principales intuitivas |
| RNF-02 | Responsive | Computadores, tabletas y móviles |
| RNF-03 | Rendimiento | Consultas del catálogo en tiempo adecuado |
| RNF-04 | Seguridad | Impedir acceso no autorizado a funciones administrativas |
| RNF-05 | Seguridad | Contraseñas no almacenadas en texto plano (hash) |
| RNF-06 | Integridad | Integridad de productos, usuarios, pedidos y detalles |
| RNF-07 | Disponibilidad | Disponible en periodos de pruebas y demostraciones |
| RNF-08 | Mantenibilidad | Código modular |
| RNF-09 | Compatibilidad | Navegadores definidos para pruebas |
| RNF-10 | Usabilidad | Mensajes de error y confirmación comprensibles |
| RNF-11 | Escalabilidad | Permitir nuevas funcionalidades sin rehacer la solución |
| RNF-12 | Despliegue | Desplegable en servidor local |

---

## 7. Diagrama de casos de uso (validado por el instructor)

- **Actores:** Visitante, Usuario (actor abstracto/generalizador), Cliente, Administrador.
  - Escenario 1 y 3: Usuario generaliza a Visitante y Cliente.
  - Escenario 2: Usuario generaliza a Cliente y Administrador.
- **17 casos de uso (CU-01 a CU-17) en 6 escenarios.**
- RF-30 y RF-08 se excluyeron del diagrama por ser restricciones transversales.
- Por indicación del instructor, estos óvalos **no son CU independientes** sino pasos internos del flujo:
  - "Realizar pago simulado" → dentro de CU-08.
  - "Consultar usuarios" / búsqueda de usuario → dentro de CU-16 y CU-17.
- "Iniciar sesión" en el Escenario 3 se **cita** desde CU-08 (`<<include>>` hacia CU-04).
- En el Escenario 4 el óvalo de Registrar producto dice "CU-9" en el drawio; el correcto es **CU-09**.

| Escenario | Actores | CU |
|---|---|---|
| 1. Exploración del catálogo | Usuario (Visitante, Cliente) | CU-01, CU-02 |
| 2. Cuenta y acceso | Usuario (Cliente, Administrador) | CU-03, CU-04, CU-05 |
| 3. Carrito y compra | Usuario (Visitante, Cliente); Cliente | CU-06, CU-07, CU-08 (incluye CU-04) |
| 4. Administración de productos | Administrador | CU-09, CU-10, CU-11, CU-12 |
| 5. Dashboard e informes | Administrador | CU-13, CU-14 (incluye CU-13) |
| 6. Administración de usuarios y seguridad | Administrador | CU-15, CU-16, CU-17 |

Archivo del diagrama: `Diagrama_Casos_Uso_BikeStore_Vfinal.drawio` (6 páginas, una por escenario).

---

## 8. Documentación de casos de uso (fichas)

Plantilla oficial: `PLANTILLA_DOCUMENTACIÓN_CASOS_DE_USO.docx`. Estilo acordado: pares atómicos actor/sistema, flujos alternos con numeración decimal ligada al paso de origen (ej. 4.1), cierre con "Retorno al paso X." o "Fin del caso de uso alterno.". Autor: Jafet Hernández.

### Escenario 1: Exploración del catálogo

**CU-01 Consultar catálogo de productos** (v1.3, 06/10/2026) · Actor: Usuario · Importancia: Vital · Frecuencia: alta · RF-01, 02, 03, 04
- Precondición: existen productos activos en la BD. Postcondición: se ve el listado filtrado/ordenado.
- Flujo normal: (1) Usuario ingresa a la página principal → (2) Sistema consulta productos activos y muestra imagen, nombre, precio, disponibilidad → (3) Usuario elige categoría → (4) Sistema filtra → (5) Usuario elige orden por precio → (6) Sistema reordena. Fin.
- Alternos: 2.1 no hay productos activos o falla la consulta: mensaje "No hay productos disponibles por el momento". 2.2 productos Inactivos se excluyen del catálogo público (retorno al paso 1).

**CU-02 Ver detalle del producto** (v1.3) · Actor: Usuario · Importancia: Alta · Frecuencia: alta · RF-02
- Precondición: producto existente y activo.
- Flujo normal: (1) Usuario consulta un producto → (2) Sistema valida disponibilidad y lo muestra → (3) Usuario selecciona producto → (4) Sistema valida stock → (5) Sistema muestra detalle (imagen, nombre, descripción, especificaciones técnicas, precio, disponibilidad). Fin.
- Alternos: 2.1 producto no disponible, no se muestra (retorno 1). 2.2 producto inexistente: mensaje de error (retorno 1). 4.1 sin stock: se muestra "sin stock" y se **inhabilita comprar/añadir al carrito**. Fin alterno.

### Escenario 2: Cuenta y acceso

**CU-03 Registrarse** (v1.1) · Actor: Usuario (Cliente o Administrador) · Importancia: Vital · Frecuencia: media · RF-13, RF-14, RNF-05
- Precondición: el correo no está registrado. Postcondición: cuenta nueva **activa**, contraseña con hash.
- Flujo normal: (1) Usuario presiona Registrarse → (2) Sistema muestra formulario (nombre, correo, contraseña de mínimo 8) → (3) Usuario digita datos → (4) Sistema valida campos llenos, formato de correo y contraseña ≥ 8 → (5) Usuario valida la información → (6) Usuario confirma envío → (7) Sistema verifica correo no registrado, cifra con **bcrypt** y crea la cuenta → (8) Redirige a CU-04.
- Alternos: 4.1 formato de correo incorrecto; 4.2 formato de contraseña incorrecto; 4.3 campos vacíos (retorno 3); 7.1 correo ya existe (retorno 3).

**CU-04 Iniciar sesión** (v1.1) · Actor: Usuario · Importancia: Vital · Frecuencia: alta · RF-15, RNF-04
- Precondición: cuenta registrada y activa. Postcondición: usuario autenticado con acceso según su rol.
- Flujo normal: (1) Usuario presiona Iniciar sesión → (2) Sistema muestra formulario → (3) Usuario digita correo y contraseña → (4) Sistema valida credenciales, formato y estado de la cuenta → (5) Usuario confirma → (6) Sistema genera **token JWT** y redirige a la interfaz del rol.
- Alternos: 4.1 campos vacíos; 4.2 formato inválido; 4.3 no existe cuenta con esas credenciales (sugiere registrarse); 4.4 cuenta inactiva, acceso denegado (todos retornan al paso 3).

**CU-05 Recuperar contraseña** (v1.1) · Actor: Usuario · Importancia: Alta · Frecuencia: baja · RF-16
- Precondición: el correo corresponde a una cuenta registrada.
- Flujo normal: (1) Usuario solicita recuperación → (2) Sistema abre formulario pidiendo el correo → (3) Usuario ingresa correo → (4) Sistema valida formato y que la cuenta exista y esté activa → (5) Sistema envía correo (vía Gmail) con un código de recuperación → (6) Sistema muestra formulario del código → (7) Usuario digita el código → (8) Sistema valida el código y pide nueva contraseña (mín. 8, distinta de la anterior) → (9) Usuario digita y confirma → (10) Sistema valida que no sea igual a la anterior, cifra con bcrypt y actualiza → (11) Redirige a CU-04.
- Alternos: 4.1 no existe cuenta; 4.2 cuenta inactiva; 4.3 formato de correo incorrecto (retorno 3); 8.1 código incorrecto (retorno 7); 10.1 contraseña < 8; 10.2 igual a la anterior (retorno 9).

### Escenario 3: Carrito y compra

**CU-06 Agregar producto al carrito** (v1.1) · Actor: Usuario · Importancia: Vital · Frecuencia: alta · RF-05
- Precondición: producto activo con inventario.
- Flujo normal: (1) Usuario selecciona producto (catálogo o detalle) y presiona "Agregar al carrito" → (2) Sistema muestra campo de cantidad (mín. 1) → (3) Usuario ingresa cantidad y confirma → (4) Sistema valida que no supere el stock → (5) Sistema añade al carrito y actualiza el total.
- Alternos: 4.1 cantidad inválida (retorno 3); 4.2 supera stock: muestra el máximo disponible y ajusta (retorno 3).

**CU-07 Ver y modificar carrito** (v1.2, 06/10/2026) · Actor: Usuario · Importancia: Alta · Frecuencia: alta · RF-06, RF-07
- Precondición: el carrito tiene al menos un producto.
- Flujo normal: (1) Usuario accede al carrito → (2) Sistema consulta la BD y muestra productos, cantidades, parciales y total → (3) Usuario modifica cantidad (≥ 1) → (4) Sistema valida disponibilidad (no supera stock) → (5) Sistema actualiza la BD, recalcula parciales y total.
- Alternos: 3.1 cantidad a cero o botón Eliminar → 5.1 pide confirmación; 3.2 usuario confirma → 5.2 remueve, recalcula y actualiza BD; 3.3 usuario cancela → 5.3 mantiene la cantidad anterior (retorno 3).

**CU-08 Realizar compra** (v1.1) · Actor: **Cliente** · Importancia: Vital · Frecuencia: media-alta · RF-09, 10, 11, 12
- Precondición: sesión iniciada (cita CU-04) y al menos un producto en el carrito. Postcondición: pedido con número único y confirmación de pago exitoso.
- Flujo normal: (1) Cliente presiona "Finalizar compra" (cita CU-04 si no hay sesión) → (2) Sistema muestra resumen del pedido (productos, cantidades, total) y campos de dirección de envío → (3) Cliente ingresa/selecciona dirección y confirma → (4) Sistema valida dirección y muestra formulario del pago simulado → (5) Cliente ingresa datos de cuenta simulados → (6) Sistema valida formato y campos y **genera número único de pedido** → (7) Sistema procesa el pago simulado y marca el pedido como **pagado** → (8) Sistema muestra aviso de pago exitoso y confirmación.
- Alternos: 4.1 campos de dirección pendientes (retorno 3); 6.1 formato inválido de datos de cuenta; 6.2 campos pendientes de cuenta (retorno 5).
- Nota: dirección de envío y pago simulado son pasos del flujo, no CU independientes.

### Escenario 4: Administración de productos

**CU-09 Registrar producto** (v1.1) · Actor: Administrador · Importancia: Vital · Frecuencia: media · RF-17
- Campos: nombre, descripción, precio, categoría, imagen, existencias.
- Flujo normal: (1) Admin entra a gestión de productos y presiona Registrar → (2) Sistema muestra formulario con campos obligatorios → (3) Admin diligencia y confirma → (4) Sistema valida campos completos y precio/existencias numéricos válidos → (5) Sistema registra y publica en el catálogo.
- Alternos: 4.1 campos pendientes; 4.2 valor inválido (retorno 3).

**CU-10 Buscar y filtrar productos** (v1.1) · Actor: Administrador · Importancia: Alta · Frecuencia: media · RF-20
- Flujo normal: (1) Admin entra a gestión de productos → (2) Sistema muestra el listado completo → (3) Admin ingresa criterio o filtra por categoría/estado → (4) Sistema consulta y muestra coincidencias.
- Alterno: 4.1 sin resultados (retorno 3).

**CU-11 Actualizar producto** (v1.2, 06/10/2026) · Actor: Administrador · Importancia: Vital · Frecuencia: media · RF-18 · cita CU-10
- Flujo normal: (1) Admin busca y selecciona producto (cita CU-10) y presiona Actualizar → (2) Sistema muestra formulario con datos actuales → (3) Admin modifica (precio, stock, descripción, imagen) y presiona Guardar → (4) Sistema verifica obligatorios (nombre, categoría, precio, existencias) y que **precio > 0** → (5) Sistema verifica que **stock sea entero ≥ 0** y valida formato/tamaño de la nueva imagen → (6) Sistema guarda, actualiza el catálogo y muestra "Producto actualizado exitosamente".
- Alternos: 4.1 obligatorio vacío; 4.2 precio ≤ 0/no numérico o stock negativo; 4.3 formato de imagen inválido (JPG, PNG) (retorno 3); 3.1 Cancelar: descarta cambios y vuelve al listado.

**CU-12 Inactivar producto** (v1.2, 06/10/2026) · Actor: Administrador · Importancia: Alta · Frecuencia: baja · RF-19 · cita CU-10
- **Requiere justificación obligatoria (motivo)** y se diferencia el estado *Inactivo* del "sin stock".
- Flujo normal: (1) Admin busca y selecciona producto activo (cita CU-10) y presiona Inactivar → (2) Sistema pide confirmación y motivo obligatorio → (3) Admin digita motivo y confirma → (4) Sistema valida motivo no vacío, **guarda el motivo**, cambia el estado a Inactivo y lo retira del catálogo público.
- Alternos: 4.1 motivo vacío (retorno 3); 3.1 cancelar → 4.2 cierra el aviso sin cambios.

### Escenario 5: Dashboard e informes

**CU-13 Consultar dashboard de métricas** (v1.1) · Actor: Administrador · Importancia: Vital · Frecuencia: alta · RF-21, 22, 23, 24, 25
- Precondición: Admin con sesión y rol.
- Flujo normal: (1) Admin accede al dashboard → (2) Sistema calcula ventas totales, productos más vendidos y cantidad de pedidos → (3) Sistema muestra las métricas → (4) Admin filtra por fecha o categoría → (5) Sistema recalcula y actualiza.
- Alterno: 5.1 sin datos: valores en cero o aviso de ausencia de datos (retorno 4).

**CU-14 Exportar informes** (v1.1) · Actor: Administrador · Importancia: Alta · Frecuencia: baja-media · RF-26 · **incluye CU-13**
- Flujo normal: (1) Admin consulta el dashboard (incluye CU-13) y presiona Exportar → (2) Sistema pide formato (Excel o PDF) → (3) Admin elige y confirma → (4) Sistema genera el archivo → (5) Sistema lo deja disponible para descarga.
- Alternos: 3.1 Admin cancela (2.1 no se genera archivo); sin datos en el periodo: aviso de que no hay nada que exportar.

### Escenario 6: Administración de usuarios y seguridad

**CU-15 Crear usuario** (v1.1) · Actor: Administrador · Importancia: Alta · Frecuencia: baja · RF-27, RF-28
- Flujo normal: (1) Admin entra al panel de usuarios y presiona Crear usuario → (2) Sistema muestra formulario (nombre, correo, contraseña, rol) → (3) Admin diligencia, asigna rol y confirma → (4) Sistema valida campos completos, formato de correo y que no esté registrado → (5) Sistema cifra con bcrypt, registra con el rol y actualiza el listado.
- Alternos: 4.1 campos pendientes; 4.2 correo ya registrado (retorno 3); 3.1 cancelar → 5.1 no se registra nada.

**CU-16 Actualizar usuario** (v1.1) · Actor: Administrador · Importancia: Alta · Frecuencia: baja · RF-27, 28, 31
- Flujo normal: (1) Admin entra al panel → (2) Sistema muestra listado → (3) Admin busca y selecciona usuario → (4) Sistema muestra formulario con datos actuales → (5) Admin modifica datos o rol y confirma → (6) Sistema valida → (7) Sistema guarda en BD.
- Alternos: 4.1 sin resultados de búsqueda (retorno 3); 5.1 cancelar → 7.1 no guarda.
- **Regla de negocio:** debe existir siempre al menos un Administrador activo (no se puede quitar el rol admin al último).
- La consulta y búsqueda de usuario son pasos propios del flujo, no un CU.

**CU-17 Inactivar usuario** (v1.1) · Actor: Administrador · Importancia: Alta · Frecuencia: baja · RF-29 (solo inactivar), RF-31
- Precondición: usuario activo. Postcondición: cuenta inactiva, no puede iniciar sesión, **no se elimina su información**.
- Flujo normal: (1) Admin entra al panel → (2) Sistema muestra listado → (3) Admin busca y selecciona usuario activo → (4) Sistema pide confirmación → (5) Admin confirma → (6) Sistema cambia a inactivo en BD y listado e impide futuros inicios de sesión.
- Alternos: 4.1 sin resultados; 4.2 **debe existir al menos un Administrador activo** (retorno 3); 5.1 cancelar → 6.1 cierra el aviso sin cambios.

---

## 9. Historias de Usuario (Taiga)

**Decisiones acordadas (07/10/2026):**
- Se acuerdan **19 HU (HU01 a HU19)**, en el orden propuesto, **empezando por la consulta del catálogo (HU01)**.
- Título con formato: `HU01 - Registro en el aplicativo web Bikestore` (número + guion + nombre).
- RF-29 (reactivar cuentas) se omite por sugerencia del instructor.
- "Entradas de mercancía" y "cargar compras" se omiten: en su lugar está el registro de productos.
- Se agregan las **alertas del dashboard** (RF-21).
- **HU09 (conservar carrito, RF-08)** queda como historia separada.
- No asignar Sprints todavía.
- Se redactan **una a una**; cada HU se **valida con el instructor Freddy Sierra** antes de seguir.
- Los criterios de aceptación deben **citar los RF y los CU** correspondientes.
- Entrega: ya formateada para copiar y pegar en Taiga (no bloque de código aparte).

**Estructura obligatoria de cada HU** (según el ejemplo oficial):
1. Título y **Prioridad** (con justificación breve).
2. Tabla **Como / Quiero / Para**.
3. Tabla **INVEST** (Independiente, Negociable, Valiosa, Estimable, Pequeña/Small, Testeable).
4. **Criterios de aceptación** agrupados por tema (validaciones, mensajes de error).
5. **Escenarios Gherkin** (Dado que / Cuando / Entonces), exitoso y de error.
6. **Definition of Done (DoD)** con casillas.
7. **Aprobación del Product Owner** (Sí / No).

**Estado:** el texto validado de cada HU no está en este archivo. Pega aquí las HU ya cerradas o indícale al agente cuáles faltan.

| HU | Título | Estado |
|---|---|---|
| HU01 | Consulta del catálogo de productos | (completar) |
| HU02 a HU19 | (completar con el listado acordado) | (completar) |

---

## 10. Plan de datos (pendiente de formalizar en el MER)

Aún **no están definidos** el MER, el modelo relacional ni el diccionario de datos. Implicaciones que ya salen de los CU documentados, para tener en cuenta (sin fijar nombres definitivos hasta decidirlo):

- Usuario: estado activo/inactivo, rol (cliente/admin), contraseña con hash, código temporal de recuperación.
- Producto: categoría, imagen, existencias, precio > 0, estado activo/inactivo, **motivo de inactivación** (CU-12), diferencia entre inactivo y sin stock.
- Carrito persistente por cliente (RF-08), con ítems y cantidades.
- Pedido: número único, estado (pagado), dirección de envío, detalle de pedido (RNF-06).
- Dashboard: se calcula sobre pedidos y detalle (ventas totales, más vendidos, cantidad de pedidos, filtro por fecha y categoría).

---

## 11. Prototipo de frontend (Figma Make)

- Hay un prototipo hecho con Figma Make, subido al repositorio. Stack: React 19 + Vite + Tailwind CSS v4; todo en un solo `src/App.tsx` y un `src/index.css` grande.
- Páginas del prototipo (estado `page`): home, product, cart, checkout, success, login, register, recovery, admin.
- Datos del prototipo: productos de ejemplo (bicicletas, componentes, accesorios) con imágenes en `public/assets/products/`; precios en COP.
- Estado del prototipo: carrito en memoria, pago simulado, panel admin con pestañas Resumen / Productos / Usuarios y seguridad, modal de búsqueda, toast al agregar.
- **Objetivo:** reescribirlo en React con **estructura atómica** (components, organisms, routes, etc.), sin código espagueti, siguiendo las HU acordadas y los flujos de los CU.
- Los instructores pidieron incluir un apartado de **Mantenimiento**. **No está documentado ni dentro del alcance real**: se hace **solo funcional en el prototipo, sin persistencia real** (opción A elegida).
- Mejoras de diseño pedidas: modales bien diseñados e interactivos, efectos hover, y usar `logo.png` del repo con fondo transparente.
- Observaciones a corregir al migrar para respetar los CU: el prototipo usa un único producto fijo en detalle y checkout, el carrito no valida stock, el login lleva siempre a admin, y "Mantenimiento" no tiene CU.

---

## 12. Documentos entregados hasta ahora

| Entregable | Estado |
|---|---|
| Acta de constitución (`Acta_Constitucion_del_proyecto_Agosto_2026.docx`) | Redactada |
| EDT/WBS + diagrama de Gantt (Actividad 5) | Entregado en Word |
| Diagrama de casos de uso (6 escenarios, 17 CU) | Validado por el instructor |
| Fichas de casos de uso (un .docx por escenario) | Completas, CU-01 a CU-17 |
| Arquitectura en capas v1.1 + anexo + versión IEEE | Validada |
| Historias de Usuario | En curso, una a una |
| MER, modelo relacional, diccionario de datos | Pendiente |
| Wireframes / prototipos | Prototipo Figma Make en refactor |
| API REST, backend, frontend, dashboard, reportes | Pendiente |
| Manual técnico, manual de usuario, presentación final | Pendiente |

## 13. Inconsistencias y pendientes con el instructor

1. **Despliegue:** RNF-12 dice servidor local, pero la tabla del Sprint 7 dice servidor en la nube. Resolver con el instructor.
2. **Duración del Sprint 0:** 3 semanas en una tabla y 5 semanas en otra (el total de 15 semanas solo cuadra con 5). El EDT usa 5.
3. **Fecha de inicio:** el EDT asume 14/09/2026 (no hay fecha oficial).
4. **Acta:** pendientes fecha de constitución, cliente formal, fechas de Sprints y presupuesto.
5. **Numeración de Sprints:** la tabla del documento oficial salta el Sprint 1 (0, 2, 3...7), mientras que la tabla de fases usa 0 a 6. Los Sprints se definen más adelante.
6. **Participación del compañero (David Arce):** riesgo documentado en el Acta.
7. **Mantenimiento:** apartado pedido por los instructores sin RF, HU ni CU. Pendiente de decidir si se formaliza.

## 14. Cómo continuar

Siguiente trabajo lógico, en este orden y sin saltarse la validación del instructor:
1. Terminar las HU (una a una).
2. MER, modelo relacional y diccionario de datos (alineados con los CU y la arquitectura).
3. Refactor atómico del frontend sobre el prototipo.
4. Backend por módulos (Producto, Carrito, Pedido/Pago, Dashboard) con el patrón Routes → Controllers → Services → Repositories.
5. Pruebas funcionales y E2E, despliegue y manuales.
