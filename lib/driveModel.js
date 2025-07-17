import mongoose from 'mongoose';

const DriveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessKeyId: { type: String, required: true },
  secretAccessKey: { type: String, required: true },
  region: { type: String, required: true },
  bucketName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Drive || mongoose.model('Drive', DriveSchema); 