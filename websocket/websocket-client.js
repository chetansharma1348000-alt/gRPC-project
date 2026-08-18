const WebSocket = require("ws");

// ==========================================
// Render WebSocket URL
// ==========================================

const ws = new WebSocket(
  "wss://grpc-project-1-wlyy.onrender.com"
);

// ==========================================
// Connection Open
// ==========================================

ws.on("open", () => {
  console.log("Connected to Render WebSocket server");

  ws.send("Hello Render!");
  ws.send("How are you?");
  ws.send("This is deployed WebSocket!");
});

// ==========================================
// Receive Messages
// ==========================================

ws.on("message", (message) => {
  console.log("Server:", message.toString());
});

// ==========================================
// Connection Closed
// ==========================================

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

// ==========================================
// Error
// ==========================================

ws.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});