import { Request, Response } from 'express';
import Category from '../model/category.model';


export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    // Create a new category
    const newCategory = new Category({ name, icon });

    // Save the category to the database
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      category: savedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};
export const getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
  
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error!' });
    }
  };
  export const getCategoryById = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
  
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error!' });
    }
  };
  export const updateCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const { name, icon } = req.body;
  
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, icon },
        { new: true } // Return the updated category
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
  
      res.status(200).json({
        success: true,
        category: updatedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error!' });
    }
  };
  export const deleteCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
  
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
  
      res.status(200).json({
        success: true,
        category: deletedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error!' });
    }
  };
        