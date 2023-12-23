// categoryRoutes.ts
import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controller/category'; // Import category controllers
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// POST /api/categories
router.route('/create').post(createCategory);

// GET /api/categories
router.route('/getcategories').get(getAllCategories);

// GET /api/categories/:categoryId
router.route('/getcategorybyid/:categoryId').get(getCategoryById);

// PUT /api/categories/:categoryId
router.route('/updatecategorybyid/:categoryId').put(updateCategory);

// DELETE /api/categories/:categoryId
router.route('/deletecategorybyid/:categoryId').delete(deleteCategory);

export default router;
