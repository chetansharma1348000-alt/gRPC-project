const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// ==========================================
// Proto file
// ==========================================

const PROTO_PATH = path.join(__dirname, "../proto/user.proto");

// ==========================================
// Load Proto
// ==========================================

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// ==========================================
// Load gRPC package
// ==========================================

const userProto =
  grpc.loadPackageDefinition(packageDefinition).user;

// ==========================================
// Create gRPC Client
// ==========================================

const client = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// ==========================================
// Bidirectional Streaming Chat
// ==========================================

console.log("\n========== BIDIRECTIONAL CHAT ==========\n");

const stream = client.Chat();

// ==========================================
// Receive messages from Server
// ==========================================

stream.on("data", (message) => {
  console.log("Server:", message.message);
});

// ==========================================
// Stream completed
// ==========================================

stream.on("end", () => {
  console.log("\n========== CHAT ENDED ==========");
});

// ==========================================
// Error handling
// ==========================================

stream.on("error", (error) => {
  console.error("Chat Error:", error.message);
});

// ==========================================
// Send Message 1
// ==========================================

stream.write({
  username: "Chetan",
  message: "Hello Server!",
});

// ==========================================
// Send Message 2
// ==========================================

setTimeout(() => {
  stream.write({
    username: "Chetan",
    message: "How are you?",
  });
}, 1000);

// ==========================================
// Send Message 3
// ==========================================

setTimeout(() => {
  stream.write({
    username: "Chetan",
    message: "This is gRPC Chat!",
  });
}, 2000);

// ==========================================
// Close stream
// ==========================================

setTimeout(() => {
  stream.end();
}, 3000);