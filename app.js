import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js'



const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

// Acá van a ir las rutas: /api/auth, /api/users, /api/events, /api/categories

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
});