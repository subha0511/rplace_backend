const redis = require("./utils/redisclient");

const redisClient = redis.getClient();

module.exports = (io, socket) => {
  const setCellColor = async (payload) => {
    const { row, col, color } = payload;
    const offset = (row * 100 + col) * 4;
    const colorStr = Number(color).toString(2).slice(-4).padStart(4, "0");

    // await redisClient.bitfield("board", "SET", "u4", "#" + offset, color);

    await redisClient
      .multi()
      .setbit("board", offset + 0, colorStr.charAt(0))
      .setbit("board", offset + 1, colorStr.charAt(1))
      .setbit("board", offset + 2, colorStr.charAt(2))
      .setbit("board", offset + 3, colorStr.charAt(3))
      .exec((err, results) => {
        if (!err) {
          socket.emit("status", payload);
          socket.broadcast.emit("getCell", { ...payload, colorStr });
        } else {
          socket.emit("status", "Failed");
        }
      });
  };

  socket.on("setCell", setCellColor);
};
