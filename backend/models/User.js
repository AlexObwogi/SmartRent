const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tenant', 'landlord'], default: 'tenant' }
});

// Day 2 Requirement: Hash passwords before saving
// We use a regular function (not an arrow function) so we can use "this"
UserSchema.pre('save', async function() {
  // If the password hasn't changed, don't hash it again
  if (!this.isModified('password')) return;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);