const WebSocket = require("ws");

// ==========================================
// Create WebSocket Server
// ==========================================

const wss = new WebSocket.Server({
  port: 8080,
});

// ==========================================
// Client Connection
// ==========================================

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  // Send welcome message
  socket.send(
    JSON.stringify({
      type: "welcome",
      message: "Welcome to WebSocket server!",
    })
  );

  // Receive message from client
  socket.on("message", (data) => {
    const message = data.toString();

    console.log("Message received:", message);

    // Send response
    socket.send(
      JSON.stringify({
        type: "response",
        message: `Server received: ${message}`,
      })
    );
  });

  // Client disconnected
  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  // Error
  socket.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});

// ==========================================
// Server Started
// ==========================================

console.log("WebSocket server running on ws://localhost:8080");