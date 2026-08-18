const express = require("express");

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(express.json());

// ==========================================
// Home / Health Route
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "gRPC Project REST API is running",
    status: "success",
  });
});

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
// Get Single User
// ==========================================

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  // Validate ID
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = users.find((user) => user.id === userId);

  // User not found
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
});

// ==========================================
// GET /users
// Get All Users
// ==========================================

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// ==========================================
// POST /users
// Create User
// ==========================================

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validate name
  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  // Validate email
  if (!email || email.trim() === "") {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  // Simple email validation
  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  // Generate unique ID
  const newId =
    Math.max(...users.map((user) => user.id), 0) + 1;

  const newUser = {
    id: newId,
    name: name.trim(),
    email: email.trim(),
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// ==========================================
// PUT /users/:id
// Update User
// ==========================================

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const { name, email } = req.body;

  // Validate ID
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  // Validate name
  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  // Validate email
  if (!email || !email.includes("@")) {
    return res.status(400).json({
      message: "Valid email is required",
    });
  }

  const user = users.find((user) => user.id === userId);

  // User not found
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Update user
  user.name = name.trim();
  user.email = email.trim();

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

// ==========================================
// DELETE /users/:id
// Delete User
// ==========================================

app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  // Validate ID
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const userIndex = users.findIndex(
    (user) => user.id === userId
  );

  // User not found
  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

// ==========================================
// 404 Route
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==========================================
// Start REST Server
// ==========================================

// IMPORTANT:
// Render provides the PORT environment variable.
// Locally it will use port 3000.

const PORT = process.env.PORT || 3000;

// IMPORTANT:
// 0.0.0.0 is required for Render.

app.listen(PORT, "0.0.0.0", () => {
  console.log(`REST API running on port ${PORT}`);
});