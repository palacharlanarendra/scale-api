const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Simple wrapper functions
const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('❌ Redis GET error:', err);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 60) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    console.error('❌ Redis SET error:', err);
  }
};

const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('❌ Redis DEL error:', err);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
};
