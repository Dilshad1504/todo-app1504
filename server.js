const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const Todo = require("./models/Todo");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error", err));

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/saveTodos", async (req, res) => {
    try {
        await Todo.deleteMany();
        await Todo.insertMany(req.body);
        res.json({ message: "Saved Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/health", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});