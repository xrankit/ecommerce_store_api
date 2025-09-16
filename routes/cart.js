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

// Moderate rate limiter for edit (update/patch) actions
const editCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 edit requests per windowMs
  message: 'Too many update requests from this IP, please try again later'
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
router.put('/:id', editCartLimiter, editCart);
router.patch('/:id', editCartLimiter, editCart);

// Delete cart
router.delete('/:id', deleteCartLimiter, deleteCart);

export default router;
