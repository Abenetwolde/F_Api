// Import the User model
import { Document, Model, model, Schema } from 'mongoose';

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
});
const LanguageEnum = {
  EN: 'en',
  RU: 'ru',
};
export interface IUser extends Document {
    // _id:String,
  telegramid: Number;
  email: string;
  password: string;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
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
  language: string;
  is_bot:Boolean
}

const userSchema = new Schema<IUser>({
  telegramid: {
    type: Number,
    required:true
  },
  email: {
    type: String,
  },

  password: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username:{
    type: String,
  },
  is_bot:{
    type: Boolean,
  },
 
  token: {
    type: String,
  },
  phone: String,
  address: addressSchema,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  language:   {
    type: String,
    default: LanguageEnum.EN,
    enum: Object.values(LanguageEnum),
  },
});

// Export the User model
const User: Model<IUser> = model('User', userSchema);
export default User;
