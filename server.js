// modules
import express, { static as expressStatic, urlencoded, json } from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { set, connect } from 'mongoose';
import { fileURLToPath } from 'url';

// routes
import productRoute from './routes/product.js';
import homeRoute from './routes/home.js';
import cartRoute from './routes/cart.js';
import userRoute from './routes/user.js';
import authRoute from './routes/auth.js';

// env
const myEnv = config();
expand(myEnv);

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// app
const app = express();
const port = process.env.PORT || 6400;

// middleware
app.use(cors());
app.use(expressStatic(join(__dirname, '/public')));
app.use(urlencoded({ extended: true }));
app.use(json());

// view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.disable('view cache');

// routes
app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

// mongoose
set('useFindAndModify', false);

connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(port, () => console.log(`Server running on port ${port}`));
	})
	.catch((err) => console.error(err));

export default app;
