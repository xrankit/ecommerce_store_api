import Cart from "../model/cart.js";

// GET all carts (with optional limit, sort, date range)
export async function getAllCarts(req, res) {
  try {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === "desc" ? -1 : 1;
    const startDate = new Date(req.query.startdate || "1970-01-01");
    const endDate = new Date(req.query.enddate || new Date());

    const carts = await Cart.find({
      date: { $gte: startDate, $lt: endDate },
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

// GET carts by userId
export async function getCartsByUserid(req, res) {
  try {
    const userId = req.params.userid;
    const startDate = new Date(req.query.startdate || "1970-01-01");
    const endDate = new Date(req.query.enddate || new Date());

    const carts = await Cart.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    }).select("-_id -products._id");

    res.json(carts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET single cart by ID
export async function getSingleCart(req, res) {
  try {
    const id = req.params.id;
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
    if (!req.body) {
      return res.status(400).json({ message: "Data is required" });
    }

    const { userId, date, products } = req.body;

    // auto-generate id (count + 1)
    const count = await Cart.countDocuments();
    const newCart = new Cart({
      id: count + 1,
      userId,
      date,
      products,
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// EDIT cart
export async function editCart(req, res) {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res.status(400).json({ message: "Data is required" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { id },
      req.body,
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
    const id = req.params.id;
    const deletedCart = await Cart.findOneAndDelete({ id });

    if (!deletedCart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted successfully", cart: deletedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
