# 💰 Simulador de Ahorro Digital

Aplicación web desarrollada con Next.js para mostrar productos de ahorro digital, simular rentabilidad y capturar información de usuarios interesados mediante formularios con validación reCAPTCHA.

## 🚀 Demo

[Ver en producción]https://simulador-ahorro-front.vercel.app/

## 🛠️ Stack Tecnológico

- **Next.js 16+** (App Router) - Framework React con Server-Side Rendering
- **React 19+** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado global
- **Material-UI (MUI)** - Componentes UI
- **Formik + Yup** - Formularios y validación
- **Tailwind CSS** - Estilos utilitarios
- **pnpm** - Gestor de paquetes con workspaces
- **reCAPTCHA v3** - Protección contra spam

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

### 1. Clonar el repositorio

```bash
git clone https://github.com/elinet2010/simulador-ahorro.git
cd simulador
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

Este comando instalará todas las dependencias de todos los workspaces.

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en `apps/frontend/`:

```env
# reCAPTCHA (obtén las keys en https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_aqui
RECAPTCHA_SECRET_KEY=tu_secret_key_aqui

# API URL (opcional, para desarrollo local)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Nota:** Para desarrollo local sin reCAPTCHA, puedes dejar las variables vacías. El sistema funcionará en modo desarrollo.

### 4. Ejecutar el proyecto

#### Opción 1: Desde la raíz del proyecto (recomendado)

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

## 📁 Estructura del proyecto

```
simulador/
├── apps/
│   └── frontend/              # Aplicación Next.js
│       ├── app/               # App Router de Next.js
│       │   ├── api/           # API Routes (Backend)
│       │   │   └── onboarding/
│       │   │       └── route.ts
│       │   ├── page.tsx       # Página principal
│       │   ├── products/      # Página de productos
│       │   ├── simulator/     # Simulador de rentabilidad
│       │   └── onboarding/    # Formulario de contacto
│       ├── components/        # Componentes React
│       │   ├── common/        # Componentes comunes (Header, etc.)
│       │   ├── home/          # Componentes de la página principal
│       │   ├── products/      # Componentes de productos
│       │   ├── simulator/     # Componentes del simulador
│       │   └── onboarding/    # Componentes del formulario
│       ├── store/             # Redux Toolkit store
│       │   ├── slices/        # Redux slices
│       │   └── hooks.ts       # Typed hooks
│       ├── lib/               # Utilidades y configuraciones
│       │   ├── currency.ts    # Utilidades de formato de moneda
│       │   ├── recaptcha.ts  # Configuración de reCAPTCHA
│       │   └── theme.ts       # Tema de Material-UI
│       ├── data/              # Datos estáticos
│       │   └── products.ts    # Lista de productos
│       ├── hooks/             # Custom hooks
│       └── public/            # Archivos estáticos
├── packages/                  # Código compartido (opcional)
├── pnpm-workspace.yaml        # Configuración de workspaces
├── vercel.json                # Configuración de Vercel
└── package.json               # Package.json raíz
```

## 🎯 Funcionalidades

- ✅ **Página principal** con hero section y beneficios
- ✅ **Catálogo de productos** con filtros y búsqueda
- ✅ **Simulador de rentabilidad** interactivo
- ✅ **Formulario de contacto** con validación reCAPTCHA v3
- ✅ **API Routes** para procesamiento de formularios
- ✅ **Responsive design** adaptado a móviles y tablets
- ✅ **Estado global** con Redux Toolkit

## 🔌 API Routes

El proyecto incluye API Routes de Next.js para el backend:

- **POST `/api/onboarding`** - Procesa el formulario de contacto con validación reCAPTCHA

### Ejemplo de uso:

```typescript
const response = await fetch('/api/onboarding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan Pérez',
    document: '12345678',
    email: 'juan@example.com',
    recaptchaToken: 'token_generado_por_recaptcha'
  })
});
```
## 🔗 Recursos externos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de Material-UI](https://mui.com/)
- [Documentación de pnpm](https://pnpm.io/)
- [Documentación de Formik](https://formik.org/)
- [Google reCAPTCHA](https://www.google.com/recaptcha/)

## 📝 Notas importantes

- Este proyecto usa **pnpm workspaces** para gestionar múltiples paquetes
- El frontend está en `apps/frontend/`
- Todas las dependencias se instalan desde la raíz con `pnpm install`
- Los comandos desde la raíz usan `--filter` para ejecutar en workspaces específicos
- El backend está implementado usando **Next.js API Routes** (no NestJS separado)
- El proyecto está configurado para desplegarse completamente en Vercel

## 🤝 Contribuir

1. Crear una rama desde `master`
2. Hacer los cambios
3. Ejecutar `pnpm lint` antes de commitear
4. Crear un Pull Request

## 📄 Licencia

MIT

## 👤 Autor

**Elizabeth Velásquez**

- GitHub: [@elinet2010](https://github.com/elinet2010)
- Repositorio: [simulador-ahorro](https://github.com/elinet2010/simulador-ahorro)

---

**Desarrollado con ❤️ usando Next.js, React y pnpm**
