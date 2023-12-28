import mongoose from 'mongoose';


const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Number,required: true },
  items: [orderItemSchema],
  note:{String},
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  deliverydate: { type: Date},
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
