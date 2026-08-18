const WebSocket = require("ws");

// ==========================================
// Create WebSocket Server
// ==========================================

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({
  port: PORT,
});

// ==========================================
// Connection
// ==========================================

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Welcome message
  ws.send("Welcome to WebSocket server!");

  // Receive message
  ws.on("message", (message) => {
    const clientMessage = message.toString();

    console.log("Message received:", clientMessage);

    // Send response
    ws.send(`Server received: ${clientMessage}`);
  });

  // Client disconnected
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Error
  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});

// ==========================================
// Server Started
// ==========================================

console.log(`WebSocket server running on port ${PORT}`);