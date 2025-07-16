const User = require('../models/user.model');
const { deleteCache, getCache, setCache } = require('../utils/cache');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await deleteCache(CACHE_KEY);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const CACHE_KEY = 'users:all';

const getUsers = async (req, res) => {
    try {
        const cachedUsers = await getCache(CACHE_KEY);

        if (cachedUsers) {
          console.log('✅ Cache hit');
          return res.status(200).json(cachedUsers);
        }
    
        const users = await User.find();
        await setCache(CACHE_KEY, users, 60);
        console.log('💾 Cache set');

        res.status(201).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = { createUser, getUsers };