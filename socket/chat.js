const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { SOCKET_PORT } = require("../configs/server.config");
const cors = require("cors");
const chatModel = require("../models/chat/chat.model");
require("../configs/db.config");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
});

let users = [];

const addUser = (userId, socketId) => {
  console.log(userId, socketId);
  const userExists = users.some((user) => {
    user.userId === userId;
  });

  if (!userExists) {
    users.push({ userId, socketId });
    console.log("Current users list:", users);
  } else {
    console.log("User already exists:", userId);
  }
};
//getUser
const getUser = (userId) => {
  return users.find((user) => {
    user.userId === userId;
  });
};

//remove user
const removeUser = (socketId) => {
  users = users.filter((user) => {
    user.socketId !== socketId;
  });
};

io.on("connection", async (socket) => {
  console.log("socket connected successfully");
  console.log("dsga", socket.id);

  //userId and socketId from user
  socket.on("addUser", async (userId) => {
    if (userId) {
      addUser(userId, socket.id);
      socket.to(socket.id)
    }
  });

  //send message and get message
  socket.on("sendMessage", async ({ senderId, receiverId }) => {
    try {
      console.log("sendMessage", senderId);
      let data = [];
      data = await chatModel
        .find({
          $or: [
            {
              senderId,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        })
        .sort({ _id: -1 });
        
      const user = getUser(receiverId);
      console.log(user);
      if (user?.socketId) {
        const socketId = user.socketId;
        io.to(socketId).emit("getMessage", data);
        const latestMessage = data.length > 0 ? data[data.length - 1] : null;

        if (latestMessage) {
          const newMessage = {
            title: "Barn Chat",
            body: latestMessage?.message
              ? latestMessage.message
              : "You have new message",
          };

          io.to(socketId).emit("newNotification", newMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    removeUser(socket.id);
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`Server running on port ${SOCKET_PORT}`);
});
