const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: {type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user'},
  pic: { type: String, default: 'https://avatars.githubusercontent.com/u/101376166' }
});

module.exports = mongoose.model('User', userSchema);
