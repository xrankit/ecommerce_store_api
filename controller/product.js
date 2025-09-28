import Product from '../model/product.js';
import Counter from '../model/counter.js';

// ✅ Helper function to get next sequence
async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // if not exists, create
    );
    return counter.seq;
}

// Get all products
export async function getAllProducts(req, res) {
    try {
        const limit = Number(req.query.limit) || 0;
        const sort = req.query.sort === 'desc' ? -1 : 1;

        const products = await Product.find()
            .select('-_id')
            .limit(limit)
            .sort({ id: sort });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get single product by id
export async function getProduct(req, res) {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id }).select('-_id');

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get all product categories
export async function getProductCategories(req, res) {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get products in a category
export async function getProductsInCategory(req, res) {
    try {
        const category = req.params.category;
        const limit = Number(req.query.limit) || 0;
        const sort = req.query.sort === 'desc' ? -1 : 1;

        const products = await Product.find({ category })
            .select('-_id')
            .limit(limit)
            .sort({ id: sort });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ✅ Add a new product with counter-based id
export async function addProduct(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ status: 'error', message: 'data is undefined' });
    }

    try {
        const newId = await getNextSequence("productId"); // counter.js used here

        const newProduct = new Product({
            id: newId,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
        });

        const savedProduct = await newProduct.save();
        const response = savedProduct.toObject();
        delete response._id; // remove Mongo _id
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Edit a product (PUT / PATCH)
export async function editProduct(req, res) {
    if (!req.body || !req.params.id) {
        return res.status(400).json({ status: 'error', message: 'Invalid request data' });
    }

    try {
        const id = parseInt(req.params.id);
        const allowedUpdates = ['title', 'description', 'category', 'price', 'image', 'rating'];
        const update = {};

        for (const key of allowedUpdates) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                const value = req.body[key];
                if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Invalid value for field '${key}': must not be object or array`,
                    });
                }
                update[key] = value;
            }
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ status: 'error', message: 'No valid fields to update' });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            { $set: update },
            { new: true }
        ).select('-_id');

        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete a product
export async function deleteProduct(req, res) {
    if (!req.params.id) {
        return res.status(400).json({ status: 'error', message: 'product id should be provided' });
    }

    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOneAndDelete({ id }).select('-_id');

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json({ message: 'Product deleted', ...product.toObject() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
