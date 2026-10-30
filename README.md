# Trabajo Práctico Integrador N° III

API REST para gestionar usuarios, eventos y categorías. Hecha con Node.js, Express y MongoDB (Mongoose). Instituto Politécnico Formosa, Tecnicatura en Desarrollo de Software Multiplataforma.

Autor: Matias Barrios

## Tecnologías

- Node.js y Express
- MongoDB con Mongoose
- JWT y cookies httpOnly para la autenticación
- bcrypt para encriptar contraseñas
- express-validator para las validaciones

## Instalación

1. Clonar el repositorio e instalar las dependencias:

```bash
git clone <url-del-repo>
cd trabajo-practico-integrador-3
npm install
```

2. Crear un archivo `.env` en la raíz, siguiendo el `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/eventos_db
JWT_SECRET=contrase_ultra_secreta
JWT_EXPIRES_IN=1d
PORT=3000
```

3. Levantar el servidor:

```bash
npm run dev
```

## Estructura

```
app.js
src/
├── config/        conexión a MongoDB
├── controllers/   lógica de cada endpoint
├── helpers/       funciones de JWT y bcrypt
├── middlewares/   autenticación, permisos y validaciones
├── models/        esquemas de Mongoose
└── routes/        definición de rutas
```

## Modelos

- **User**: username, email, password, role (`user` o `admin`), profile (embebido) y deletedAt para la eliminación lógica.
- **Event**: title, description, fechas, capacity, price, status, location (embebido), organizer (referencia a User) y categories (array de referencias a Category).
- **Category**: name y description.

Relaciones: User tiene un profile embebido, Event tiene una location embebida, un User organiza muchos Events (1:N) y los Events se relacionan con muchas Categories (N:M). User y Category tienen un virtual populate `events`.