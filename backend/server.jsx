const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");
const compRoutes = require("./routes/competition");
const { setupSockets } = require("./sockets/socket");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/competition", compRoutes);

// DB connect
connectDB();