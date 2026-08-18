const express = require("express");

const app = express();

app.use(express.json());

// ==========================================
// Dummy Users
// ==========================================

const users = [
  {
    id: 1,
    name: "Chetan Sharma",
    email: "chetan@example.com",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@example.com",
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit@example.com",
  },
];

// ==========================================
// GET /users/:id
// ==========================================

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

// ==========================================
// GET /users
// ==========================================

app.get("/users", (req, res) => {
  res.json(users);
});

// ==========================================
// POST /users
// ==========================================

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// ==========================================
// Start REST Server
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`REST API running on http://localhost:${PORT}`);
});