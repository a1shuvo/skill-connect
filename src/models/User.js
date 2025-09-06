// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // hashed password (null for social accounts)
  role: { type: String, enum: ["admin","provider","customer"], default: "customer" },
  joinDate: { type: Date, default: Date.now },
  activeStatus: { type: Boolean, default: true },
  image: { type: String }, // avatar / from OAuth
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
