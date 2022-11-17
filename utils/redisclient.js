const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const onRedisError = (err) => {
  console.error(err);
};
const onRedisConnect = () => {
  console.log("Redis connected");
};
const onRedisReconnecting = () => {
  console.log("Redis reconnecting");
};
const onRedisReady = () => {
  console.log("Redis ready!");
};

const client = new Redis(process.env.REDIS_URL);

client.on("error", onRedisError);
client.on("connect", onRedisConnect);
client.on("reconnecting", onRedisReconnecting);
client.on("ready", onRedisReady);

module.exports = {
  getClient: () => client,
};
