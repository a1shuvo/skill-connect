// models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending","accepted","completed","rejected"], default: "pending" },
  scheduledAt: { type: Date },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
