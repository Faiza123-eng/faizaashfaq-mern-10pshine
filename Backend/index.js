import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './conn/conn.js'; // Note: .js is required for ES modules
import logger from './utilities/logger.js'; // Note: .js is required for ES modules

const app = express();
export default app;

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
import authRoutes from './routes/auth.routes.js'; // Note: .js is required for ES modules
import noteRoutes from './routes/note.routes.js'; // Note: .js is required for ES modules
import favouriteRoutes from './routes/favorite.routes.js'; // Note: .js is required for ES modules
import pinnedRoutes from './routes/pinned.routes.js'; // Note: .js is required for ES modules

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/favorites", favouriteRoutes);
app.use("/api/pinned", pinnedRoutes);
