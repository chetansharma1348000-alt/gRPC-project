const WebSocket = require("ws");

// ==========================================
// Connect to WebSocket Server
// ==========================================

const socket = new WebSocket("ws://localhost:8080");

// ==========================================
// Connection Open
// ==========================================

socket.on("open", () => {
  console.log("Connected to WebSocket server");

  // Message 1
  socket.send("Hello Server!");

  // Message 2
  setTimeout(() => {
    socket.send("How are you?");
  }, 1000);

  // Message 3
  setTimeout(() => {
    socket.send("This is WebSocket!");
  }, 2000);
});

// ==========================================
// Receive Messages
// ==========================================

socket.on("message", (data) => {
  const response = JSON.parse(data.toString());

  console.log("Server:", response.message);
});

// ==========================================
// Connection Close
// ==========================================

socket.on("close", () => {
  console.log("WebSocket connection closed");
});

// ==========================================
// Error
// ==========================================

socket.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});