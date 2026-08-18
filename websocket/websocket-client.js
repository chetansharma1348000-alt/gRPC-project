const WebSocket = require("ws");

// ==========================================
// Render WebSocket URL
// ==========================================

const WS_URL = "wss://grpc-project-1-wlyy.onrender.com";

// ==========================================
// Create WebSocket Connection
// ==========================================

const ws = new WebSocket(WS_URL);

// ==========================================
// Connection Open
// ==========================================

ws.on("open", () => {
  console.log("==========================================");
  console.log("CONNECTED TO RENDER WEBSOCKET SERVER");
  console.log("==========================================");

  // Send messages to server
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

ws.on("close", (code, reason) => {
  console.log("==========================================");
  console.log("WEBSOCKET CONNECTION CLOSED");
  console.log("Code:", code);
  console.log(
    "Reason:",
    reason ? reason.toString() : "No reason provided"
  );
  console.log("==========================================");
});

// ==========================================
// WebSocket Error
// ==========================================

ws.on("error", (error) => {
  console.error("==========================================");
  console.error("WEBSOCKET ERROR");
  console.error("Error:", error.message);
  console.error("==========================================");
});