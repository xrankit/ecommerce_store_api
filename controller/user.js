import User from '../model/user.js';

// ✅ Get all users
export async function getAllUser(req, res) {
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

// ✅ Get single user by ID
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
		if (!req.body) {
			return res.status(400).json({
				status: 'error',
				message: 'Request body is missing',
			});
		}

		const userCount = await User.countDocuments();

		const newUser = new User({
			id: userCount + 1,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password, // ❌ in production: hash with bcrypt
			name: {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
			},
			address: {
				city: req.body.address?.city,
				street: req.body.address?.street,
				number: req.body.address?.number,
				zipcode: req.body.address?.zipcode,
				geolocation: {
					lat: req.body.address?.geolocation?.lat,
					long: req.body.address?.geolocation?.long,
				},
			},
			phone: req.body.phone,
		});

		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
}

// ✅ Edit user
export async function editUser(req, res) {
	try {
		if (!req.body || !req.params.id) {
			return res.status(400).json({
				status: 'error',
				message: 'Invalid request',
			});
		}

		const id = parseInt(req.params.id);
		const updatedUser = await User.findOneAndUpdate(
			{ id },
			{ $set: req.body },
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
