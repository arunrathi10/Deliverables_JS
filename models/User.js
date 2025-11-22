const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const dataSchemaObj = {
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Will be hashed by passport-local-mongoose
  created: { type: Date, default: Date.now },
};

const UserSchema = new mongoose.Schema(dataSchemaObj);
UserSchema.plugin(plm);

module.exports = mongoose.model('User', UserSchema);