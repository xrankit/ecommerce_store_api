import { find, findOne } from '../model/cart';

export function getAllCarts(req, res) {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);

	find({
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
}

export function getCartsbyUserid(req, res) {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);
	find({
		userId,
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
}

export function getSingleCart(req, res) {
	const id = req.params.id;
	findOne({
		id,
	})
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
}

export function addCart(req, res) {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		//     let cartCount = 0;
		// Cart.find().countDocuments(function (err, count) {
		//   cartCount = count
		//   })

		//     .then(() => {
		const cart = {
			id: 11,
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		};
		// cart.save()
		//   .then(cart => res.json(cart))
		//   .catch(err => console.log(err))

		res.json(cart);
		// })

		//res.json({...req.body,id:Cart.find().count()+1})
	}
}

export function editCart(req, res) {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		});
	}
}

export function deleteCart(req, res) {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		findOne({ id: req.params.id })
			.select('-_id -products._id')
			.then((cart) => {
				res.json(cart);
			})
			.catch((err) => console.log(err));
	}
}
