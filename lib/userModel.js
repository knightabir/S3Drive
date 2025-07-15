import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema); 