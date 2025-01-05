const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./conn/conn");
const logger = require("./utilities/logger");
const app = express();

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const favouriteRoutes = require("./routes/favorite.routes");
const pinnedRoutes = require("./routes/pinned.routes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/favorites", favouriteRoutes);
app.use("/api/pinned", pinnedRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("VERIFY_EMAIL_SECRET:", process.env.VERIFY_EMAIL_SECRET);