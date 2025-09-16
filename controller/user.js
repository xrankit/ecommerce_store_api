import User from '../model/user.js';

// ✅ Get all users
export async function getAllUsers(req, res) {
    try {
        const limit = Number(req.query.limit) || 0;
        const sort = req.query.sort === 'desc' ? -1 : 1;

        const users = await User.find()
            .select('-_id')
            .limit(limit)
            .sort({ id: sort });

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ✅ Get single user by numeric ID
export async function getUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOne({ id }).select('-_id');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ✅ Add new user
export async function addUser(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Request body is missing',
            });
        }

        // Auto-increment numeric ID
        const lastUser = await User.findOne().sort({ id: -1 });
        const newId = lastUser ? lastUser.id + 1 : 1;

        const newUser = new User({
            id: newId,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password, // ⚠️ in production, hash with bcrypt
            name: req.body.name || { firstname: '', lastname: '' },
            address: req.body.address || {},
            phone: req.body.phone || '',
        });

        const savedUser = await newUser.save();
        const response = savedUser.toObject();
        delete response._id; // hide Mongo _id
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ✅ Edit user (PUT / PATCH)
export async function editUser(req, res) {
    try {
        if (!req.body || !req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request',
            });
        }

        const id = parseInt(req.params.id);
        const allowedFields = ['email', 'username', 'name', 'address', 'phone'];
        const safeUpdate = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                safeUpdate[key] = req.body[key];
            }
        }
        if (Object.keys(safeUpdate).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No valid fields to update',
            });
        }
        const updatedUser = await User.findOneAndUpdate(
            { id },
            { $set: safeUpdate },
            { new: true }
        ).select('-_id');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ✅ Delete user
export async function deleteUser(req, res) {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID should be provided',
            });
        }

        const id = parseInt(req.params.id);
        const deletedUser = await User.findOneAndDelete({ id }).select('-_id');

        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.json({ status: 'success', message: 'User deleted', user: deletedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
