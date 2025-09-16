import { Router } from 'express';
const router = Router();

import rateLimit from 'express-rate-limit';
import {
  getAllCarts,
  getSingleCart,
  getCartsByUserid,
  addCart,
  editCart,
  deleteCart
} from '../controller/cart.js';

// Strict rate limiter for destructive actions
const deleteCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 delete requests per windowMs
  message: 'Too many delete requests from this IP, please try again later'
});

// More specific route first
router.get('/user/:userid', getCartsByUserid);

// Get all carts (optional query params)
router.get('/', getAllCarts);

// Get single cart by numeric ID
router.get('/:id', getSingleCart);

// Add new cart
router.post('/', addCart);

// Update cart (full or partial)
router.put('/:id', editCart);
router.patch('/:id', editCart);

// Delete cart
router.delete('/:id', deleteCartLimiter, deleteCart);

export default router;
