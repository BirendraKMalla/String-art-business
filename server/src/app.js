const path = require("path");
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const stringArtRoutes = require("./routes/stringArtRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes (auth + admin middleware applied per-route)
app.use("/api/admin", adminRoutes);

app.use(
    "/generated",
    express.static(
        path.join(__dirname, "../")
    )
);
// Order routes
app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/string-art", stringArtRoutes);
// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from the String Art backend!"
    });
});

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated!",
        userId: req.userId
    });
});

module.exports = app;