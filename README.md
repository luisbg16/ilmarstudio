# ILMAR STUDIO — Sitio Web & Sistema de Reservas

Sitio web de salón de belleza con reservas en línea, panel admin, galería, bilingüe ES/EN y modo de pago presencial.

---

## Inicio Rápido (Local)

```bash
# 1. Entrar a la carpeta del proyecto
cd ilmar-studio

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de configuración
cp .env.example .env
# Editar .env con tus valores reales (ver sección Configuración)

# 4. Iniciar el servidor
npm start
# → Sitio:  http://localhost:3000
# → Admin:  http://localhost:3000/admin
```

---

## Configuración (.env)

Copia `.env.example` como `.env` y completa los valores antes de desplegar.

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto: 3000) |
| `NODE_ENV` | `development` o `production` |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`. **¡Cámbiala!** |
| `JWT_SECRET` | Cadena aleatoria larga para firmar tokens de sesión |
| `STRIPE_SECRET_KEY` | Clave de Stripe (opcional, solo si usas pagos online) |
| `STRIPE_WEBHOOK_SECRET` | Secreto de webhook de Stripe (opcional) |
| `BASE_URL` | Tu dominio público, ej: `https://ilmarstudio.com` |

Para generar un JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> ⚠️ **El archivo `.env` NUNCA se sube a git.** Está en `.gitignore` por defecto.

---

## Despliegue en Railway (Recomendado)

Railway es la opción más sencilla — soporta Node.js directamente y tiene plan gratuito.

1. Crear cuenta en [railway.app](https://railway.app)
2. Subir el código a un repositorio en GitHub (ver sección Git más abajo)
3. En Railway: **New Project → Deploy from GitHub repo**
4. Seleccionar el repositorio
5. En **Variables**, agregar todas las variables del `.env`:
   - `ADMIN_PASSWORD`, `JWT_SECRET`, `NODE_ENV=production`, `BASE_URL=https://tu-app.railway.app`
6. Railway detecta automáticamente `npm start` como comando de inicio
7. Al desplegarse, copiar la URL pública y actualizarla en `BASE_URL`

**Costo**: Gratis hasta 500 horas/mes. Plan Hobby $5/mes para uso continuo.

---

## Despliegue en Render.com (Alternativa)

1. Subir código a GitHub
2. Ir a [render.com](https://render.com) → **New → Web Service**
3. Conectar el repositorio
4. Build command: `npm install`
5. Start command: `npm start`
6. Agregar variables de entorno en la sección **Environment**
7. Actualizar `BASE_URL` con la URL de Render

> **Plan gratuito**: El servidor duerme tras inactividad (primera solicitud tarda ~30s).
> **Plan pagado ($7/mes)**: Siempre encendido + dominio personalizado.

---

## Subir a Git (preparación)

```bash
# Inicializar repositorio (solo la primera vez)
git init
git add .
git commit -m "feat: ILMAR STUDIO — sitio inicial"

# Conectar a GitHub
git remote add origin https://github.com/tuusuario/ilmar-studio.git
git push -u origin main
```

> El `.gitignore` ya excluye: `.env`, `node_modules/`, `data/bookings.db`, `data/blocked_times.db`.
> Los datos de galería, servicios y configuración **sí se incluyen** en el repositorio.

---

## Funcionalidades

### Sitio Público
- Diseño blanco minimal con detalles dorados
- **Bilingüe** — Español / Inglés con toggle (persiste entre visitas)
- Sección de servicios (cargada desde base de datos)
- Galería bento con lightbox al hacer clic y scroll horizontal en móvil
- Sección Nosotros con estadísticas
- Formulario de reserva multi-paso (Servicio → Disponibilidad → Datos → Confirmación)
- Número de referencia por reserva

### Panel Admin (`/admin`)
- **Dashboard**: Ingresos, citas de hoy, pendientes, horas trabajadas
- **Reservas**: Buscar, filtrar por estado/fecha, ver detalle, cambiar estado
  - Confirmar, completar (con monto cobrado + tiempo), cancelar, no-show
- **Galería**: Subir fotos, agregar captions EN/ES, eliminar
- **Configuración**: Datos del salón, horarios, intervalo de reservas

---

## Estructura de Archivos

```
ilmar-studio/
├── server.js              — Servidor Express + todas las rutas API
├── database.js            — Configuración NeDB + datos iniciales
├── package.json
├── .env.example           — Plantilla de variables (copiar como .env)
├── .gitignore
├── data/
│   ├── services.db        — Servicios del salón
│   ├── gallery.db         — Registro de fotos de galería
│   ├── settings.db        — Configuración del negocio
│   ├── bookings.db        — Reservas (excluido de git - datos privados)
│   └── blocked_times.db   — Tiempos bloqueados (excluido de git)
└── public/
    ├── index.html         — Sitio principal
    ├── admin.html         — Panel admin
    ├── hero.png           — Imagen del hero
    ├── uploads/galeria/   — Fotos de galería subidas
    ├── img/               — Imágenes estáticas (nosotros, etc.)
    ├── css/
    │   ├── style.css      — Estilos del sitio
    │   └── admin.css      — Estilos del panel admin
    └── js/
        ├── i18n.js        — Sistema de traducción bilingüe
        ├── main.js        — Lógica frontend + lightbox + reservas
        └── admin.js       — Lógica del panel admin
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Base de datos | NeDB (embedded, sin servidor) |
| Auth | JWT + express-rate-limit |
| Subida de archivos | Multer |
| Selector de fecha | Flatpickr |
| Tipografías | Google Fonts (Cinzel + Jost) |
| Hosting | Railway / Render / cualquier VPS |

---

*ILMAR STUDIO — Belleza que realza tu esencia*
