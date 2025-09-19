import Cart from "../model/cart.js";

// GET all carts (optional limit, sort, date range)
export async function getAllCarts(req, res) {
  try {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === "desc" ? -1 : 1;
    const startDate = req.query.startdate ? new Date(req.query.startdate) : new Date("1970-01-01");
    const endDate = req.query.enddate ? new Date(req.query.enddate) : new Date();

    const carts = await Cart.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .select("-_id -products._id")
      .limit(limit)
      .sort({ id: sort });

    res.json(carts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET carts by userId (with optional date range)
export async function getCartsByUserId(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const startDate = req.query.startdate ? new Date(req.query.startdate) : new Date("1970-01-01");
    const endDate = req.query.enddate ? new Date(req.query.enddate) : new Date();

    const carts = await Cart.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).select("-_id -products._id");

    res.json(carts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET single cart by numeric ID
export async function getSingleCart(req, res) {
  try {
    const id = parseInt(req.params.id);
    const cart = await Cart.findOne({ id }).select("-_id -products._id");

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ADD new cart
export async function addCart(req, res) {
  try {
    if (!req.body) return res.status(400).json({ message: "Data is required" });

    const { userId, date, products } = req.body;

    // auto-generate numeric ID
    const lastCart = await Cart.findOne().sort({ id: -1 });
    const newId = lastCart ? lastCart.id + 1 : 1;

    const newCart = new Cart({ id: newId, userId, date, products });
    const savedCart = await newCart.save();

    const response = savedCart.toObject();
    delete response._id; // remove Mongo ID
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// EDIT cart (PUT / PATCH)
export async function editCart(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!req.body) return res.status(400).json({ message: "Data is required" });

    // Only allow specific fields to be updated
    const allowedFields = ['userId', 'date', 'products'];
    const sanitizedBody = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        sanitizedBody[key] = req.body[key];
      }
    }
    if (Object.keys(sanitizedBody).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { id },
      { $set: sanitizedBody },
      { new: true }
    ).select("-_id -products._id");

    if (!updatedCart) return res.status(404).json({ message: "Cart not found" });
    res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE cart
export async function deleteCart(req, res) {
  try {
    const id = parseInt(req.params.id);
    const deletedCart = await Cart.findOneAndDelete({ id }).select("-_id -products._id");

    if (!deletedCart) return res.status(404).json({ message: "Cart not found" });
    res.json({ status: "success", message: "Cart deleted", cart: deletedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
