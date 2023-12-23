// paymentModel.js
import mongoose from 'mongoose';


const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  transactionId: String,
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  // Other payment details...
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
