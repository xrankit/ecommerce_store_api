import { Router } from 'express';
const router = Router();

import {
  getAllCarts,
  getSingleCart,
  getCartsByUserid,
  addCart,
  editCart,
  deleteCart
} from '../controller/cart.js';

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
router.delete('/:id', deleteCart);

export default router;
