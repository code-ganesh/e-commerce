const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.register = async (req, res) => {
  try {
    const {  name, username, password, pic } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    user = new User({ name, username, password, pic });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Sign out successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, username, password, pic } = req.body;

    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Hash password

    if (name) user.name = name;
    if (username) user.username = username;
    if (pic) user.pic = pic;

    const salt = await bcrypt.genSalt(10);
    if (password) user.password = await bcrypt.hash(password, salt); 

    // Save user to database

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.query;

    // Check if user exists
    let user
    user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Delete user from database
    await User.deleteOne({ username });

    res.json({ message: 'User deleted' });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}


