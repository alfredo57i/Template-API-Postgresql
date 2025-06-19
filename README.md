# 🛡️ API NestJS Autenticación + Roles + Permisos + Constantes

API construida con [NestJS](https://nestjs.com/), usando PostgreSQL como base de datos. Incluye:

- Registro e inicio de sesión con JWT (access y refresh token)
- Protección de rutas por rol y permisos
- Gestión de usuarios y perfiles
- Sistema dinámico de constantes agrupadas por clave (`ciudades`, `yesno`, etc.)
- Organización modular y validaciones con DTOs
- Integración con Swagger

## 🚀 Requisitos

- Node.js ≥ 18
- Yarn ≥ 1.22
- PostgreSQL
- `.env` configurado

## 🛠️ Instalación

```bash
yarn install
```

## ⚙️ Variables de entorno (`.env`)

Crea un archivo `.env` con:

```env
# JWT
JWT_ACCESS_SECRET=super-secret-access
JWT_REFRESH_SECRET=super-secret-refresh
TOKEN_EXPIRED=15m
REFRESH_EXPIRED=7d

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mi_api

# App
PORT=3000
```