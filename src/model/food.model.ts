// productModel.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface defining the Product document structure
interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: mongoose.Types.ObjectId;
  images: string[];
  orderQuantity: number;
  cookTime: string;
  highlights:string[];

}

// Schema definition
const productSchema: Schema<IProduct> = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  highlights: [
    {
        type: String,
    }
],
  orderQuantity: { type: Number, default: 0 },
  cookTime: { type: String },
});

// Model definition
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
