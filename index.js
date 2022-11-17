const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const redis = require("./utils/redisclient");
const redisClient = redis.getClient();

// MIDDLEWARES;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/resetboard", async (req, res) => {
  await redisClient.set("board", "");
  res.send("Board reset successful");
});

app.get("/getboard", async (req, res) => {
  const board = await redisClient.getBuffer("board");
  res.send(board);
});

app.get("/getbit", async (req, res) => {
  const value = await redisClient.getbit("board", req.body.offset);
  res.send({ value });
});

const registerWebsocketHandler = require("./websocketHandler.js");

const onConnection = (socket) => {
  console.log("a user connected", socket.id);
  registerWebsocketHandler(io, socket);
  socket.conn.on("close", (reason) => {
    console.log("a user disconnected", socket.id, reason);
  });
};

io.on("connection", onConnection);

server.listen(2345, () => {
  console.log("listening on *:2345");
});
