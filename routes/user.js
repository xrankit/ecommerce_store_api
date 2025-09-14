import { Router } from 'express'
const router = Router()
import { getAllUser, getUser, addUser, editUser, deleteUser } from '../controller/user.js'

router.get('/',getAllUser)
router.get('/:id',getUser)
router.post('/',addUser)
router.put('/:id',editUser)
router.patch('/:id',editUser)
router.delete('/:id',deleteUser)

export default router;