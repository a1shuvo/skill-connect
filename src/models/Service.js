// models/Service.js
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, required: true },
  location: { type: String },
  availability: { type: Object }, // shape as you prefer (e.g. slots)
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
