import { Router } from 'express';
const router = Router();
import { 
    getAllUsers, 
    getUser, 
    addUser, 
    editUser, 
    deleteUser 
} from '../controller/user.js';

// Get all users (supports ?limit & ?sort)
router.get('/', getAllUsers);

// Get single user by numeric ID
router.get('/:id', getUser);

// Add a new user
router.post('/', addUser);

// Update a user completely or partially by numeric ID
router.put('/:id', editUser);
router.patch('/:id', editUser);

// Delete a user by numeric ID
router.delete('/:id', deleteUser);

export default router;
