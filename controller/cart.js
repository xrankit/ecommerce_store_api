import Cart from "../model/cart.js";
import Counter from "../model/counter.js";

// helper to safely parse date
function parseDate(value, fallback) {
  const date = new Date(value);
  return isNaN(date) ? fallback : date;
}

// GET all carts
export async function getAllCarts(req, res) {
  try {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === "desc" ? -1 : 1;
    const startDate = parseDate(req.query.startdate, new Date("1970-01-01"));
    const endDate = parseDate(req.query.enddate, new Date());

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

// GET carts by userId
export async function getCartsByUserId(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const startDate = parseDate(req.query.startdate, new Date("1970-01-01"));
    const endDate = parseDate(req.query.enddate, new Date());

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

// GET single cart
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

// ADD new cart (safe auto-increment)
export async function addCart(req, res) {
  try {
    if (!req.body) return res.status(400).json({ message: "Data is required" });

    const { userId, date, products } = req.body;

    // get next sequence number safely
    const counter = await Counter.findOneAndUpdate(
      { name: "cartId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newCart = new Cart({
      id: counter.value,
      userId,
      date,
      products,
    });

    const savedCart = await newCart.save();
    const response = savedCart.toObject();
    delete response._id;

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// EDIT cart
export async function editCart(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!req.body) return res.status(400).json({ message: "Data is required" });

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
