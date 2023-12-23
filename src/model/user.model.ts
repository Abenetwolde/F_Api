// Import the User model
import { Document, Model, model, Schema } from 'mongoose';

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
});

export interface IUser extends Document {
    // _id:String,
  telegramid: string;
  email: string;
  password: string;
  name: string;
  last: string;
  token: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  favorites: Array<Schema.Types.ObjectId>;
  orders:Array<Schema.Types.ObjectId>;
  subscriptions: Array<Schema.Types.ObjectId>;
  locale: string;
}

const userSchema = new Schema<IUser>({
  telegramid: {
    type: String,
    required:true
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  last: {
    type: String,
  },
  token: {
    type: String,
  },
  phone: String,
  address: addressSchema,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  locale: { type: String, default: 'en' },
});

// Export the User model
const User: Model<IUser> = model('User', userSchema);
export default User;
