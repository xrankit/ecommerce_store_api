import { Router } from 'express';
import rateLimit from 'express-rate-limit';
const router = Router();
import { 
    getAllUsers, 
    getUser, 
    addUser, 
    editUser, 
    deleteUser 
} from '../controller/user.js';

// Rate limiter for destructive actions like deleting users
const deleteUserLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many delete requests from this IP, please try again later.'
});

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
router.delete('/:id', deleteUserLimiter, deleteUser);

export default router;
