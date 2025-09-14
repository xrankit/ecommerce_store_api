import supertest from 'supertest';
import app from '../app.js';

describe('Cart API', () => {
	it('should get all carts', async () => {
		const response = await supertest(app).get('/carts');
		expect(response.status).toBe(200);
		console.log(response.body);
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBeGreaterThan(0);
	});

	it('should get a single cart by ID', async () => {
		const response = await supertest(app).get('/carts/2');
		expect(response.status).toBe(200);
		console.log(response.body);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty('userId');
		expect(response.body).not.toHaveProperty('_id');
	});

	it('should get carts in a date range with limit & sort', async () => {
		const response = await supertest(app).get(
			'/carts?limit=2&sort=desc&startdate=2019-12-10&enddate=2020-10-10'
		);
		expect(response.status).toBe(200);
		console.log('querystring carts', response.body);
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBeLessThanOrEqual(2);
	});

	it('should get carts for a user in date range', async () => {
		const response = await supertest(app).get(
			'/carts/user/1?startdate=2019-12-10&enddate=2020-10-10'
		);
		expect(response.status).toBe(200);
		console.log('user carts with date range', response.body);
		expect(response.body).toBeInstanceOf(Array);
	});

	it('should get carts for a user without start date', async () => {
		const response = await supertest(app).get('/carts/user/1?enddate=2020-10-10');
		expect(response.status).toBe(200);
		console.log('user carts without start date', response.body);
		expect(response.body).toBeInstanceOf(Array);
	});

	it('should get carts for a user without end date', async () => {
		const response = await supertest(app).get('/carts/user/1?startdate=2019-12-10');
		expect(response.status).toBe(200);
		console.log('user carts without end date', response.body);
		expect(response.body).toBeInstanceOf(Array);
	});

	it('should get carts for a user (no dates)', async () => {
		const response = await supertest(app).get('/carts/user/1');
		expect(response.status).toBe(200);
		console.log('user carts', response.body);
		expect(response.body).toBeInstanceOf(Array);
	});

	it('should add a new cart', async () => {
		const response = await supertest(app).post('/carts').send({
			userId: 1,
			date: new Date('2020-10-10'),
			products: [
				{ productId: 2, quantity: 4 },
				{ productId: 1, quantity: 10 },
				{ productId: 5, quantity: 2 },
			],
		});
		expect(response.status).toBe(201); // ✅ resource creation
		console.log(response.body);
		expect(response.body).toHaveProperty('id');
		expect(response.body.products).toBeInstanceOf(Array);
	});

	it('should update (PUT) a cart', async () => {
		const response = await supertest(app).put('/carts/2').send({
			userId: 1,
			date: new Date('2020-10-10'),
			products: [
				{ productId: 2, quantity: 4 },
				{ productId: 1, quantity: 10 },
				{ productId: 5, quantity: 2 },
			],
		});
		expect(response.status).toBe(200);
		console.log(response.body);
		expect(response.body).toHaveProperty('id');
		expect(response.body.userId).toBe(1);
	});

	it('should partially update (PATCH) a cart', async () => {
		const response = await supertest(app).patch('/carts/2').send({
			products: [{ productId: 3, quantity: 7 }],
		});
		expect(response.status).toBe(200);
		console.log(response.body);
		expect(response.body).toHaveProperty('id');
		expect(response.body.products[0]).toHaveProperty('productId');
	});

	it('should delete a cart', async () => {
		const response = await supertest(app).delete('/carts/2');
		expect(response.status).toBe(200);
		console.log(response.body);
		expect(response.body).toHaveProperty('status', 'success'); // ✅ match controller
		expect(response.body).toHaveProperty('cart');
	});
});
