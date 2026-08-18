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
// Dummy Users
// ==========================================

const users = {
  1: {
    id: 1,
    name: "Chetan Sharma",
    email: "chetan@example.com",
  },

  2: {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@example.com",
  },

  3: {
    id: 3,
    name: "Amit Singh",
    email: "amit@example.com",
  },
};

// ==========================================
// API 1: GetUser - Unary RPC
// ==========================================

function getUser(call, callback) {
  const userId = call.request.id;

  console.log("GetUser request received:", userId);

  // Validate ID
  if (!userId || userId <= 0) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "User ID must be greater than 0",
    });
  }

  const user = users[userId];

  // User not found
  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found",
    });
  }

  callback(null, user);
}

// ==========================================
// API 2: CreateUser - Unary RPC
// ==========================================

function createUser(call, callback) {
  const { name, email } = call.request;

  console.log("CreateUser request received:");
  console.log("Name:", name);
  console.log("Email:", email);

  // Validate name
  if (!name || name.trim() === "") {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Name is required",
    });
  }

  // Validate email
  if (!email || email.trim() === "") {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Email is required",
    });
  }

  // Simple email validation
  if (!email.includes("@")) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Invalid email address",
    });
  }

  // Generate unique ID
  const newId =
    Math.max(...Object.keys(users).map(Number), 0) + 1;

  const newUser = {
    id: newId,
    name: name.trim(),
    email: email.trim(),
  };

  users[newId] = newUser;

  console.log("New user created:", newUser);

  callback(null, newUser);
}

// ==========================================
// API 3: UpdateUser - Unary RPC
// ==========================================

function updateUser(call, callback) {
  const { id, name, email } = call.request;

  console.log("UpdateUser request received:");
  console.log("ID:", id);
  console.log("Name:", name);
  console.log("Email:", email);

  // Validate ID
  if (!id || id <= 0) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Valid user ID is required",
    });
  }

  // Validate name
  if (!name || name.trim() === "") {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Name is required",
    });
  }

  // Validate email
  if (!email || !email.includes("@")) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Valid email is required",
    });
  }

  const user = users[id];

  // User not found
  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found",
    });
  }

  // Update user
  user.name = name.trim();
  user.email = email.trim();

  console.log("User updated:", user);

  callback(null, user);
}

// ==========================================
// API 4: DeleteUser - Unary RPC
// ==========================================

function deleteUser(call, callback) {
  const userId = call.request.id;

  console.log("DeleteUser request received:", userId);

  // Validate ID
  if (!userId || userId <= 0) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Valid user ID is required",
    });
  }

  const user = users[userId];

  // User not found
  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found",
    });
  }

  delete users[userId];

  console.log("User deleted:", user);

  callback(null, {
    id: userId,
    message: "User deleted successfully",
  });
}

// ==========================================
// API 5: GetUsers - Server Streaming RPC
// ==========================================

function getUsers(call) {
  console.log("GetUsers streaming request received");

  const userList = Object.values(users);

  if (userList.length === 0) {
    call.end();
    return;
  }

  userList.forEach((user, index) => {
    setTimeout(() => {
      console.log("Sending user:", user);

      call.write(user);

      if (index === userList.length - 1) {
        call.end();

        console.log("User stream completed");
      }
    }, index * 1000);
  });
}

// ==========================================
// API 6: CreateUsers - Client Streaming RPC
// ==========================================

function createUsers(call, callback) {
  console.log("CreateUsers client streaming started");

  let count = 0;

  call.on("data", (userData) => {
    console.log("User received from client:");
    console.log(userData);

    const { name, email } = userData;

    // Validate name
    if (!name || name.trim() === "") {
      console.log("Invalid user name received");
      return;
    }

    // Validate email
    if (!email || !email.includes("@")) {
      console.log("Invalid user email received");
      return;
    }

    // Generate unique ID
    const newId =
      Math.max(...Object.keys(users).map(Number), 0) + 1;

    const newUser = {
      id: newId,
      name: name.trim(),
      email: email.trim(),
    };

    users[newId] = newUser;

    count++;

    console.log("User created:", newUser);
  });

  call.on("end", () => {
    console.log("Client streaming completed");

    callback(null, {
      count,
      message: `${count} users created successfully`,
    });
  });

  call.on("error", (error) => {
    console.error("Client streaming error:", error.message);
  });
}

// ==========================================
// API 7: Chat - Bidirectional Streaming RPC
// ==========================================

function chat(call) {
  console.log("Chat stream connected");

  // Receive messages from client
  call.on("data", (chatMessage) => {
    console.log("Message received from client:");
    console.log(chatMessage);

    // Validate message
    if (
      !chatMessage.message ||
      chatMessage.message.trim() === ""
    ) {
      call.write({
        username: "Server",
        message: "Message cannot be empty",
      });

      return;
    }

    // Send response to client
    call.write({
      username: "Server",
      message: `Received: ${chatMessage.message}`,
    });
  });

  // Client stream closed
  call.on("end", () => {
    console.log("Chat stream ended");

    call.end();
  });

  // Error handling
  call.on("error", (error) => {
    console.error("Chat stream error:", error.message);
  });
}

// ==========================================
// Create gRPC Server
// ==========================================

const server = new grpc.Server();

// ==========================================
// Register APIs
// ==========================================

server.addService(userProto.UserService.service, {
  GetUser: getUser,
  CreateUser: createUser,
  UpdateUser: updateUser,
  DeleteUser: deleteUser,
  GetUsers: getUsers,
  CreateUsers: createUsers,
  Chat: chat,
});

// ==========================================
// Start Server
// ==========================================

const PORT = "50051";

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Server failed to start:", error);
      return;
    }

    console.log(`gRPC Server running on port ${port}`);
  }
);