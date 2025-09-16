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

// Rate limiter for editing users (PUT/PATCH)
const editUserLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many update requests from this IP, please try again later.'
});

// Rate limiter for adding users (POST)
const addUserLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many user creation requests from this IP, please try again later.'
});

// Rate limiter for fetching all users (GET /)
const getAllUsersLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: 'Too many requests for user list from this IP, please try again later.'
});

// Rate limiter for fetching a single user (GET by ID)
const getUserLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: 'Too many requests for this user from this IP, please try again later.'
});

// Get all users (supports ?limit & ?sort)
router.get('/', getAllUsersLimiter, getAllUsers);

// Get single user by numeric ID
router.get('/:id', getUserLimiter, getUser);

// Add a new user
router.post('/', addUserLimiter, addUser);

// Update a user completely or partially by numeric ID
router.put('/:id', editUserLimiter, editUser);
router.patch('/:id', editUserLimiter, editUser);

// Delete a user by numeric ID
router.delete('/:id', deleteUserLimiter, deleteUser);

export default router;
