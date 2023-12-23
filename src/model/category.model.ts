// categoryModel.js
import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  icon: { type: String},

});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
