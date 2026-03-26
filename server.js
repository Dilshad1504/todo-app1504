const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const Todo = require("./models/Todo");

const app = express();

// 🔥 Middleware
app.use(cors());
app.use(express.json());

// 🔥 Static frontend serve
app.use(express.static(path.join(__dirname, "public")));

// 🔥 Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 MongoDB connection (FINAL FIXED VERSION)
mongoose.connect(process.env.MONGO_URI, {
    dbName: "todosDB"
})
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("Mongo Error ❌", err);
});

// 🔥 Extra debug (IMPORTANT)
mongoose.connection.on("connected", () => {
    console.log("MongoDB actually connected 🔥");
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error ❌", err);
});

// 🔥 GET todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔥 SAVE todos (Save button)
app.post("/saveTodos", async (req, res) => {
    try {
        await Todo.deleteMany();
        await Todo.insertMany(req.body);
        res.json({ message: "Saved Successfully ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔥 Health route
app.get("/health", (req, res) => {
    res.send("Server is running ✅");
});

// 🔥 Start server (Render compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});