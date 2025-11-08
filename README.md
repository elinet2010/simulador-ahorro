# Simulador de Ahorro Digital

Aplicación web desarrollada con Next.js para mostrar productos de ahorro digital, simular rentabilidad y capturar información de usuarios interesados.

## 🛠️ Stack Tecnológico

- **Next.js 16+** (App Router) - Frontend
- **React 19+**
- **TypeScript**
- **Redux Toolkit** - Estado global
- **Material-UI (MUI)** - Componentes UI
- **Formik + Yup** - Formularios y validación
- **Tailwind CSS** - Estilos
- **pnpm** - Gestor de paquetes con workspaces

## 📋 Prerrequisitos

- **Node.js** 18+ instalado
- **pnpm** instalado globalmente

### Instalar pnpm

```bash
npm install -g pnpm
```

O con Homebrew (Mac):
```bash
brew install pnpm
```

## 🚀 Cómo levantar el proyecto en local

### 1. Clonar el repositorio (si aplica)

```bash
git clone <url-del-repositorio>
cd simulador
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

Este comando instalará todas las dependencias de todos los workspaces (frontend, backend si existe, etc.).

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en `apps/frontend/`:

```env
# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_aqui

# API Backend (si usas NestJS)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Ejecutar el proyecto

#### Opción 1: Desde la raíz del proyecto

```bash
pnpm dev
```

#### Opción 2: Desde el workspace frontend

```bash
cd apps/frontend
pnpm dev
```

### 5. Abrir en el navegador

El proyecto estará disponible en: **http://localhost:3000**

## 📦 Comandos útiles de pnpm

### Comandos desde la raíz del proyecto

#### Ejecutar frontend desde la raíz

```bash
pnpm dev
```

#### Ejecutar backend (si existe)

```bash
pnpm dev:backend
```

#### Build del frontend

```bash
pnpm build
```

#### Linting

```bash
pnpm lint
```

### Gestión de dependencias

#### Agregar dependencia solo al frontend

```bash
pnpm --filter frontend add <paquete>
```

Ejemplo:
```bash
pnpm --filter frontend add lodash
```

#### Agregar dependencia de desarrollo al frontend

```bash
pnpm --filter frontend add -D <paquete>
```

Ejemplo:
```bash
pnpm --filter frontend add -D @types/lodash
```

#### Agregar dependencia a todos los workspaces

```bash
pnpm --filter './apps/*' add <paquete>
```

Ejemplo:
```bash
pnpm --filter './apps/*' add typescript
```

#### Ver estructura de dependencias

```bash
pnpm list --depth=0
```

Este comando muestra todas las dependencias instaladas en cada workspace.

### Limpieza y mantenimiento

#### Limpiar node_modules de todos los workspaces

```bash
pnpm --filter './apps/*' exec rm -rf node_modules
pnpm install
```

#### Limpiar cache de pnpm

```bash
pnpm store prune
```

#### Verificar dependencias

```bash
pnpm list --depth=0
```

## 📁 Estructura del proyecto

```
simulador/
├── apps/
│   └── frontend/          # Aplicación Next.js
│       ├── app/           # App Router de Next.js
│       ├── components/    # Componentes React
│       ├── store/         # Redux Toolkit store
│       ├── lib/           # Utilidades y configuraciones
│       └── public/        # Archivos estáticos
├── packages/              # Código compartido (opcional)
├── pnpm-workspace.yaml    # Configuración de workspaces
└── package.json           # Package.json raíz
```

## 🎯 Scripts disponibles

### Desde la raíz

- `pnpm dev` - Inicia el servidor de desarrollo del frontend
- `pnpm dev:backend` - Inicia el servidor de desarrollo del backend (si existe)
- `pnpm build` - Construye el frontend para producción
- `pnpm build:backend` - Construye el backend para producción (si existe)
- `pnpm lint` - Ejecuta el linter en el frontend
- `pnpm clean` - Limpia los builds de todos los workspaces

### Desde apps/frontend

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye para producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta ESLint

## 🔧 Desarrollo

### Agregar una nueva dependencia

```bash
# Al frontend
pnpm --filter frontend add <paquete>

# Como dependencia de desarrollo
pnpm --filter frontend add -D <paquete>
```

### Trabajar en un workspace específico

```bash
# Navegar al frontend
cd apps/frontend

# Ejecutar comandos directamente
pnpm dev
pnpm build
```

## 🐛 Solución de problemas

### Error: pnpm no encontrado

```bash
npm install -g pnpm
```

### Error: Dependencias no instaladas

```bash
# Desde la raíz
pnpm install
```

### Error: Puerto 3000 en uso

Cambia el puerto en `apps/frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### Limpiar todo y reinstalar

```bash
# Limpiar node_modules
pnpm --filter './apps/*' exec rm -rf node_modules
rm -rf node_modules

# Limpiar cache
pnpm store prune

# Reinstalar
pnpm install
```

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de Material-UI](https://mui.com/)
- [Documentación de pnpm](https://pnpm.io/)
- [Documentación de Formik](https://formik.org/)

## 📝 Notas

- Este proyecto usa **pnpm workspaces** para gestionar múltiples paquetes
- El frontend está en `apps/frontend/`
- Todas las dependencias se instalan desde la raíz con `pnpm install`
- Los comandos desde la raíz usan `--filter` para ejecutar en workspaces específicos

## 🤝 Contribuir

1. Crear una rama desde `main`
2. Hacer los cambios
3. Ejecutar `pnpm lint` antes de commitear
4. Crear un Pull Request

---

**Desarrollado con ❤️ usando Next.js y pnpm**

