const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());

const RedisStore = require("rate-limit-redis").default;
const Redis = require("ioredis");

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379
});

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    console.log(`🚫 Rate limited: ${req.ip}`);
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

app.use(limiter);
// Health check
app.get("/", (req, res) => {
  console.log(`✅ Allowed: ${req.ip}`);
  res.status(200).json({ message: "API is running" });
});

app.use("/api/users", userRoutes);

module.exports = app;