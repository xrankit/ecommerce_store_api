//initializes
import { set, connect } from 'mongoose';
import express, { static as expressStatic, urlencoded, json } from 'express';
import cors from 'cors';
import { join } from 'path';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
const myEnv = config();
expand(myEnv);

//app
const app = express();

//port
const port = process.env.PORT || 6400;

//routes
import productRoute from './routes/product';
import homeRoute from './routes/home';
import cartRoute from './routes/cart';
import userRoute from './routes/user';
import authRoute from './routes/auth';

//middleware
app.use(cors());

app.use(expressStatic(join(__dirname, '/public')));
app.use(urlencoded({ extended: true }));
app.use(json());

//view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.disable('view cache');

app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

//mongoose
set('useFindAndModify', false);
set('useUnifiedTopology', true);
connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	.then(() => {
		app.listen(port, () => {
			console.log('connect');
		});
	})
	.catch((err) => {
		console.log(err);
	});

export default app;
