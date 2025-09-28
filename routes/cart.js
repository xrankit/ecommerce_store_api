import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import {
  getAllCarts,
  getSingleCart,
  getCartsByUserId,
  addCart,
  editCart,
  deleteCart
} from '../controller/cart.js';

const router = Router();

// 🔒 Strict rate limiter for destructive actions
const deleteCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many delete requests from this IP, please try again later'
});

// 🔒 Moderate rate limiter for edit actions
const editCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many update requests from this IP, please try again later'
});

// 🔒 Shared rate limiter for reads
const readCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// 🔒 Rate limiter for adding carts
const addCartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many add cart requests from this IP, please try again later'
});

// 📌 Routes
router.get('/user/:userId', readCartLimiter, getCartsByUserId);
router.get('/', readCartLimiter, getAllCarts);
router.get('/:id', readCartLimiter, getSingleCart);

router.post('/', addCartLimiter, addCart);

router.put('/:id', editCartLimiter, editCart);
router.patch('/:id', editCartLimiter, editCart);

router.delete('/:id', deleteCartLimiter, deleteCart);

export default router;
