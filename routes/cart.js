import { Router } from 'express'
const router = Router()
import { getAllCarts, getSingleCart, getCartsByUserid, addCart, editCart, deleteCart } from '../controller/cart.js';

router.get('/',getAllCarts)
router.get('/:id',getSingleCart)
router.get('/user/:userid',getCartsByUserid)

router.post('/',addCart)
//router.post('/:id',cart.addtoCart)

router.put('/:id',editCart)
router.patch('/:id',editCart)
router.delete('/:id',deleteCart)

export default router;
